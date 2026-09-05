import { validateDesign } from '../../learning-core/src/validate-design.mjs';

export function normalizeBrief(brief = {}) {
  return {
    subject: brief.subject ?? '',
    audience: brief.audience ?? '',
    durationMinutes: Number(brief.durationMinutes ?? 0),
    groupSize: Number(brief.groupSize ?? 0),
    deliveryMode: brief.deliveryMode ?? 'onsite',
    objectives: brief.objectives ?? [],
    constraints: brief.constraints ?? []
  };
}

export function qualityGate(design) {
  const structural = validateDesign(design);
  const warnings = [];
  const activities = (design.sequences ?? []).flatMap((s) => s.activities ?? []);
  if (activities.length < 2) warnings.push('Le scénario contient peu d’activités.');
  if (!activities.some((a) => a.assessment && a.assessment !== 'none')) warnings.push('Aucune modalité d’évaluation explicite.');
  if (!activities.some((a) => a.type === 'collaboration' || a.type === 'discussion')) warnings.push('Peu d’interaction sociale prévue.');
  if ((design.outcomes ?? []).length === 0) warnings.push('Aucun acquis d’apprentissage observable.');
  return { valid: structural.valid, errors: structural.errors, warnings };
}
