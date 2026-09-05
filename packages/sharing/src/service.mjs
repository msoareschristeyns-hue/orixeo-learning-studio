export function createShareRecord({ designId, ownerId, visibility = 'private', license = 'proprietary' }) {
  return {
    designId,
    ownerId,
    visibility,
    license,
    shareToken: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };
}

export const VISIBILITY = ['private','unlisted','organization','public'];
export const SHARING_CAPABILITIES = ['owner-save','read-only-link','organization-library','public-catalog'];
