export const BLOOM_LEVELS = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];
export const ACTIVITY_TYPES = ['input', 'investigation', 'practice', 'production', 'discussion', 'collaboration', 'simulation', 'assessment'];
export const ASSESSMENT_TYPES = ['none', 'diagnostic', 'formative', 'summative', 'peer'];
export const DELIVERY_MODES = ['onsite', 'online', 'blended'];

export function createDesign(input = {}) {
  return {
    id: input.id ?? crypto.randomUUID(),
    title: input.title ?? 'Nouvelle formation',
    audience: input.audience ?? '',
    durationMinutes: input.durationMinutes ?? 0,
    deliveryMode: input.deliveryMode ?? 'onsite',
    objectives: input.objectives ?? [],
    outcomes: input.outcomes ?? [],
    sequences: input.sequences ?? [],
    metadata: {
      version: '0.1.0',
      createdAt: new Date().toISOString(),
      cleanRoom: true
    }
  };
}
