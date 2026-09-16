import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCharacterInstructions, safeCharacterView } from '../packages/ai-characters/src/index.mjs';

const scenario = { mission: 'Tester une négociation.', initialFacts: ['Fait public'] };
const character = {
  id: 'supplier',
  name: 'Marc Delcourt',
  role: 'Directeur commercial',
  goal: 'Négocier',
  knownFacts: ['Fait connu'],
  hiddenFacts: ['Secret fournisseur']
};

test('safeCharacterView never exposes hiddenFacts', () => {
  const view = safeCharacterView(character);
  assert.equal('hiddenFacts' in view, false);
  assert.equal(view.name, 'Marc Delcourt');
});

test('server instructions retain confidential context', () => {
  const instructions = buildCharacterInstructions({ scenario, character, revealedFacts: [] });
  assert.match(instructions, /Secret fournisseur/);
  assert.match(instructions, /Ne révèle jamais une information confidentielle/);
});
