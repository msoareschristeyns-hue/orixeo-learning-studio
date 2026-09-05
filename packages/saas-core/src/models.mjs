export function newTenant({ id=crypto.randomUUID(), name, slug, planId='starter' }) {
  return { id, name, slug, planId, status:'active', createdAt:new Date().toISOString() };
}

export function newMember({ id=crypto.randomUUID(), tenantId, userId, role='viewer' }) {
  return { id, tenantId, userId, role, createdAt:new Date().toISOString() };
}

export function newDesignRecord({ id=crypto.randomUUID(), tenantId, ownerUserId, title='Sans titre', content={} }) {
  const now = new Date().toISOString();
  return { id, tenantId, ownerUserId, title, content, status:'draft', createdAt:now, updatedAt:now };
}

export function newShare({ id=crypto.randomUUID(), tenantId, designId, visibility='unlisted', expiresAt=null }) {
  return { id, tenantId, designId, token:crypto.randomUUID().replaceAll('-',''), visibility, expiresAt, revokedAt:null, createdAt:new Date().toISOString() };
}
