# Supabase setup — Orixeo Learning Studio

## Objectif

Brancher Orixeo Learning Studio sur un projet Supabase dédié, distinct de RELIOO.

## Variables

Copier `.env.example` vers `.env` et renseigner :

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (serveur uniquement)
- `APP_URL`
- `SESSION_COOKIE_NAME`

Ne jamais exposer la service role key dans le navigateur.

## Schéma

Appliquer dans l’ordre :

1. `infra/postgres/schema.sql`
2. `infra/postgres/onboarding.sql`

Puis activer/vérifier les policies RLS et lancer les advisors Supabase.

## Auth

Flux cible :

1. inscription ou connexion Supabase Auth ;
2. création du tenant lors du premier onboarding ;
3. création du membership `owner` ;
4. résolution du `tenantId` et du rôle dans la session ;
5. toutes les lectures/écritures de designs restent filtrées par tenant.

## Invitations

Les invitations sont stockées dans `invitations`. Une invitation valide rattache l’utilisateur au tenant avec le rôle défini : admin, trainer, editor ou viewer.

## Sécurité

- RLS obligatoire sur les tables tenant-scoped ;
- service role key uniquement dans les composants serveur/Edge Functions ;
- aucune clé secrète dans GitHub ;
- journalisation des actions sensibles dans `audit_log` ;
- liens publics via tokens aléatoires, révocables et expirables.
