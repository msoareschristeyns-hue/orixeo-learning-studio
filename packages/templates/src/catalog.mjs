const model = (id, family, title, moments, purpose) => ({ id, family, title, moments, purpose, cleanRoom: true });

export const TEMPLATE_CATALOG = [
  model('launch-topic','engage','Lancer un sujet',['Accroche','Représentations initiales','Question centrale','Premier apport'],'Faire émerger les représentations et donner du sens.'),
  model('diagnostic-refresh','engage','Réactiver les prérequis',['Diagnostic court','Correction active','Réactivation ciblée'],'Identifier et traiter rapidement les prérequis fragiles.'),
  model('flipped-session','understand','Classe inversée',['Préparation autonome','Vérification','Mise en pratique','Synthèse'],'Déplacer l’apport initial et consacrer le présentiel à l’activité.'),
  model('guided-dialogue','understand','Cours dialogué',['Question de départ','Apport interactif','Reformulation','Approfondissement','Synthèse'],'Construire progressivement une notion par interactions.'),
  model('document-analysis','understand','Étude de documents',['Contextualisation','Extraction','Croisement','Synthèse argumentée'],'Apprendre à exploiter et confronter plusieurs sources.'),
  model('model-guided-independent','practice','Du modèle à l’autonomie',['Démonstration','Pratique guidée','Pratique accompagnée','Pratique autonome'],'Faire progresser l’apprenant vers l’autonomie.'),
  model('microlecture-checks','understand','Apports courts avec vérifications',['Apport 1','Vérification','Apport 2','Application','Consolidation'],'Fractionner les apports et vérifier la compréhension.'),
  model('differentiated-workshops','practice','Ateliers différenciés',['Diagnostic','Ateliers temporaires','Mise en commun'],'Adapter l’étayage sans figer les niveaux.'),
  model('problem-solving','practice','Résolution de problème',['Problème','Recherche individuelle','Confrontation','Présentation','Formalisation'],'Développer raisonnement et explicitation.'),
  model('revision-sprint','practice','Sprint de révision',['Cartographie','Défi questions','Remédiation ciblée'],'Préparer une évaluation par rappel actif.'),
  model('structured-debate','argue','Débat structuré',['Cadrage','Préparation des arguments','Répartition des rôles','Débat','Retour réflexif'],'Travailler argumentation et écoute.'),
  model('learner-presentation','produce','Présentation apprenant',['Préparation','Présentations','Feedback pair-à-pair','Consolidation'],'Faire produire et expliquer un contenu.'),
  model('role-simulation','argue','Simulation de rôles',['Brief','Préparation','Simulation','Débrief'],'Comprendre des positions et arbitrer.'),
  model('reading-circle','argue','Cercle de lecture',['Lecture active','Discussion structurée','Trace réflexive'],'Approfondir un texte par discussion.'),
  model('complex-mission','produce','Mission complexe',['Mission','Planification','Production','Restitution','Autoévaluation'],'Mobiliser plusieurs acquis dans une production.'),
  model('guided-writing','produce','Production guidée',['Analyse d’un exemple','Planification','Premier jet','Feedback','Révision'],'Améliorer une production par itérations.'),
  model('media-project','produce','Projet média',['Analyse du format','Scénarisation','Production','Diffusion','Retour critique'],'Créer un livrable média avec critères explicites.'),
  model('inquiry-cycle','investigate','Démarche d’investigation',['Situation','Hypothèses','Protocole','Expérimentation','Conclusion'],'Structurer une investigation complète.'),
  model('source-research','investigate','Recherche documentaire',['Question','Recherche','Vérification','Synthèse sourcée'],'Développer recherche et fiabilité des sources.'),
  model('active-correction','assess','Correction active',['Évaluation','Analyse des erreurs','Remédiation','Nouvelle tentative'],'Transformer l’erreur en activité d’apprentissage.'),
  model('metacognitive-review','assess','Bilan métacognitif',['Retour sur objectifs','Auto-positionnement','Écriture réflexive','Partage de stratégies'],'Faire expliciter progrès et stratégies.'),
  model('peer-review','assess','Évaluation entre pairs',['Appropriation des critères','Évaluation croisée','Feedback','Amélioration'],'Développer jugement et qualité des productions.'),
  model('ai-assisted-production','ai','Production avec IA encadrée',['Règles d’usage','Production initiale','Assistance IA tracée','Comparaison et justification'],'Apprendre à utiliser l’IA avec traçabilité et recul.'),
  model('ai-critical-thinking','ai','Esprit critique face à l’IA',['Hypothèses initiales','Test des limites','Vérification de réponses','Protocole de contrôle','Bilan'],'Développer des réflexes de vérification.'),
  model('five-session-course','sequence','Parcours en cinq séances',['Lancement','Apports','Entraînement','Production','Évaluation'],'Structurer un module court cohérent.'),
  model('field-learning','sequence','Apprentissage terrain',['Préparer','Observer sur le terrain','Analyser au retour'],'Relier préparation, expérience et exploitation.'),
  model('post-assessment-remediation','assess','Remédiation post-évaluation',['Diagnostic d’erreur','Réenseignement','Entraînement ciblé','Vérification de sortie'],'Corriger des difficultés identifiées.'),
  model('opening-session','sequence','Première séance',['Accueil et cadre','Règles de fonctionnement','Diagnostic','Première activité'],'Installer cadre, engagement et diagnostic initial.')
];

export function getTemplate(id) { return TEMPLATE_CATALOG.find((item) => item.id === id); }
export function listTemplates({ family } = {}) { return family ? TEMPLATE_CATALOG.filter((item) => item.family === family) : TEMPLATE_CATALOG; }
