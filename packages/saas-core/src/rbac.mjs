export const ROLES = ['owner','admin','trainer','editor','viewer'];

const PERMISSIONS = {
  owner: ['tenant.manage','billing.manage','members.manage','design.read','design.write','design.publish','analytics.read'],
  admin: ['members.manage','design.read','design.write','design.publish','analytics.read'],
  trainer: ['design.read','design.write','design.publish','analytics.read'],
  editor: ['design.read','design.write'],
  viewer: ['design.read']
};

export function can(role, permission) {
  return Boolean(PERMISSIONS[role]?.includes(permission));
}

export function requirePermission(role, permission) {
  if (!can(role, permission)) {
    const error = new Error(`forbidden: ${permission}`);
    error.statusCode = 403;
    throw error;
  }
}
