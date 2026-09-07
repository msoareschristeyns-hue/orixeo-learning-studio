import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSyllabusText } from '../packages/syllabus-importer/src/index.mjs';
import { validateDesign } from '../packages/learning-core/src/validate-design.mjs';
import { toHtml, exportManifest } from '../packages/exporters/src/index.mjs';

const syllabus = `
PLAN DIRECTEUR ACHAT dont MANAGEMENT DU RISQUE OPERATIONNEL ACHAT
Formation concernée M2 MDA
Face à face 14 heures
Objectifs de compétences
- Identifier, anticiper et gérer les risques fournisseurs
- Construire une cartographie appropriée
- Déterminer les actions de progrès à mener
CONTENU ET RECOMMANDATION D'ANIMATION
`;

test('imports a syllabus into a valid design requiring human validation', () => {
  const design = parseSyllabusText(syllabus);
  assert.equal(design.durationMinutes, 840);
  assert.equal(design.sequences.length, 4);
  assert.equal(design.source.requiresHumanValidation, true);
  assert.equal(design.sequences.flatMap(s => s.activities).reduce((sum, activity) => sum + activity.durationMinutes, 0), 840);
  assert.deepEqual(validateDesign(design), { valid: true, errors: [] });
  assert.match(toHtml(design), /<!doctype html>/);
  assert.ok(exportManifest().ready.includes('html'));
});

test('rejects syllabus without detectable duration', () => {
  assert.throws(() => parseSyllabusText('Programme sans durée'), /duration could not be detected/);
});
