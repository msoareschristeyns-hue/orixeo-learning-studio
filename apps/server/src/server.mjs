import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { buildCharacterInstructions, buildCharacterRequest, safeCharacterView } from '../../../packages/ai-characters/src/index.mjs';
import { observeMessage, observeDecision, aggregateSkillEvidence } from '../../../packages/skills-engine/src/index.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const webRoot = path.join(repoRoot, 'apps/web');
const scenarioPath = path.join(repoRoot, 'examples/novatech-achats-simulation.json');
const port = Number(process.env.PORT || 8080);
const openAIKey = process.env.OPENAI_API_KEY || '';
const textModel = process.env.OPENAI_TEXT_MODEL || 'gpt-5.6';
const liveModel = process.env.OPENAI_LIVE_MODEL || 'gpt-live-1';
const openAIBase = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

const sessions = new Map();
let scenarioCache = null;

async function loadScenario() {
  if (!scenarioCache) scenarioCache = JSON.parse(await readFile(scenarioPath, 'utf8'));
  return scenarioCache;
}

function publicScenario(scenario) {
  return {
    ...scenario,
    characters: (scenario.characters || []).map(safeCharacterView)
  };
}

function json(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(data),
    'cache-control': 'no-store'
  });
  res.end(data);
}

function text(res, status, body, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(status, {
    'content-type': contentType,
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store'
  });
  res.end(body);
}

async function readBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 1_000_000) throw new Error('request_too_large');
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  const raw = Buffer.concat(chunks).toString('utf8');
  return JSON.parse(raw);
}

function getSession(id) {
  const session = sessions.get(id);
  if (!session) {
    const error = new Error('session_not_found');
    error.status = 404;
    throw error;
  }
  return session;
}

function getCharacter(scenario, id) {
  const character = (scenario.characters || []).find(item => item.id === id);
  if (!character) {
    const error = new Error('character_not_found');
    error.status = 404;
    throw error;
  }
  return character;
}

function eligibleEvents(scenario, turn, fired) {
  return (scenario.events || []).filter(event => {
    if (fired.includes(event.id)) return false;
    return event.trigger?.type === 'turn' && turn >= Number(event.trigger.value || 0);
  });
}

function extractOutputText(payload) {
  if (typeof payload?.output_text === 'string' && payload.output_text.trim()) return payload.output_text.trim();
  for (const item of payload?.output || []) {
    if (item?.type !== 'message') continue;
    for (const part of item.content || []) {
      if ((part.type === 'output_text' || part.type === 'text') && part.text) return String(part.text).trim();
    }
  }
  return '';
}

async function callCharacterAI({ scenario, character, session, learnerMessage }) {
  if (!openAIKey) {
    const known = character.knownFacts?.[0];
    return known
      ? `De mon point de vue de ${character.role.toLowerCase()}, ${known.charAt(0).toLowerCase()}${known.slice(1)}`
      : 'Je n’ai pas assez d’éléments pour vous répondre précisément. Quelle information cherchez-vous à vérifier ?';
  }

  const characterHistory = session.messages
    .filter(item => !item.characterId || item.characterId === character.id)
    .slice(-12)
    .map(item => ({
      role: item.actor === 'character' ? 'assistant' : 'user',
      content: item.content
    }));

  const request = buildCharacterRequest({
    scenario,
    character,
    history: characterHistory,
    revealedFacts: session.revealedFacts,
    learnerMessage
  });

  const response = await fetch(`${openAIBase}/responses`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${openAIKey}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: textModel,
      instructions: request.instructions,
      input: request.input,
      max_output_tokens: 260,
      metadata: {
        product: 'orixeo-learning-studio',
        scenario_id: scenario.id,
        character_id: character.id,
        session_id: session.id
      }
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload?.error?.message || 'openai_response_failed');
    error.status = 502;
    throw error;
  }
  const answer = extractOutputText(payload);
  if (!answer) throw Object.assign(new Error('empty_ai_response'), { status: 502 });
  return answer;
}

function createSession(scenario, learnerId = 'demo-learner') {
  const session = {
    id: randomUUID(),
    scenarioId: scenario.id,
    learnerId,
    createdAt: new Date().toISOString(),
    turn: 0,
    firedEvents: [],
    revealedFacts: [...(scenario.initialFacts || [])],
    messages: [],
    observations: [],
    decisions: []
  };
  sessions.set(session.id, session);
  return session;
}

