export const BLOOM_LEVELS = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];
export const ACTIVITY_TYPES = ['input', 'investigation', 'practice', 'production', 'discussion', 'collaboration', 'simulation', 'assessment'];
export const ASSESSMENT_TYPES = ['none', 'diagnostic', 'formative', 'summative', 'peer'];
export const DELIVERY_MODES = ['onsite', 'online', 'blended'];
export const AI_ASSISTANCE_LEVELS = [0, 1, 2, 3, 4];

export function createDesign(input = {}) {
  const sequences = (input.sequences ?? []).map((sequence) => ({
    ...sequence,
    activities: (sequence.activities ?? []).map((activity) => {
      const { aiUsageLevel, ...canonicalActivity } = activity;
      return { ...canonicalActivity, aiAssistanceLevel: activity.aiAssistanceLevel ?? aiUsageLevel ?? 0 };
    })
  }));
  return {
    id: input.id ?? crypto.randomUUID(),
    title: input.title ?? 'Nouvelle formation',
    audience: input.audience ?? '',
    durationMinutes: input.durationMinutes ?? 0,
    deliveryMode: input.deliveryMode ?? 'onsite',
    objectives: input.objectives ?? [],
    outcomes: input.outcomes ?? [],
    sequences,
    source: input.source ?? null,
    metadata: {
      ...(input.metadata ?? {}),
      version: '0.1.0',
      createdAt: input.metadata?.createdAt ?? new Date().toISOString(),
      cleanRoom: true
    }
  };
}
