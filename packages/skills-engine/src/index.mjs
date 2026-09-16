const RULES = {
  questioning: [/\?/, /pourquoi/i, /comment/i, /quel(le|s)?\b/i],
  investigation: [/précis/i, /détail/i, /cause/i, /donnée/i, /coût/i],
  verification: [/vérif/i, /source/i, /confirme/i, /preuve/i, /chiffr/i],
  'critical-thinking': [/contradic/i, /hypoth/i, /cependant/i, /risque/i, /fiab/i],
  adaptability: [/alternative/i, /scénario/i, /si .*alors/i, /plan b/i],
  communication: [/reformul/i, /si je comprends/i, /donc/i, /priorité/i],
  'decision-making': [/je recommande/i, /je décide/i, /ma décision/i, /arbitr/i],
  'ai-collaboration': [/compare/i, /challenge/i, /contre-argument/i, /limite/i]
};

export function observeMessage(message, { source = 'text', turn = 0 } = {}) {
  const text = String(message || '');
  const observations = [];
  for (const [skill, patterns] of Object.entries(RULES)) {
    const matches = patterns.filter(pattern => pattern.test(text)).length;
    if (!matches) continue;
    observations.push({
      skill,
      strength: Math.min(3, matches),
      evidence: text.slice(0, 280),
      source,
      turn,
      observedAt: new Date().toISOString()
    });
  }
  return observations;
}

export function aggregateSkillEvidence(observations = [], expectedSkills = []) {
  return expectedSkills.map(skill => {
    const evidence = observations.filter(item => item.skill === skill);
    const points = evidence.reduce((sum, item) => sum + (item.strength || 1), 0);
    return {
      skill,
      evidenceCount: evidence.length,
      score: Math.min(100, points * 12),
      evidence
    };
  });
}

export function observeDecision({ hypothesis = '', decision = '', evidence = '' }, turn = 0) {
  const combined = `${hypothesis}\n${decision}\n${evidence}`;
  const base = observeMessage(combined, { source: 'decision', turn });
  if (decision.trim()) base.push({ skill: 'decision-making', strength: 3, evidence: decision.slice(0, 280), source: 'decision', turn, observedAt: new Date().toISOString() });
  if (hypothesis.trim()) base.push({ skill: 'diagnostic', strength: 2, evidence: hypothesis.slice(0, 280), source: 'decision', turn, observedAt: new Date().toISOString() });
  return base;
}
