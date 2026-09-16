export const SESSION_STATUS = Object.freeze({
  READY: 'ready',
  ACTIVE: 'active',
  COMPLETED: 'completed'
});

export function createSimulationSession({ scenario, learnerId = 'demo-learner', now = new Date() }) {
  if (!scenario?.id) throw new Error('scenario.id is required');

  return {
    id: `session-${scenario.id}-${Date.now()}`,
    scenarioId: scenario.id,
    learnerId,
    status: SESSION_STATUS.ACTIVE,
    startedAt: now.toISOString(),
    phase: 'think',
    turn: 0,
    revealedFacts: [...(scenario.initialFacts ?? [])],
    triggeredEvents: [],
    messages: [],
    decisions: [],
    skillEvidence: []
  };
}

export function recordMessage(session, { actorId, content, kind = 'message', timestamp = new Date() }) {
  if (!actorId || !content?.trim()) throw new Error('actorId and content are required');
  const message = {
    id: `msg-${session.messages.length + 1}`,
    actorId,
    kind,
    content: content.trim(),
    timestamp: timestamp.toISOString()
  };
  return { ...session, turn: session.turn + 1, messages: [...session.messages, message] };
}

export function recordDecision(session, { summary, rationale, timestamp = new Date() }) {
  if (!summary?.trim()) throw new Error('decision summary is required');
  const decision = {
    id: `decision-${session.decisions.length + 1}`,
    summary: summary.trim(),
    rationale: rationale?.trim() ?? '',
    timestamp: timestamp.toISOString()
  };
  return { ...session, decisions: [...session.decisions, decision], phase: 'reflect' };
}

export function getEligibleEvents(scenario, session) {
  return (scenario.events ?? []).filter((event) => {
    if (session.triggeredEvents.includes(event.id)) return false;
    if (event.trigger?.type === 'turn') return session.turn >= event.trigger.value;
    if (event.trigger?.type === 'decision-count') return session.decisions.length >= event.trigger.value;
    return false;
  });
}

export function triggerEvent(session, event) {
  if (!event?.id) throw new Error('event.id is required');
  return {
    ...session,
    triggeredEvents: [...session.triggeredEvents, event.id],
    revealedFacts: [...session.revealedFacts, ...(event.reveals ?? [])]
  };
}
