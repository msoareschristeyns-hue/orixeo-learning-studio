# Orixeo Learning Studio

Plateforme clean-room de conception, animation et amélioration de formations assistées par IA.

## Vision

Orixeo Learning Studio transforme un brief de formation en parcours pédagogique structuré, puis relie la conception à Orixeo Play et aux analytics.

**Brief -> Design -> Generate -> Validate -> Play -> Measure -> Improve**

## Architecture

- `packages/learning-core` : objectifs, Bloom, compétences, séquences, durées, modalités
- `packages/ai-governance` : règles d'usage IA, niveaux d'assistance, traçabilité
- `packages/learning-agent` : orchestration du brief et génération structurée
- `packages/templates` : modèles pédagogiques Orixeo originaux
- `packages/activities` : quiz, études de cas, débats, simulations, jeux de rôle
- `packages/assessment` : diagnostic, formatif, sommatif, pair-à-pair
- `packages/exporters` : JSON, Markdown, DOCX, PPTX, PDF, XLSX
- `packages/analytics` : participation, progression, recommandations
- `apps/web` : interface Orixeo Learning Studio

## Principes clean-room

Ce projet est une réimplémentation indépendante. Aucun code, prompt, texte, interface ou fichier du projet Learning Designer de référence n'est copié.

## MVP

1. Brief conversationnel
2. Génération d'objectifs et acquis observables
3. Création de séquences et activités
4. Politique d'usage de l'IA par activité
5. Validation pédagogique
6. Export JSON/Markdown
7. Connexion future à Orixeo Play
