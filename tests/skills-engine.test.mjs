import test from 'node:test';
import assert from 'node:assert/strict';
import { observeMessage, observeDecision, aggregateSkillEvidence } from '../packages/skills-engine/src/index.mjs';

test('learner questions create skill evidence', () => {
  const observations = observeMessage('Pourquoi cette hausse ? Pouvez-vous confirmer vos chiffres et votre source ?', { source: 'voice', turn: 2 });
  const skills = new Set(observations.map(item => item.skill));
  assert.ok(skills.has('questioning'));
  assert.ok(skills.has('verification'));
});

test('decision creates diagnostic and decision-making evidence', () => {
  const observations = observeDecision({ hypothesis: 'Mon hypothèse est un risque de rupture.', decision: 'Je recommande une négociation conditionnelle.', evidence: 'Le stock couvre 19 jours.' }, 6);
  const skills = new Set(observations.map(item => item.skill));
  assert.ok(skills.has('diagnostic'));
  assert.ok(skills.has('decision-making'));
  const summary = aggregateSkillEvidence(observations, ['diagnostic', 'decision-making']);
  assert.equal(summary.length, 2);
  assert.ok(summary.every(item => item.score > 0));
});
