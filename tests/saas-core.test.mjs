import test from 'node:test';
import assert from 'node:assert/strict';
import { can, requirePermission } from '../packages/saas-core/src/rbac.mjs';
import { assertSameTenant, attachTenant } from '../packages/saas-core/src/tenant.mjs';
import { withinQuota } from '../packages/saas-core/src/plans.mjs';

test('RBAC denies viewer writes', () => {
  assert.equal(can('viewer','design.read'), true);
  assert.equal(can('viewer','design.write'), false);
  assert.throws(() => requirePermission('viewer','design.write'));
});

test('tenant isolation hides cross-tenant resources', () => {
  const resource = attachTenant({ id:'d1' }, 'tenant-a');
  assert.equal(assertSameTenant(resource,'tenant-a').id, 'd1');
  assert.throws(() => assertSameTenant(resource,'tenant-b'));
});

test('plan quotas are enforced', () => {
  assert.equal(withinQuota({ planId:'starter', metric:'designs', current:19, increment:1 }), true);
  assert.equal(withinQuota({ planId:'starter', metric:'designs', current:20, increment:1 }), false);
});
