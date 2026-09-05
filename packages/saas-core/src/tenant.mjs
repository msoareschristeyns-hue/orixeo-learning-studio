export function tenantScope(tenantId) {
  if (!tenantId) throw new Error('tenantId is required');
  return { tenantId };
}

export function assertSameTenant(resource, tenantId) {
  if (!resource || resource.tenantId !== tenantId) {
    const error = new Error('resource not found');
    error.statusCode = 404;
    throw error;
  }
  return resource;
}

export function attachTenant(resource, tenantId) {
  return { ...resource, tenantId };
}
