# Orixeo Learning Studio 2.0

## Vision

Orixeo Learning Studio 2.0 transforme la plateforme actuelle de conception pédagogique assistée par IA en un environnement de simulation d'apprentissage piloté par les compétences.

Le principe pédagogique central est :

**Think -> AI -> Challenge -> Decide -> Reflect**

L'IA n'est pas seulement un outil de génération. Elle devient un acteur de la situation d'apprentissage : interlocuteur, contradicteur, partie prenante, coach et moteur d'événements.

## Architecture fonctionnelle

### 1. Scenario Engine
Décrit une mission professionnelle avec contexte, objectifs, contraintes, documents, personnages, événements et conditions de fin.

### 2. AI Characters
Agents jouant des rôles métier avec :
- identité et fonction ;
- objectifs propres ;
- informations connues et informations cachées ;
- niveau de coopération ;
- biais et contraintes ;
- style de communication ;
- règles de divulgation d'information.

### 3. Event Engine
Introduit des événements qui modifient la situation pendant la simulation selon le temps, les décisions de l'apprenant ou des règles conditionnelles.

### 4. Learning Copilot
Accompagne l'apprenant sans lui donner directement la solution. Il peut reformuler, questionner, proposer un indice ou provoquer une prise de recul.

### 5. Skills Engine
Observe des comportements et produit des preuves de compétences : analyse, investigation, esprit critique, décision, adaptation, communication et collaboration avec l'IA.

### 6. Teacher Cockpit
Permet au formateur de suivre les sessions, les décisions, les événements, les interactions clés et les preuves de compétences.

## MVP 2.0 - Sprint 1

Le premier scénario de référence est une simulation Achats de 45 minutes.

### Entreprise fictive
**NOVATECH INDUSTRIES**
- PME industrielle
- 150 salariés
- 38 M EUR de chiffre d'affaires
- 28 M EUR d'achats
- 2 sites

### Mission
Un fournisseur stratégique annonce une hausse tarifaire de 18 %. Il représente 62 % des approvisionnements de la famille concernée. Le stock disponible couvre 19 jours. La direction générale refuse une hausse supérieure à 5 %.

### Personnages
- Fournisseur stratégique
- Directeur financier
- Responsable production
- Responsable qualité
- Direction générale

### Événements initiaux
1. Après une première phase d'investigation : arrêt de production fournisseur annoncé pour trois semaines.
2. Ensuite : opportunité commerciale générant +20 % de volume potentiel.

### Compétences observées
- Diagnostic
- Investigation
- Questionnement
- Vérification
- Esprit critique
- Décision
- Adaptation
- Communication
- Collaboration avec l'IA

## Modèle de données cible

- companies
- scenarios
- scenario_characters
- scenario_events
- skill_definitions
- simulation_sessions
- simulation_messages
- simulation_decisions
- event_occurrences
- skill_observations
- session_assessments

## Règle produit

Le moteur doit toujours distinguer :
1. les faits du scénario ;
2. les informations connues par chaque personnage ;
3. les informations révélées à l'apprenant ;
4. les déductions de l'apprenant ;
5. les décisions prises ;
6. les preuves utilisées pour l'évaluation.

## Positionnement

Orixeo Learning Studio 2.0 n'est pas conçu comme un simple LMS. Il vise un positionnement de **Learning Experience Simulator** :

**Situation -> Interaction -> Decision -> Consequence -> Reflection -> Skill Evidence**