async function handleApi(req, res, url) {
  const scenario = await loadScenario();

  if (req.method === 'GET' && url.pathname === '/api/health') {
    return json(res, 200, { ok: true, aiConfigured: Boolean(openAIKey), textModel, liveModel });
  }

  if (req.method === 'GET' && url.pathname === `/api/scenarios/${scenario.id}`) {
    return json(res, 200, publicScenario(scenario));
  }

  if (req.method === 'POST' && url.pathname === '/api/sessions') {
    const body = await readBody(req);
    const session = createSession(scenario, String(body.learnerId || 'demo-learner'));
    return json(res, 201, { id: session.id, scenarioId: session.scenarioId, turn: session.turn });
  }

  const messageMatch = url.pathname.match(/^\/api\/sessions\/([^/]+)\/messages$/);
  if (req.method === 'POST' && messageMatch) {
    const session = getSession(messageMatch[1]);
    const body = await readBody(req);
    const content = String(body.content || '').trim();
    if (!content) return json(res, 400, { error: 'message_required' });
    const character = getCharacter(scenario, String(body.characterId || ''));

    session.turn += 1;
    session.messages.push({
      id: randomUUID(),
      actor: 'learner',
      characterId: character.id,
      content,
      source: String(body.source || 'text'),
      createdAt: new Date().toISOString()
    });
    session.observations.push(...observeMessage(content, { source: String(body.source || 'text'), turn: session.turn }));

    const newEvents = eligibleEvents(scenario, session.turn, session.firedEvents);
    for (const event of newEvents) {
      session.firedEvents.push(event.id);
      session.revealedFacts.push(...(event.reveals || []));
    }

    const answer = await callCharacterAI({ scenario, character, session, learnerMessage: content });
    session.messages.push({
      id: randomUUID(),
      actor: 'character',
      characterId: character.id,
      content: answer,
      source: 'ai',
      createdAt: new Date().toISOString()
    });

    return json(res, 200, {
      answer,
      character: safeCharacterView(character),
      turn: session.turn,
      events: newEvents,
      skillSummary: aggregateSkillEvidence(session.observations, scenario.skills || [])
    });
  }

  const decisionMatch = url.pathname.match(/^\/api\/sessions\/([^/]+)\/decision$/);
  if (req.method === 'POST' && decisionMatch) {
    const session = getSession(decisionMatch[1]);
    const body = await readBody(req);
    const decision = {
      hypothesis: String(body.hypothesis || '').trim(),
      decision: String(body.decision || '').trim(),
      evidence: String(body.evidence || '').trim(),
      createdAt: new Date().toISOString()
    };
    if (!decision.decision) return json(res, 400, { error: 'decision_required' });
    session.decisions.push(decision);
    session.observations.push(...observeDecision(decision, session.turn));
    return json(res, 201, {
      ok: true,
      turn: session.turn,
      skillSummary: aggregateSkillEvidence(session.observations, scenario.skills || [])
    });
  }

  const summaryMatch = url.pathname.match(/^\/api\/sessions\/([^/]+)\/summary$/);
  if (req.method === 'GET' && summaryMatch) {
    const session = getSession(summaryMatch[1]);
    return json(res, 200, {
      id: session.id,
      learnerId: session.learnerId,
      scenarioId: session.scenarioId,
      turn: session.turn,
      createdAt: session.createdAt,
      firedEvents: session.firedEvents,
      messages: session.messages,
      decisions: session.decisions,
      skillSummary: aggregateSkillEvidence(session.observations, scenario.skills || [])
    });
  }

  const liveMatch = url.pathname.match(/^\/api\/sessions\/([^/]+)\/live$/);
  if (req.method === 'POST' && liveMatch) {
    if (!openAIKey) return json(res, 503, { error: 'openai_not_configured' });
    const session = getSession(liveMatch[1]);
    const body = await readBody(req);
    const character = getCharacter(scenario, String(body.characterId || ''));
    const sdp = String(body.sdp || '');
    if (!sdp) return json(res, 400, { error: 'sdp_required' });

    const instructions = buildCharacterInstructions({
      scenario,
      character,
      revealedFacts: session.revealedFacts
    });

    const response = await fetch(`${openAIBase}/live/sessions`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${openAIKey}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        session: {
          model: liveModel,
          instructions
        },
        transport: {
          type: 'webrtc',
          sdp
        }
      })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return json(res, 502, {
        error: 'live_session_failed',
        detail: payload?.error?.message || 'Impossible de créer la session vocale.'
      });
    }
    return json(res, 201, payload);
  }

  return false;
}

const mime = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg']
]);

async function serveStatic(req, res, url) {
  let relative = decodeURIComponent(url.pathname);
  if (relative === '/' || relative === '') relative = '/simulator.html';
  const candidate = path.resolve(webRoot, `.${relative}`);
  if (!candidate.startsWith(webRoot)) return text(res, 403, 'Forbidden');
  try {
    const data = await readFile(candidate);
    res.writeHead(200, {
      'content-type': mime.get(path.extname(candidate)) || 'application/octet-stream',
      'content-length': data.length
    });
    res.end(data);
  } catch {
    text(res, 404, 'Not found');
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    if (url.pathname.startsWith('/api/')) {
      const handled = await handleApi(req, res, url);
      if (handled === false) return json(res, 404, { error: 'not_found' });
      return;
    }
    await serveStatic(req, res, url);
  } catch (error) {
    const status = Number(error.status || (error.message === 'request_too_large' ? 413 : 500));
    json(res, status, {
      error: error.message || 'server_error'
    });
  }
});

server.listen(port, () => {
  console.log(`Orixeo Learning Studio 2.0 listening on http://localhost:${port}`);
  console.log(`AI gateway: ${openAIKey ? 'configured' : 'demo fallback mode'}`);
});
