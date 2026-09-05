create extension if not exists pgcrypto;

create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  plan_id text not null default 'starter',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  user_id uuid not null,
  role text not null check (role in ('owner','admin','trainer','editor','viewer')),
  created_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create table if not exists designs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  owner_user_id uuid not null,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists design_versions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  design_id uuid not null references designs(id) on delete cascade,
  version_no integer not null,
  content jsonb not null,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  unique (design_id, version_no)
);

create table if not exists shares (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  design_id uuid not null references designs(id) on delete cascade,
  token text not null unique,
  visibility text not null default 'unlisted',
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references tenants(id) on delete cascade,
  provider text,
  provider_customer_id text,
  provider_subscription_id text,
  plan_id text not null default 'starter',
  status text not null default 'inactive',
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists usage_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  user_id uuid,
  metric text not null,
  quantity integer not null default 1,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  user_id uuid,
  action text not null,
  target_type text not null,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table memberships enable row level security;
alter table designs enable row level security;
alter table design_versions enable row level security;
alter table shares enable row level security;
alter table subscriptions enable row level security;
alter table usage_events enable row level security;
alter table audit_logs enable row level security;

-- Expected JWT claims: sub=user uuid, tenant_id=current tenant uuid.
-- Auth provider adapter must populate tenant_id only after membership verification.
create policy if not exists memberships_tenant_isolation on memberships
  using (tenant_id::text = current_setting('request.jwt.claim.tenant_id', true));
create policy if not exists designs_tenant_isolation on designs
  using (tenant_id::text = current_setting('request.jwt.claim.tenant_id', true))
  with check (tenant_id::text = current_setting('request.jwt.claim.tenant_id', true));
create policy if not exists versions_tenant_isolation on design_versions
  using (tenant_id::text = current_setting('request.jwt.claim.tenant_id', true))
  with check (tenant_id::text = current_setting('request.jwt.claim.tenant_id', true));
create policy if not exists shares_tenant_isolation on shares
  using (tenant_id::text = current_setting('request.jwt.claim.tenant_id', true))
  with check (tenant_id::text = current_setting('request.jwt.claim.tenant_id', true));
create policy if not exists subscriptions_tenant_isolation on subscriptions
  using (tenant_id::text = current_setting('request.jwt.claim.tenant_id', true));
create policy if not exists usage_tenant_isolation on usage_events
  using (tenant_id::text = current_setting('request.jwt.claim.tenant_id', true))
  with check (tenant_id::text = current_setting('request.jwt.claim.tenant_id', true));
create policy if not exists audit_tenant_isolation on audit_logs
  using (tenant_id::text = current_setting('request.jwt.claim.tenant_id', true))
  with check (tenant_id::text = current_setting('request.jwt.claim.tenant_id', true));

create index if not exists designs_tenant_updated_idx on designs(tenant_id, updated_at desc);
create index if not exists usage_tenant_metric_created_idx on usage_events(tenant_id, metric, created_at desc);
create index if not exists audit_tenant_created_idx on audit_logs(tenant_id, created_at desc);
