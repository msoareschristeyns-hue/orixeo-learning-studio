import test from 'node:test';
import assert from 'node:assert/strict';
import { validateDesign } from '../packages/learning-core/src/validate-design.mjs';

const validDesign = {
  title: 'Test formation',
  durationMinutes: 60,
  deliveryMode: 'onsite',
  objectives: ['Appliquer une méthode'],
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

test('validateDesign rejects inconsistent planned duration', () => {
  const design = structuredClone(validDesign);
  design.durationMinutes = 120;
  const result = validateDesign(design);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('planned duration')));
});

test('validateDesign rejects invalid delivery and AI level', () => {
  const design = structuredClone(validDesign);
  design.deliveryMode = 'hybrid';
  design.sequences[0].activities[0].aiAssistanceLevel = 5;
  const result = validateDesign(design);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('deliveryMode')));
  assert.ok(result.errors.some(e => e.includes('AI assistance')));
});

test('validateDesign rejects empty sequences', () => {
  const design = structuredClone(validDesign);
  design.sequences[0].activities = [];
  design.durationMinutes = 1;
  const result = validateDesign(design);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(e => e.includes('at least one activity')));
});
