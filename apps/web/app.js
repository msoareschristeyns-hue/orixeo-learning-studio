import { TEMPLATE_CATALOG, getTemplate } from '../../packages/templates/src/catalog.mjs';

const $ = (id) => document.getElementById(id);
let currentDesign = null;

for (const item of TEMPLATE_CATALOG) {
  const option = document.createElement('option');
  option.value = item.id;
  option.textContent = `${item.title} · ${item.family}`;
  $('template').appendChild(option);
}

function lines(value) { return value.split('\n').map(v => v.trim()).filter(Boolean); }

function buildDesign() {
  const template = getTemplate($('template').value);
  const objectives = lines($('objectives').value);
  const sequences = (template?.moments ?? ['Cadrage','Apport','Mise en pratique','Synthèse']).map((title, index) => ({
    id: `seq-${index + 1}`,
    title,
    activities: [{
      id: `act-${index + 1}-1`,
      type: index === 0 ? 'discussion' : index === 1 ? 'input' : index === 2 ? 'practice' : 'assessment',
      title: index === 0 ? 'Faire émerger les représentations' : index === 1 ? 'Apport structuré' : index === 2 ? 'Mise en situation' : 'Synthèse et vérification',
      durationMinutes: Math.max(15, Math.floor(Number($('duration').value) / Math.max(1, (template?.moments?.length ?? 4)))),
      assessment: index === (template?.moments?.length ?? 4) - 1 ? 'formative' : 'none',
      aiAssistanceLevel: index === 2 ? 2 : 0,
      notes: 'Contenu à contextualiser selon le public et les objectifs.'
    }]
  }));
  currentDesign = {
    id: crypto.randomUUID(),
    title: $('title').value.trim(),
    audience: $('audience').value.trim(),
    durationMinutes: Number($('duration').value),
    deliveryMode: $('mode').value,
    objectives,
    outcomes: objectives.map((o, i) => ({ bloom: i === 0 ? 'understand' : 'apply', statement: o })),
    sequences,
    metadata: { cleanRoom: true, generatedBy: 'orixeo-web-mvp', template: template?.id ?? null }
  };
  render();
}

function render() {
  if (!currentDesign) return;
  $('status').textContent = 'Scénario prêt';
  $('design').innerHTML = `<h3>${currentDesign.title}</h3><p class="meta">${currentDesign.audience} · ${currentDesign.durationMinutes} min · ${currentDesign.deliveryMode}</p>` +
    currentDesign.sequences.map(seq => `<article class="sequence"><h4>${seq.title}</h4>${seq.activities.map(a => `<div class="activity"><strong>${a.title}</strong><div class="meta">${a.type} · ${a.durationMinutes} min · évaluation: ${a.assessment} · IA: niveau ${a.aiAssistanceLevel}</div></div>`).join('')}</article>`).join('');
}

$('generateBtn').addEventListener('click', buildDesign);
$('exportBtn').addEventListener('click', () => {
  if (!currentDesign) buildDesign();
  const blob = new Blob([JSON.stringify(currentDesign, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'orixeo-design.json';
  a.click();
  URL.revokeObjectURL(url);
});
