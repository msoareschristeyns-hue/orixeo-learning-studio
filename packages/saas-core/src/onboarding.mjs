import { createTenant, createMembership } from './models.mjs';

export function createWorkspace({ userId, companyName, plan = 'starter' }) {
  if (!userId) throw new Error('userId is required');
  if (!companyName?.trim()) throw new Error('companyName is required');
  const tenant = createTenant({ name: companyName.trim(), plan });
  const membership = createMembership({ tenantId: tenant.id, userId, role: 'owner' });
  return { tenant, membership };
}

export function createInvitation({ tenantId, email, role = 'trainer', invitedBy }) {
  if (!tenantId) throw new Error('tenantId is required');
  if (!email?.includes('@')) throw new Error('valid email is required');
  if (!invitedBy) throw new Error('invitedBy is required');
  return {
    id: crypto.randomUUID(),
    tenantId,
    email: email.toLowerCase().trim(),
    role,
    invitedBy,
    status: 'pending',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };
}
