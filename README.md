# Orixeo Learning Studio

Plateforme clean-room de conception, animation et amélioration de formations assistées par IA.

## Vision

Orixeo Learning Studio transforme un brief de formation en parcours pédagogique structuré, puis relie la conception à Orixeo Play et aux analytics.

**Brief -> Design -> Generate -> Validate -> Play -> Measure -> Improve**

## Ce qui fonctionne aujourd’hui

- Designer web interactif
- 28 modèles pédagogiques originaux Orixeo
- objectifs, acquis et taxonomie de Bloom
- séquences et activités éditables
- ajout, suppression et réorganisation des séquences et activités
- durée, type d’activité, évaluation et niveau d’assistance IA modifiables
- score de qualité pédagogique en temps réel
- sauvegarde et reprise d’un brouillon dans le navigateur
- exports JSON, Markdown et HTML
- CLI de validation/export
- règles de gouvernance IA
- modèle de partage/publication
- tests automatiques du learning core

## Architecture

- `packages/learning-core` : objectifs, Bloom, compétences, séquences, durées, modalités
- `packages/ai-governance` : règles d'usage IA, niveaux d'assistance, traçabilité
- `packages/learning-agent` : orchestration du brief et génération structurée
- `packages/templates` : 28 modèles pédagogiques Orixeo originaux
- `packages/activities` : quiz, études de cas, débats, simulations, jeux de rôle
- `packages/assessment` : diagnostic, formatif, sommatif, pair-à-pair
- `packages/exporters` : socle d’export, avec JSON/Markdown/HTML utilisables dans le Designer
- `packages/analytics` : participation, progression, recommandations
- `apps/web` : interface Orixeo Learning Studio
- `tests` : tests du moteur de validation

## Lancer le Designer

Depuis la racine du dépôt :

```bash
python3 -m http.server 8000
```

Puis ouvrir :

```text
http://localhost:8000/apps/web/
```

## Vérifier le moteur

```bash
npm test
npm run validate
```

## Principes clean-room

Ce projet est une réimplémentation indépendante. Aucun code, prompt, texte, interface ou fichier du projet Learning Designer de référence n'est copié.

## Prochain niveau produit

Le socle auteur est désormais utilisable. Les prochains développements concernent surtout l’industrialisation SaaS : authentification et multi-tenant, stockage serveur, partage réel par URL, exports DOCX/PPTX/PDF/XLSX, connexion Orixeo Play, analytics d’usage et génération IA via API.
