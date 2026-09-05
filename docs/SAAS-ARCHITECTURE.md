# Orixeo Learning Studio — Architecture SaaS

## Objectif

Faire évoluer le MVP auteur vers un SaaS commercial multi-tenant, sécurisé et extensible.

## Principes

- isolation stricte par `tenantId`
- rôles et permissions centralisés
- aucune dépendance directe du domaine pédagogique à un fournisseur d'authentification ou de paiement
- stockage et billing derrière des adaptateurs
- partage par jetons révocables et expirables
- quotas par plan
- audit des actions sensibles

## Couches

### 1. Frontend
`apps/web` reste l'interface auteur. Une future couche applicative gérera session, espace entreprise, membres, abonnement et bibliothèque.

### 2. API
Prévoir une API `/api/v1` avec les ressources suivantes :

- `/me`
- `/tenants`
- `/members`
- `/designs`
- `/designs/:id/shares`
- `/templates`
- `/exports`
- `/usage`
- `/billing`
- `/analytics`

Chaque requête authentifiée doit résoudre :

1. `userId`
2. `tenantId`
3. rôle dans le tenant
4. permission requise

### 3. Domaine SaaS
`packages/saas-core` contient RBAC, isolation tenant, plans/quotas et modèles de domaine.

### 4. Persistance
Cible recommandée : PostgreSQL/Supabase avec Row Level Security.

Tables minimales :

- tenants
- users (ou table auth externe)
- memberships
- designs
- design_versions
- shares
- subscriptions
- usage_events
- audit_logs

Toutes les tables métier multi-tenant portent `tenant_id`.

### 5. Authentification
Cible : provider externe compatible JWT/session. Le domaine ne doit jamais dépendre du provider choisi.

### 6. Billing
Cible : Stripe ou équivalent via adaptateur. Les événements webhook mettent à jour `subscriptions` et les droits, jamais l'inverse.

### 7. IA
Les appels IA passent par une passerelle serveur :

- clé fournisseur jamais exposée au navigateur
- journalisation du coût
- quota par tenant
- politique de données
- choix du modèle configurable

### 8. Sécurité

- RLS PostgreSQL
- contrôle RBAC côté API
- validation serveur des payloads
- rate limiting
- tokens de partage aléatoires et révocables
- expiration optionnelle
- audit log pour membres, publication, exports, billing et administration
- secrets uniquement en variables d'environnement

## Plans initiaux

### Starter
2 sièges, 20 designs, 100 crédits IA, 5 liens publics.

### Pro
10 sièges, 250 designs, 2 000 crédits IA, analytics et 100 liens publics.

### Business
50 sièges, 2 000 designs, 15 000 crédits IA, analytics et 1 000 liens publics.

Les limites sont volontairement configurables avant lancement commercial.

## Ordre de développement

1. schéma PostgreSQL + RLS
2. auth + création d'entreprise
3. stockage serveur des designs et versions
4. gestion des membres/rôles
5. partage réel par URL
6. gateway IA + consommation/quota
7. billing
8. exports serveur
9. Orixeo Play
10. analytics et administration
