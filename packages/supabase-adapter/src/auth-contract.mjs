export function normalizeAuthUser(user) {
  if (!user?.id) return null;
  return {
    id: user.id,
    email: user.email ?? null,
    name: user.user_metadata?.name ?? user.user_metadata?.full_name ?? null
  };
}

export function buildSessionContext({ user, membership }) {
  if (!user) return null;
  return {
    user: normalizeAuthUser(user),
    tenantId: membership?.tenant_id ?? null,
    role: membership?.role ?? null
  };
}
