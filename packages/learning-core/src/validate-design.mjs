import fs from 'node:fs';
import { BLOOM_LEVELS, ACTIVITY_TYPES, ASSESSMENT_TYPES } from './schema.mjs';

export function validateDesign(design) {
  const errors = [];
  if (!design.title?.trim()) errors.push('title is required');
  if (!Number.isFinite(design.durationMinutes) || design.durationMinutes <= 0) errors.push('durationMinutes must be > 0');
  for (const [si, sequence] of (design.sequences ?? []).entries()) {
    if (!sequence.title?.trim()) errors.push(`sequence ${si + 1}: title is required`);
    for (const [ai, activity] of (sequence.activities ?? []).entries()) {
      if (!ACTIVITY_TYPES.includes(activity.type)) errors.push(`sequence ${si + 1}, activity ${ai + 1}: invalid type`);
      if (!ASSESSMENT_TYPES.includes(activity.assessment ?? 'none')) errors.push(`sequence ${si + 1}, activity ${ai + 1}: invalid assessment`);
      if (!Number.isFinite(activity.durationMinutes) || activity.durationMinutes <= 0) errors.push(`sequence ${si + 1}, activity ${ai + 1}: invalid duration`);
    }
  }
  for (const [oi, outcome] of (design.outcomes ?? []).entries()) {
    if (!BLOOM_LEVELS.includes(outcome.bloom)) errors.push(`outcome ${oi + 1}: invalid Bloom level`);
    if (!outcome.statement?.trim()) errors.push(`outcome ${oi + 1}: statement is required`);
  }
  return { valid: errors.length === 0, errors };
}

if (process.argv[1]?.endsWith('validate-design.mjs') && process.argv[2]) {
  const design = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  const result = validateDesign(design);
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.valid ? 0 : 1);
}
