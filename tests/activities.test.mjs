import test from 'node:test';
import assert from 'node:assert/strict';
import { activities, filterActivities } from '../packages/activities/src/catalog.mjs';

test('activity catalog contains complete professional activities', () => {
  assert.ok(activities.length >= 8);
  for (const activity of activities) {
    assert.ok(activity.id);
    assert.ok(activity.title);
    assert.ok(activity.objective);
    assert.ok(activity.situation);
    assert.ok(activity.instructions.length >= 3);
    assert.ok(activity.learnerTemplate.length >= 4);
    assert.ok(activity.expectedAnswer);
    assert.ok(activity.debrief.length >= 3);
  }
});

test('activity catalog can be filtered by text and domain', () => {
  assert.ok(filterActivities({ query: 'shadow IA' }).some((item) => item.id === 'ai-shadow-map'));
  assert.ok(filterActivities({ domain: 'Achats' }).every((item) => item.domain === 'Achats'));
  assert.equal(filterActivities({ query: 'expression introuvable' }).length, 0);
});
