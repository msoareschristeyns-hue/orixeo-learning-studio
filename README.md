# Orixeo Learning Studio

Plateforme clean-room de conception, animation et amélioration de formations assistées par IA.

## Vision

Orixeo Learning Studio transforme un brief de formation en parcours pédagogique structuré, puis relie la conception à Orixeo Play et aux analytics.

**Brief -> Design -> Generate -> Validate -> Play -> Measure -> Improve**

## Ce qui fonctionne aujourd'hui

### Learning Designer MVP
- Designer web interactif
- 28 modèles pédagogiques originaux Orixeo
- objectifs, acquis et taxonomie de Bloom
- séquences et activités éditables
- ajout, suppression et réorganisation des séquences et activités
- durée, type d'activité, évaluation et niveau d'assistance IA modifiables
- score de qualité pédagogique en temps réel
- sauvegarde et reprise d'un brouillon dans le navigateur
- exports JSON, Markdown et HTML
- CLI de validation/export
- règles de gouvernance IA
- modèle de partage/publication
- tests automatiques du learning core

### Socle SaaS
- multi-tenant par entreprise
- rôles `owner`, `admin`, `trainer`, `editor`, `viewer`
- permissions centralisées
- isolation des ressources par `tenantId`
- plans Starter / Pro / Business
- quotas sièges, designs, IA et liens de partage
- modèles d'entreprise, membre, design et partage
- événements d'audit
- schéma PostgreSQL avec RLS
- tests RBAC, isolation tenant et quotas
- architecture prête pour authentification, Supabase/PostgreSQL et billing

## Architecture

- `packages/learning-core` : objectifs, Bloom, compétences, séquences, durées, modalités
- `packages/ai-governance` : règles d'usage IA, niveaux d'assistance, traçabilité
- `packages/learning-agent` : orchestration du brief et génération structurée
- `packages/templates` : 28 modèles pédagogiques Orixeo originaux
- `packages/activities` : quiz, études de cas, débats, simulations, jeux de rôle
- `packages/assessment` : diagnostic, formatif, sommatif, pair-à-pair
- `packages/exporters` : JSON / Markdown / HTML, puis exports serveur
- `packages/analytics` : participation, progression, recommandations
- `packages/saas-core` : tenants, RBAC, plans, quotas, audit
- `apps/web` : interface Orixeo Learning Studio
- `infra/postgres/schema.sql` : modèle de données SaaS multi-tenant et RLS
- `tests` : tests learning core et SaaS core

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

## Cible SaaS commerciale

La cible est un produit multi-tenant pour formateurs, CFA, écoles, organismes de formation et entreprises.

Les prochaines briques sont :

1. authentification réelle et onboarding entreprise
2. persistance serveur des designs et versions
3. gestion des membres et invitations
4. partage par URL sécurisé
5. gateway IA avec quotas et journalisation des coûts
6. billing et abonnements
7. exports DOCX / PPTX / PDF / XLSX
8. connexion Orixeo Play
9. analytics d'usage et d'apprentissage
10. administration SaaS et observabilité

Voir `docs/SAAS-ARCHITECTURE.md` pour l'architecture cible.
