import test from 'node:test';
import assert from 'node:assert/strict';
import { createWorkspace, createInvitation } from '../packages/saas-core/src/onboarding.mjs';

test('creates a workspace with owner membership', () => {
  const { tenant, membership } = createWorkspace({ userId: 'user-1', companyName: 'MSDG Innovation' });
  assert.equal(tenant.name, 'MSDG Innovation');
  assert.equal(membership.role, 'owner');
  assert.equal(membership.tenantId, tenant.id);
});

test('creates a normalized invitation', () => {
  const invitation = createInvitation({ tenantId: 'tenant-1', email: ' TEST@EXAMPLE.COM ', role: 'trainer', invitedBy: 'user-1' });
  assert.equal(invitation.email, 'test@example.com');
  assert.equal(invitation.status, 'pending');
  assert.equal(invitation.role, 'trainer');
});
