#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { parseSyllabusText } from '../packages/syllabus-importer/src/index.mjs';
import { validateDesign } from '../packages/learning-core/src/validate-design.mjs';

const input = process.argv[2];
const output = process.argv[3] || 'syllabus-design.json';
if (!input) {
  console.error('Usage: node bin/import-syllabus.mjs <syllabus.pdf|txt|md> [output.json]');
  process.exit(2);
}

let text;
if (path.extname(input).toLowerCase() === '.pdf') {
  const extracted = path.join(os.tmpdir(), `orixeo-syllabus-${process.pid}.txt`);
  try {
    execFileSync('pdftotext', ['-layout', input, extracted]);
    text = fs.readFileSync(extracted, 'utf8');
  } finally {
    if (fs.existsSync(extracted)) fs.unlinkSync(extracted);
  }
} else {
  text = fs.readFileSync(input, 'utf8');
}

const design = parseSyllabusText(text);
const validation = validateDesign(design);
if (!validation.valid) {
  console.error(JSON.stringify(validation, null, 2));
  process.exit(1);
}
fs.writeFileSync(output, JSON.stringify(design, null, 2));
console.log(JSON.stringify({ valid: true, output, title: design.title, durationMinutes: design.durationMinutes }, null, 2));
