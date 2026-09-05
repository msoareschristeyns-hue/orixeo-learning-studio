export function toMarkdown(design, { audience = 'trainer' } = {}) {
  const lines = [`# ${design.title}`, '', `Public : ${design.audience ?? ''}`, `Durée : ${design.durationMinutes ?? 0} min`, ''];
  for (const sequence of design.sequences ?? []) {
    lines.push(`## ${sequence.title}`, '');
    for (const activity of sequence.activities ?? []) {
      lines.push(`### ${activity.title ?? activity.type}`, `- Type : ${activity.type}`, `- Durée : ${activity.durationMinutes} min`);
      if (activity.instructions) lines.push(`- Consigne : ${activity.instructions}`);
      if (audience === 'trainer' && activity.notes) lines.push(`- Notes formateur : ${activity.notes}`);
      lines.push('');
    }
  }
  return lines.join('\n');
}

export function toJson(design) { return JSON.stringify(design, null, 2); }

export function exportManifest() {
  return {
    ready: ['json','markdown'],
    planned: ['html','csv','xlsx','docx','pptx','pdf','scorm']
  };
}
