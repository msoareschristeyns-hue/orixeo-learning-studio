#!/usr/bin/env node
import fs from 'node:fs';
import { validateDesign } from '../packages/learning-core/src/validate-design.mjs';
import { TEMPLATE_CATALOG } from '../packages/templates/src/catalog.mjs';
import { toMarkdown } from '../packages/exporters/src/index.mjs';

const [,, command, file] = process.argv;

if (command === 'templates') {
  console.log(TEMPLATE_CATALOG.map(({id,family,title}) => ({id,family,title})));
} else if (command === 'validate' && file) {
  const design = JSON.parse(fs.readFileSync(file, 'utf8'));
  console.log(JSON.stringify(validateDesign(design), null, 2));
} else if (command === 'export-md' && file) {
  const design = JSON.parse(fs.readFileSync(file, 'utf8'));
  console.log(toMarkdown(design));
} else {
  console.log(`Orixeo Learning CLI\n\nCommands:\n  templates\n  validate <design.json>\n  export-md <design.json>`);
}
