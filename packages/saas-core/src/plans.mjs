export const PLANS = {
  starter: { seats: 2, designs: 20, aiCredits: 100, publicShares: 5, analytics: false },
  pro: { seats: 10, designs: 250, aiCredits: 2000, publicShares: 100, analytics: true },
  business: { seats: 50, designs: 2000, aiCredits: 15000, publicShares: 1000, analytics: true }
};

export function getPlan(id='starter') {
  const plan = PLANS[id];
  if (!plan) throw new Error(`unknown plan: ${id}`);
  return { id, ...plan };
}

export function withinQuota({ planId, metric, current, increment=1 }) {
  const plan = getPlan(planId);
  const limit = plan[metric];
  if (typeof limit !== 'number') return true;
  return current + increment <= limit;
}
