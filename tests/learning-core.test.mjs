import test from 'node:test';
import assert from 'node:assert/strict';
import { validateDesign } from '../packages/learning-core/src/validate-design.mjs';

const validDesign = {
  title: 'Test formation',
  durationMinutes: 120,
  outcomes: [{ bloom: 'apply', statement: 'Appliquer une méthode' }],
  sequences: [{ title: 'Séquence 1', activities: [{ type: 'practice', durationMinutes: 60, assessment: 'formative' }] }]
};

test('validateDesign accepts a valid design', () => {
  const result = validateDesign(validDesign);
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test('validateDesign rejects invalid activity type', () => {
  const design = structuredClone(validDesign);
  design.sequences[0].activities[0].type = 'unknown';
  const result = validateDesign(design);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('invalid type')));
});

test('validateDesign rejects invalid Bloom level', () => {
  const design = structuredClone(validDesign);
  design.outcomes[0].bloom = 'master';
  const result = validateDesign(design);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('invalid Bloom')));
});
