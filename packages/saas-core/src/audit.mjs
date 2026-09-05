export const AUDIT_EVENTS = ['tenant.created','member.invited','member.role_changed','design.created','design.updated','design.published','share.created','share.revoked','export.created','billing.changed','ai.used'];

export function auditEvent({ tenantId, userId, action, targetType, targetId=null, metadata={} }) {
  if (!AUDIT_EVENTS.includes(action)) throw new Error(`unknown audit action: ${action}`);
  return {
    id: crypto.randomUUID(), tenantId, userId, action, targetType, targetId,
    metadata, createdAt: new Date().toISOString()
  };
}
