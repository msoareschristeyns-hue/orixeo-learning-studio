create table if not exists invitations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  email text not null,
  role text not null check (role in ('admin','trainer','editor','viewer')),
  invited_by uuid not null,
  status text not null default 'pending' check (status in ('pending','accepted','revoked','expired')),
  expires_at timestamptz not null default (now() + interval '7 days'),
  created_at timestamptz not null default now()
);

alter table invitations enable row level security;

create policy invitations_same_tenant_select on invitations
for select using (tenant_id = current_setting('app.tenant_id', true)::uuid);

create policy invitations_same_tenant_insert on invitations
for insert with check (tenant_id = current_setting('app.tenant_id', true)::uuid);

create policy invitations_same_tenant_update on invitations
for update using (tenant_id = current_setting('app.tenant_id', true)::uuid)
with check (tenant_id = current_setting('app.tenant_id', true)::uuid);
