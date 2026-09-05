export const AI_USAGE_LEVELS = [
  { level: 0, key: 'none', label: 'Sans IA', description: 'L’activité doit être réalisée sans assistance IA.' },
  { level: 1, key: 'support', label: 'IA d’appui', description: 'L’IA peut aider à clarifier ou reformuler sans produire le livrable.' },
  { level: 2, key: 'guided', label: 'IA guidée', description: 'L’IA est utilisée sur des étapes explicitement autorisées et tracées.' },
  { level: 3, key: 'collaborative', label: 'IA collaborative', description: 'L’apprenant produit avec l’IA et justifie ses choix.' },
  { level: 4, key: 'integrated', label: 'IA intégrée', description: 'La maîtrise de l’usage de l’IA fait partie de la compétence évaluée.' }
];

export function getAiPolicy(level) {
  return AI_USAGE_LEVELS.find(item => item.level === level) ?? null;
}
