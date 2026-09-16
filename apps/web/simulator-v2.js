const $ = id => document.getElementById(id);
let scenario;
let active;
let sessionId;
let remaining = 45 * 60;
let recognition = null;
let listening = false;
let useRealtimeVoice = false;
let realtimePeer = null;
let realtimeAudio = null;
const firedEvents = new Set();

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { 'content-type': 'application/json', ...(options.headers || {}) }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.detail || payload.error || `HTTP ${response.status}`);
  return payload;
}

async function boot() {
  try {
    scenario = await api('/api/scenarios/novatech-achats-001');
    const session = await api('/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ learnerId: 'demo-learner' })
    });
    sessionId = session.id;
    remaining = (scenario.durationMinutes || 45) * 60;
    renderScenario();
    selectCharacter(scenario.characters[0].id);
    tick();
    setInterval(tick, 1000);
  } catch (error) {
    $('sessionStatus').textContent = 'Serveur indisponible';
    addMessage('system', `Impossible de démarrer la simulation : ${error.message}`);
  }
}

function renderScenario() {
  $('scenarioTitle').textContent = scenario.title;
  $('mission').textContent = scenario.mission;
  $('facts').innerHTML = scenario.initialFacts.map(f => `<li>${escapeHtml(f)}</li>`).join('');
  $('factCount').textContent = `${scenario.initialFacts.length} faits`;
  $('characters').innerHTML = scenario.characters.map(c => `
    <button class="character" data-id="${escapeHtml(c.id)}" type="button">
      <div class="avatar">${escapeHtml(c.name.split(' ').map(x => x[0]).slice(0, 2).join(''))}</div>
      <strong>${escapeHtml(c.name)}</strong>
      <span>${escapeHtml(c.role)}</span>
    </button>`).join('');
  document.querySelectorAll('.character').forEach(button => button.addEventListener('click', () => selectCharacter(button.dataset.id)));
  renderSkills((scenario.skills || []).map(skill => ({ skill, score: 0, evidenceCount: 0 })));
}

function selectCharacter(id) {
  active = scenario.characters.find(c => c.id === id);
  document.querySelectorAll('.character').forEach(b => b.classList.toggle('active', b.dataset.id === id));
  $('activeName').textContent = active.name;
  $('activeRole').textContent = active.role;
  addMessage('system', `Vous échangez maintenant avec ${active.name}, ${active.role}.`);
  if (realtimePeer) stopRealtimeVoice();
}

function addMessage(kind, content, meta = '') {
  const node = document.createElement('div');
  node.className = `message ${kind}`;
  node.innerHTML = `${escapeHtml(content)}${meta ? `<small>${escapeHtml(meta)}</small>` : ''}`;
  $('conversation').appendChild(node);
  $('conversation').scrollTop = $('conversation').scrollHeight;
}

async function sendLearnerMessage(content, source = 'text') {
  const text = String(content || '').trim();
  if (!text || !active || !sessionId) return;
  addMessage('user', text, source === 'voice' ? 'Vous · voix' : 'Vous');
  setBusy(true);
  try {
    const result = await api(`/api/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ characterId: active.id, content: text, source })
    });
    addMessage('agent', result.answer, result.character?.name || active.name);
    renderEvents(result.events || []);
    renderSkills(result.skillSummary || []);
    if ($('voiceMode').classList.contains('active') && !useRealtimeVoice) speak(result.answer);
  } catch (error) {
    addMessage('system', `La réponse IA n'est pas disponible : ${error.message}`);
  } finally {
    setBusy(false);
  }
}

function setBusy(busy) {
  const button = document.querySelector('.send-btn');
  if (button) {
    button.disabled = busy;
    button.textContent = busy ? 'Réflexion…' : 'Envoyer';
  }
}

function renderEvents(events) {
  for (const event of events) {
    if (firedEvents.has(event.id)) continue;
    firedEvents.add(event.id);
    const content = (event.reveals || []).join(' ');
    const card = document.createElement('div');
    card.className = 'event-card';
    card.innerHTML = `<strong>⚠ ${escapeHtml(event.title)}</strong>${escapeHtml(content)}`;
    $('events').querySelector('.muted')?.remove();
    $('events').appendChild(card);
    addMessage('system', `${event.title} — ${content}`);
  }
}

function renderSkills(summary) {
  $('skills').innerHTML = summary.map(item => `
    <div class="skill-meter" title="${item.evidenceCount || 0} preuve(s)">
      <div><span>${escapeHtml(labelSkill(item.skill))}</span><strong>${Math.round(item.score || 0)}%</strong></div>
      <progress max="100" value="${Math.round(item.score || 0)}"></progress>
    </div>`).join('');
}

$('messageForm').addEventListener('submit', event => {
  event.preventDefault();
  const input = $('messageInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  sendLearnerMessage(text, 'text');
});

$('textMode').onclick = () => setMode('text');
$('voiceMode').onclick = () => setMode('voice');

function setMode(mode) {
  const voice = mode === 'voice';
  $('textMode').classList.toggle('active', !voice);
  $('voiceMode').classList.toggle('active', voice);
  $('voicePanel').classList.toggle('hidden', !voice);
  $('messageForm').classList.toggle('hidden', voice);
  if (!voice) stopRealtimeVoice();
  else prepareVoice();
}

async function prepareVoice() {
  try {
    const health = await api('/api/health');
    if (health.aiConfigured && window.RTCPeerConnection && navigator.mediaDevices?.getUserMedia) {
      useRealtimeVoice = true;
      $('voiceState').textContent = 'Voix IA temps réel disponible';
      $('voiceHelp').textContent = 'Appuyez sur le micro pour démarrer ou arrêter la conversation vocale.';
      $('micButton').disabled = false;
      return;
    }
  } catch {}
  useRealtimeVoice = false;
  prepareBrowserVoice();
}

function prepareBrowserVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    $('voiceState').textContent = 'Reconnaissance vocale non disponible';
    $('voiceHelp').textContent = 'Utilisez le mode texte ou un navigateur compatible.';
    $('micButton').disabled = true;
    return;
  }
  if (recognition) return;
  recognition = new SR();
  recognition.lang = 'fr-FR';
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.onstart = () => {
    listening = true;
    $('micButton').classList.add('listening');
    $('voiceState').textContent = 'Je vous écoute…';
  };
  recognition.onend = () => {
    listening = false;
    $('micButton').classList.remove('listening');
    $('voiceState').textContent = 'Appuyez pour parler';
  };
  recognition.onerror = () => {
    $('voiceHelp').textContent = 'La prise de parole a été interrompue. Vous pouvez réessayer.';
  };
  recognition.onresult = event => sendLearnerMessage(event.results[0][0].transcript, 'voice');
}

