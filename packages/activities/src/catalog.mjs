export const activities = [
  {
    id: "ai-shadow-map",
    title: "Cartographier le shadow IA",
    domain: "IA & gouvernance",
    audience: "Entreprise",
    level: "Intermediaire",
    duration: 45,
    format: "atelier",
    objective: "Identifier les usages IA non declares et prioriser les risques a traiter.",
    situation: "Une equipe utilise plusieurs outils IA sans cadre commun ni validation de la DSI.",
    instructions: [
      "Lister les usages IA reels ou probables par metier.",
      "Classer chaque usage selon donnees traitees, criticite et niveau de maitrise.",
      "Identifier les 3 risques prioritaires et proposer une mesure de reduction pour chacun."
    ],
    learnerTemplate: ["Usage", "Metier", "Donnees", "Risque", "Impact", "Maitrise", "Action"],
    expectedAnswer: "Une cartographie priorisee distinguant usages autorises, usages a encadrer et usages a suspendre.",
    debrief: ["Quels usages creent le plus de valeur ?", "Quels usages sont invisibles au management ?", "Quelles regles minimales instaurer sous 30 jours ?"],
    aiAssistance: "moderate",
    tags: ["shadow IA", "gouvernance", "risque", "entreprise"]
  },
  {
    id: "prompt-vs-process",
    title: "Prompt ou processus ?",
    domain: "IA generative",
    audience: "Entreprise",
    level: "Debutant",
    duration: 30,
    format: "cas pratique",
    objective: "Distinguer une tache ponctuelle d'un processus automatisable.",
    situation: "Une equipe souhaite automatiser toutes ses demandes recurrentes avec un chatbot.",
    instructions: [
      "Identifier ce qui releve d'un simple prompt.",
      "Identifier ce qui necessite donnees, regles ou validation humaine.",
      "Proposer le niveau d'automatisation adapte."
    ],
    learnerTemplate: ["Tache", "Frequence", "Donnees", "Decision", "Automatisation", "Controle humain"],
    expectedAnswer: "Une separation claire entre assistance, automatisation et processus critique.",
    debrief: ["Ou l'IA suffit-elle ?", "Ou faut-il un workflow ?", "Ou l'humain doit-il rester decisionnaire ?"],
    aiAssistance: "guided",
    tags: ["prompt", "automatisation", "workflow"]
  },
  {
    id: "supplier-risk-radar",
    title: "Radar risques fournisseurs",
    domain: "Achats",
    audience: "Acheteurs",
    level: "Intermediaire",
    duration: 60,
    format: "atelier",
    objective: "Construire une lecture multicritere du risque fournisseur.",
    situation: "Un fournisseur strategique devient plus volatil en delais, qualite et capacite.",
    instructions: [
      "Evaluer probabilite et impact de chaque risque.",
      "Ajouter le niveau de maitrise de l'entreprise.",
      "Definir les actions preventives et les signaux a surveiller."
    ],
    learnerTemplate: ["Risque", "Probabilite", "Impact", "Maitrise", "Signal faible", "Action"],
    expectedAnswer: "Un radar priorise avec actions preventives et indicateurs de suivi.",
    debrief: ["Quels risques sont sous-estimes ?", "Quelles dependances sont critiques ?", "Quels signaux faibles suivre chaque mois ?"],
    aiAssistance: "optional",
    tags: ["achats", "fournisseur", "risque", "supply chain"]
  },
  {
    id: "cost-value-negotiation",
    title: "Prix, cout ou valeur ?",
    domain: "Achats",
    audience: "Commerciaux & acheteurs",
    level: "Debutant",
    duration: 40,
    format: "jeu de role",
    objective: "Comprendre les logiques respectives acheteur-fournisseur.",
    situation: "Un acheteur demande -10 % alors que le fournisseur estime son offre deja competitive.",
    instructions: [
      "Preparer les objectifs de chaque partie.",
      "Identifier les leviers autres que le prix.",
      "Conduire une negociation de 10 minutes puis analyser les concessions."
    ],
    learnerTemplate: ["Interets", "Contraintes", "Leviers", "Concessions", "Contreparties"],
    expectedAnswer: "Une negociation basee sur cout total, risque, service et contreparties.",
    debrief: ["Qu'est-ce qui a bloque ?", "Quelles concessions etaient gratuites ?", "Quelle valeur a ete creee ?"],
    aiAssistance: "none",
    tags: ["negociation", "achats", "vente", "TCO"]
  },
  {
    id: "regulatory-watch-logistics",
    title: "Construire une veille reglementaire logistique",
    domain: "Supply Chain",
    audience: "Etudiants & professionnels",
    level: "Debutant",
    duration: 50,
    format: "atelier",
    objective: "Structurer les sources, outils et responsabilites d'une veille reglementaire.",
    situation: "Une entreprise logistique ne dispose d'aucun dispositif formalise de veille.",
    instructions: [
      "Identifier les familles de sources utiles.",
      "Choisir les outils de collecte et d'alerte.",
      "Definir qui analyse, valide et diffuse l'information."
    ],
    learnerTemplate: ["Sujet", "Source", "Frequence", "Responsable", "Impact", "Action"],
    expectedAnswer: "Un dispositif de veille avec sources fiables, periodicite et gouvernance claire.",
    debrief: ["Comment eviter l'infobesite ?", "Quelles sources sont prioritaires ?", "Comment tracer la prise en compte ?"],
    aiAssistance: "guided",
    tags: ["logistique", "reglementation", "veille"]
  },
  {
    id: "csr-materiality",
    title: "Matrice de materialite simplifiee",
    domain: "RSE",
    audience: "PME",
    level: "Intermediaire",
    duration: 75,
    format: "atelier",
    objective: "Prioriser les enjeux RSE selon importance pour l'entreprise et les parties prenantes.",
    situation: "Une PME veut passer d'une liste d'actions RSE a une feuille de route structuree.",
    instructions: [
      "Lister les enjeux RSE pertinents.",
      "Evaluer l'importance interne et externe.",
      "Selectionner 5 priorites et definir un indicateur pour chacune."
    ],
    learnerTemplate: ["Enjeu", "Importance entreprise", "Importance parties prenantes", "Priorite", "KPI"],
    expectedAnswer: "Une matrice courte, argumentee et reliee a des indicateurs.",
    debrief: ["Quels sujets sont vraiment materiels ?", "Quels sujets relevent de la communication ?", "Quels KPI sont pilotables ?"],
    aiAssistance: "optional",
    tags: ["RSE", "materialite", "ISO 26000"]
  },
  {
    id: "future-assumptions",
    title: "Faire tomber les idees recues",
    domain: "Anticipation strategique",
    audience: "CODIR & dirigeants",
    level: "Debutant",
    duration: 45,
    format: "atelier",
    objective: "Identifier les hypotheses implicites qui enferment la decision.",
    situation: "Une entreprise prepare son avenir a partir de convictions jamais remises en cause.",
    instructions: [
      "Formuler 10 affirmations tenues pour vraies.",
      "Chercher pour chacune un contre-exemple ou signal contradictoire.",
      "Selectionner les 3 hypotheses les plus dangereuses si elles deviennent fausses."
    ],
    learnerTemplate: ["Idee recue", "Pourquoi on y croit", "Signal contradictoire", "Impact si faux", "Action"],
    expectedAnswer: "Une liste d'hypotheses critiques a tester dans les scenarios futurs.",
    debrief: ["Quelles croyances structurent nos decisions ?", "Qu'est-ce qui pourrait les invalider ?", "Que devons-nous tester maintenant ?"],
    aiAssistance: "guided",
    tags: ["anticipation", "hypotheses", "signaux faibles"]
  },
  {
    id: "transmission-future-value",
    title: "Vendre un avenir, pas seulement un passe",
    domain: "Transmission",
    audience: "Dirigeants & prescripteurs",
    level: "Intermediaire",
    duration: 60,
    format: "diagnostic",
    objective: "Identifier les elements qui renforcent la valeur future d'une entreprise a transmettre.",
    situation: "Un dirigeant prepare une cession a 2-3 ans et raisonne principalement sur l'historique financier.",
    instructions: [
      "Evaluer dependances, competences cles, clients, outils et gouvernance.",
      "Identifier les fragilites qui reduisent la transmissibilite.",
      "Definir 5 chantiers de valorisation future."
    ],
    learnerTemplate: ["Actif", "Dependance", "Risque", "Potentiel futur", "Action avant cession"],
    expectedAnswer: "Une feuille de route de transmissibilite centree sur les actifs futurs et la reduction des dependances.",
    debrief: ["Que vendra reellement le repreneur ?", "Quelles dependances fragilisent la valeur ?", "Quels actifs futurs rendre visibles ?"],
    aiAssistance: "moderate",
    tags: ["transmission", "cession", "valeur future"]
  }
];

export const activityDomains = [...new Set(activities.map((item) => item.domain))].sort();
export const activityFormats = [...new Set(activities.map((item) => item.format))].sort();

export function filterActivities({ query = "", domain = "all", format = "all" } = {}) {
  const normalized = query.trim().toLowerCase();
  return activities.filter((item) => {
    const text = [item.title, item.domain, item.audience, item.objective, ...item.tags].join(" ").toLowerCase();
    return (!normalized || text.includes(normalized)) &&
      (domain === "all" || item.domain === domain) &&
      (format === "all" || item.format === format);
  });
}
