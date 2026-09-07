import { createDesign } from '../../learning-core/src/schema.mjs';

const clean = (value = '') => value.replace(/\s+/g, ' ').trim();
const minutesFromText = (text) => {
  const hours = text.match(/(?:face à face|durée)[^\d]{0,30}(\d+(?:[,.]\d+)?)\s*heures?/i)?.[1]
    ?? text.match(/(\d+(?:[,.]\d+)?)\s*heures?/i)?.[1];
  return hours ? Math.round(Number(hours.replace(',', '.')) * 60) : 0;
};

function extractBulletSection(text, heading, nextHeading) {
  const start = text.search(heading);
  if (start < 0) return [];
  const body = text.slice(Math.max(0, start - 900)).split(nextHeading)[0];
  const objectives = [];
  for (const rawLine of body.split('\n')) {
    const bullet = rawLine.match(/(?:^|\s)[•o]\s+(.+)$/);
    if (bullet) {
      const statement = clean(bullet[1]);
      if (/^(identifier|évaluer|evaluer|intégrer|integrer|déterminer|determiner|construire|comprendre|définir|definir|analyser|appliquer)/i.test(statement)) objectives.push(statement);
      continue;
    }
    if (!objectives.length) continue;
    const continuation = clean(rawLine.replace(/^\s*(Objectifs de|compétences)\s*/i, ''));
    if (continuation && !/^(PGMM|Date de|Référent|Chef de produit|PROGRAMME)/i.test(continuation)) {
      objectives[objectives.length - 1] += ` ${continuation}`;
    }
  }
  return objectives;
}

function allocateDurations(total, weights) {
  const allocated = weights.map((weight) => Math.floor(total * weight));
  allocated[allocated.length - 1] += total - allocated.reduce((sum, value) => sum + value, 0);
  return allocated;
}

export function parseSyllabusText(text, overrides = {}) {
  if (!text?.trim()) throw new Error('syllabus text is required');
  const durationMinutes = Number(overrides.durationMinutes || minutesFromText(text));
  if (!durationMinutes) throw new Error('duration could not be detected');
  const objectives = overrides.objectives?.length
    ? overrides.objectives
    : extractBulletSection(text, /Objectifs\s+de[\s\S]{0,200}?compétences|OBJECTIFS? À ATTEINDRE/i, /CONTENU ET RECOMMANDATION|Partie 1/i).slice(0, 8);
  const resolvedObjectives = objectives.length ? objectives : [
    'Identifier les notions et méthodes essentielles du module',
    'Appliquer les méthodes à une situation professionnelle',
    'Produire un livrable argumenté et exploitable'
  ];
  const title = overrides.title || clean(text.match(/PLAN DIRECTEUR ACHAT[\s\S]{0,100}?OPERATIONNEL ACHAT/i)?.[0])
    || clean(text.match(/PLAN DIRECTEUR ACHAT[^\n]*/i)?.[0]) || 'Parcours importé depuis un syllabus';
  const audience = overrides.audience || (/\bMDA\b/i.test(text) ? 'Master 2 - MDA' : clean(text.match(/\bM[12]\b[^\n]{0,40}/)?.[0])) || 'Public à confirmer';
  const sequenceMinutes = allocateDurations(durationMinutes, [0.25, 0.25, 0.25, 0.25]);
  const sequenceBlueprints = [
    ['Cadrer et diagnostiquer', ['Diagnostic des représentations', 'Apports essentiels', 'Mise en commun']],
    ['Analyser et mettre en pratique', ['Analyse guidée', 'Étude de cas', 'Restitution formative']],
    ['Construire la réponse professionnelle', ['Cadrage de la production', 'Travail collaboratif', 'Revue intermédiaire']],
    ['Produire, évaluer et transférer', ['Production finale', 'Évaluation croisée', 'Soutenance et bilan']]
  ];
  const types = [['discussion','input','collaboration'], ['investigation','practice','assessment'], ['input','production','collaboration'], ['production','collaboration','assessment']];
  const sequences = sequenceBlueprints.map(([sequenceTitle, activityTitles], sequenceIndex) => {
    const activityDurations = allocateDurations(sequenceMinutes[sequenceIndex], [0.2, 0.55, 0.25]);
    return {
      id: crypto.randomUUID(),
      title: sequenceTitle,
      activities: activityTitles.map((activityTitle, activityIndex) => ({
        id: crypto.randomUUID(),
        title: activityTitle,
        type: types[sequenceIndex][activityIndex],
        durationMinutes: activityDurations[activityIndex],
        assessment: sequenceIndex === 0 && activityIndex === 0 ? 'diagnostic'
          : sequenceIndex === 3 && activityIndex === 0 ? 'summative'
          : activityIndex === 2 ? 'formative' : 'none',
        aiAssistanceLevel: activityIndex === 1 && sequenceIndex > 0 ? 1 : 0,
        notes: 'Proposition issue du syllabus à contextualiser et valider par le formateur.'
      }))
    };
  });
  return createDesign({
    title,
    audience,
    durationMinutes,
    deliveryMode: overrides.deliveryMode || 'onsite',
    objectives: resolvedObjectives,
    outcomes: resolvedObjectives.map((statement, index) => ({
      bloom: index === resolvedObjectives.length - 1 ? 'create' : index === 0 ? 'understand' : 'apply',
      statement
    })),
    sequences,
    source: { type: 'syllabus', importedAt: new Date().toISOString(), requiresHumanValidation: true }
  });
}
