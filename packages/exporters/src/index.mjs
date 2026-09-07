export function toMarkdown(design, { audience = 'trainer' } = {}) {
  const lines = [`# ${design.title}`, '', `Public : ${design.audience ?? ''}`, `Durée : ${design.durationMinutes ?? 0} min`, ''];
  for (const sequence of design.sequences ?? []) {
    lines.push(`## ${sequence.title}`, '');
    for (const activity of sequence.activities ?? []) {
      lines.push(`### ${activity.title ?? activity.type}`, `- Type : ${activity.type}`, `- Durée : ${activity.durationMinutes} min`, `- Évaluation : ${activity.assessment ?? 'none'}`, `- IA : niveau ${activity.aiAssistanceLevel ?? activity.aiUsageLevel ?? 0}`);
      if (activity.instructions) lines.push(`- Consigne : ${activity.instructions}`);
      if (audience === 'trainer' && activity.notes) lines.push(`- Notes formateur : ${activity.notes}`);
      lines.push('');
    }
  }
  return lines.join('\n');
}

export function toJson(design) { return JSON.stringify(design, null, 2); }

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[character]);

export function toHtml(design) {
  const sequences = (design.sequences ?? []).map((sequence) => `<section><h2>${escapeHtml(sequence.title)}</h2>${(sequence.activities ?? []).map((activity) => `<article><h3>${escapeHtml(activity.title ?? activity.type)}</h3><ul><li>Type : ${escapeHtml(activity.type)}</li><li>Durée : ${activity.durationMinutes} min</li><li>Évaluation : ${escapeHtml(activity.assessment ?? 'none')}</li><li>IA : niveau ${activity.aiAssistanceLevel ?? activity.aiUsageLevel ?? 0}</li></ul>${activity.instructions ? `<p>${escapeHtml(activity.instructions)}</p>` : ''}</article>`).join('')}</section>`).join('');
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(design.title)}</title></head><body><main><h1>${escapeHtml(design.title)}</h1><p>${escapeHtml(design.audience)} · ${design.durationMinutes} min</p>${sequences}</main></body></html>`;
}

export function exportManifest() {
  return {
    ready: ['json','markdown','html'],
    planned: ['csv','xlsx','docx','pptx','pdf','scorm']
  };
}