$('micButton').onclick = async () => {
  if (useRealtimeVoice) {
    if (realtimePeer) stopRealtimeVoice();
    else await startRealtimeVoice();
    return;
  }
  prepareBrowserVoice();
  if (!recognition) return;
  if (listening) recognition.stop();
  else recognition.start();
};

async function startRealtimeVoice() {
  if (!sessionId || !active) return;
  $('voiceState').textContent = 'Connexion à la conversation IA…';
  try {
    const pc = new RTCPeerConnection();
    realtimePeer = pc;
    const audio = document.createElement('audio');
    audio.autoplay = true;
    realtimeAudio = audio;
    pc.ontrack = event => { audio.srcObject = event.streams[0]; };
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    for (const track of stream.getTracks()) pc.addTrack(track, stream);
    const channel = pc.createDataChannel('orixeo-events');
    channel.onmessage = event => handleRealtimeEvent(event.data);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    const live = await api(`/api/sessions/${sessionId}/live`, {
      method: 'POST',
      body: JSON.stringify({ characterId: active.id, sdp: offer.sdp })
    });
    const answerSdp = live.sdp || live.answer?.sdp || live.session?.sdp;
    if (!answerSdp) throw new Error('Réponse WebRTC invalide');
    await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });
    $('micButton').classList.add('listening');
    $('voiceState').textContent = `Conversation en direct avec ${active.name}`;
    $('voiceHelp').textContent = 'Parlez naturellement. Appuyez de nouveau pour terminer.';
  } catch (error) {
    stopRealtimeVoice();
    useRealtimeVoice = false;
    $('voiceHelp').textContent = `Temps réel indisponible (${error.message}). Bascule sur la transcription navigateur.`;
    prepareBrowserVoice();
  }
}

function stopRealtimeVoice() {
  if (realtimePeer) {
    realtimePeer.getSenders().forEach(sender => sender.track?.stop());
    realtimePeer.close();
  }
  realtimePeer = null;
  if (realtimeAudio) realtimeAudio.srcObject = null;
  realtimeAudio = null;
  $('micButton')?.classList.remove('listening');
  if ($('voiceState')) $('voiceState').textContent = 'Appuyez pour parler';
}

function handleRealtimeEvent(raw) {
  try {
    const event = JSON.parse(raw);
    const transcript = event.transcript || event.text || event.delta;
    if (!transcript || typeof transcript !== 'string') return;
    if (/transcript|audio_transcript|text/i.test(event.type || '')) {
      addMessage(event.role === 'user' ? 'user' : 'agent', transcript, event.role === 'user' ? 'Vous · voix' : active.name);
    }
  } catch {}
}

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.rate = 0.98;
  window.speechSynthesis.speak(utterance);
}

$('submitDecision').onclick = async () => {
  const hypothesis = $('hypothesis').value.trim();
  const decision = $('decision').value.trim();
  const evidence = $('evidence').value.trim();
  if (!decision) return $('decision').focus();
  try {
    const result = await api(`/api/sessions/${sessionId}/decision`, {
      method: 'POST',
      body: JSON.stringify({ hypothesis, decision, evidence })
    });
    renderSkills(result.skillSummary || []);
    $('decisionSummary').textContent = `Diagnostic\n${hypothesis || 'Non renseigné'}\n\nDécision\n${decision}\n\nÉléments de preuve\n${evidence || 'Non renseignés'}`;
    $('decisionDialog').showModal();
  } catch (error) {
    addMessage('system', `La décision n'a pas pu être enregistrée : ${error.message}`);
  }
};

$('closeDialog').onclick = () => $('decisionDialog').close();

function tick() {
  remaining = Math.max(0, remaining - 1);
  const minutes = String(Math.floor(remaining / 60)).padStart(2, '0');
  const seconds = String(remaining % 60).padStart(2, '0');
  $('timer').textContent = `${minutes}:${seconds}`;
  if (!remaining) $('sessionStatus').textContent = 'Temps écoulé';
}

function labelSkill(skill) {
  return ({
    'critical-thinking': 'Esprit critique',
    'decision-making': 'Décision',
    'ai-collaboration': 'Collaboration IA',
    questioning: 'Questionnement',
    verification: 'Vérification',
    diagnostic: 'Diagnostic',
    investigation: 'Investigation',
    adaptability: 'Adaptation',
    communication: 'Communication'
  })[skill] || skill;
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
}

window.addEventListener('beforeunload', stopRealtimeVoice);
boot();
