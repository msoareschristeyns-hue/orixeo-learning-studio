import { TEMPLATE_CATALOG, getTemplate } from '../../packages/templates/src/catalog.mjs';

const $ = (id) => document.getElementById(id);
const STORAGE_KEY = 'orixeo-learning-studio-draft-v1';
let currentDesign = null;

for (const item of TEMPLATE_CATALOG) {
  const option = document.createElement('option');
  option.value = item.id;
  option.textContent = `${item.title} · ${item.family}`;
  $('template').appendChild(option);
}

const activityTypes = ['input','investigation','practice','production','discussion','collaboration','simulation','assessment'];
const assessmentTypes = ['none','diagnostic','formative','summative','peer'];
const aiLevels = [0,1,2,3,4,5];
const lines = (value) => value.split('\n').map(v => v.trim()).filter(Boolean);
const esc = (v='') => String(v).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function buildDesign() {
  const template = getTemplate($('template').value);
  const objectives = lines($('objectives').value);
  const moments = template?.moments ?? ['Cadrage','Apport','Mise en pratique','Synthèse'];
  const perActivity = Math.max(15, Math.floor(Number($('duration').value) / Math.max(1, moments.length)));
  currentDesign = {
    id: crypto.randomUUID(),
    title: $('title').value.trim(),
    audience: $('audience').value.trim(),
    durationMinutes: Number($('duration').value),
    deliveryMode: $('mode').value,
    objectives,
    outcomes: objectives.map((o, i) => ({ bloom: i === 0 ? 'understand' : 'apply', statement: o })),
    sequences: moments.map((title, index) => ({
      id: crypto.randomUUID(),
      title,
      activities: [newActivity(index, perActivity, index === moments.length - 1)]
    })),
    metadata: { cleanRoom: true, generatedBy: 'orixeo-web-editor', template: template?.id ?? null, updatedAt: new Date().toISOString() }
  };
  render();
}

function newActivity(index = 0, duration = 30, final = false) {
  return {
    id: crypto.randomUUID(),
    type: index === 0 ? 'discussion' : index === 1 ? 'input' : index === 2 ? 'practice' : 'assessment',
    title: index === 0 ? 'Faire émerger les représentations' : index === 1 ? 'Apport structuré' : index === 2 ? 'Mise en situation' : 'Activité pédagogique',
    durationMinutes: duration,
    assessment: final ? 'formative' : 'none',
    aiAssistanceLevel: index === 2 ? 2 : 0,
    notes: 'Contenu à contextualiser selon le public et les objectifs.'
  };
}

function qualityReport() {
  if (!currentDesign) return { score: 0, items: ['Aucun scénario généré.'] };
  const items = [];
  const acts = currentDesign.sequences.flatMap(s => s.activities ?? []);
  let score = 100;
  const used = new Set(acts.map(a => a.type));
  const total = acts.reduce((sum, a) => sum + Number(a.durationMinutes || 0), 0);
  if (!currentDesign.title) { score -= 15; items.push('Ajouter un titre.'); }
  if (!currentDesign.objectives.length) { score -= 20; items.push('Ajouter au moins un objectif.'); }
  if (acts.length < 3) { score -= 15; items.push('Prévoir au moins trois activités.'); }
  if (used.size < 3) { score -= 10; items.push('Diversifier les types d’activités.'); }
  if (!acts.some(a => a.assessment !== 'none')) { score -= 15; items.push('Ajouter une modalité d’évaluation.'); }
  if (Math.abs(total - currentDesign.durationMinutes) > Math.max(15, currentDesign.durationMinutes * .15)) { score -= 10; items.push(`Temps planifié ${total} min pour ${currentDesign.durationMinutes} min prévus.`); }
  if (!acts.some(a => Number(a.aiAssistanceLevel) > 0)) items.push('Option : expliciter un usage IA sur une activité si pertinent.');
  if (!items.length) items.push('Scénario cohérent et équilibré.');
  return { score: Math.max(0, score), items };
}

function syncHeader() {
  if (!currentDesign) return;
  currentDesign.title = $('title').value.trim();
  currentDesign.audience = $('audience').value.trim();
  currentDesign.durationMinutes = Number($('duration').value);
  currentDesign.deliveryMode = $('mode').value;
  currentDesign.objectives = lines($('objectives').value);
  currentDesign.metadata.updatedAt = new Date().toISOString();
}

function render() {
  if (!currentDesign) {
    $('design').innerHTML = '<div class="empty">Générez un scénario pour commencer.</div>';
    $('addSequenceBtn').classList.add('hidden');
    return;
  }
  syncHeader();
  const q = qualityReport();
  $('qualityScore').textContent = `${q.score}/100`;
  $('qualityList').innerHTML = q.items.map(i => `<li>${esc(i)}</li>`).join('');
  $('status').textContent = q.score >= 85 ? 'Validé' : q.score >= 65 ? 'À améliorer' : 'Incomplet';
  $('status').className = `badge ${q.score >= 85 ? 'ok' : 'warn'}`;
  $('addSequenceBtn').classList.remove('hidden');
  $('design').innerHTML = `<h3>${esc(currentDesign.title)}</h3><p class="meta">${esc(currentDesign.audience)} · ${currentDesign.durationMinutes} min · ${esc(currentDesign.deliveryMode)}</p>` + currentDesign.sequences.map((seq, si) => `
    <article class="sequence" data-seq="${si}">
      <div class="sequence-head"><input class="seq-title" value="${esc(seq.title)}"><div class="sequence-actions"><button class="icon-btn move-up">↑</button><button class="icon-btn move-down">↓</button><button class="icon-btn danger delete-seq">Supprimer</button></div></div>
      <div class="activities">${seq.activities.map((a, ai) => activityHtml(a, si, ai)).join('')}</div>
      <div class="toolbar"><button class="icon-btn add-act">+ Activité</button></div>
    </article>`).join('');
  bindEditor();
}

function activityHtml(a, si, ai) {
  const options = (list, selected) => list.map(v => `<option value="${v}" ${v === selected ? 'selected' : ''}>${v}</option>`).join('');
  return `<div class="activity" data-seq="${si}" data-act="${ai}">
    <div class="activity-grid">
      <label>Titre<input class="act-title" value="${esc(a.title)}"></label>
      <label>Type<select class="act-type">${options(activityTypes,a.type)}</select></label>
      <label>Durée<input class="act-duration" type="number" min="5" step="5" value="${Number(a.durationMinutes)||30}"></label>
      <label>Évaluation<select class="act-assessment">${options(assessmentTypes,a.assessment)}</select></label>
      <label>IA<select class="act-ai">${aiLevels.map(v => `<option value="${v}" ${Number(a.aiAssistanceLevel)===v?'selected':''}>Niveau ${v}</option>`).join('')}</select></label>
    </div>
    <label>Notes<textarea class="act-notes">${esc(a.notes)}</textarea></label>
    <div class="activity-actions"><button class="icon-btn act-up">↑ Activité</button><button class="icon-btn act-down">↓ Activité</button><button class="icon-btn danger delete-act">Supprimer</button></div>
  </div>`;
}

function bindEditor() {
  document.querySelectorAll('.sequence').forEach(node => {
    const si = Number(node.dataset.seq);
    node.querySelector('.seq-title').addEventListener('input', e => { currentDesign.sequences[si].title = e.target.value; renderQualityOnly(); });
    node.querySelector('.delete-seq').onclick = () => { currentDesign.sequences.splice(si,1); render(); };
    node.querySelector('.move-up').onclick = () => move(currentDesign.sequences,si,-1);
    node.querySelector('.move-down').onclick = () => move(currentDesign.sequences,si,1);
    node.querySelector('.add-act').onclick = () => { currentDesign.sequences[si].activities.push(newActivity(3,30,false)); render(); };
  });
  document.querySelectorAll('.activity').forEach(node => {
    const si = Number(node.dataset.seq), ai = Number(node.dataset.act), a = currentDesign.sequences[si].activities[ai];
    node.querySelector('.act-title').addEventListener('input', e => { a.title=e.target.value; renderQualityOnly(); });
    node.querySelector('.act-type').addEventListener('change', e => { a.type=e.target.value; renderQualityOnly(); });
    node.querySelector('.act-duration').addEventListener('input', e => { a.durationMinutes=Number(e.target.value); renderQualityOnly(); });
    node.querySelector('.act-assessment').addEventListener('change', e => { a.assessment=e.target.value; renderQualityOnly(); });
    node.querySelector('.act-ai').addEventListener('change', e => { a.aiAssistanceLevel=Number(e.target.value); renderQualityOnly(); });
    node.querySelector('.act-notes').addEventListener('input', e => { a.notes=e.target.value; });
    node.querySelector('.delete-act').onclick = () => { currentDesign.sequences[si].activities.splice(ai,1); render(); };
    node.querySelector('.act-up').onclick = () => move(currentDesign.sequences[si].activities,ai,-1);
    node.querySelector('.act-down').onclick = () => move(currentDesign.sequences[si].activities,ai,1);
  });
}

function move(list, index, delta) { const next=index+delta; if(next<0||next>=list.length)return; [list[index],list[next]]=[list[next],list[index]]; render(); }
function renderQualityOnly(){ const q=qualityReport(); $('qualityScore').textContent=`${q.score}/100`; $('qualityList').innerHTML=q.items.map(i=>`<li>${esc(i)}</li>`).join(''); }

function toMarkdown(d) {
  return `# ${d.title}\n\n**Public :** ${d.audience}\n\n**Durée :** ${d.durationMinutes} min\n\n**Modalité :** ${d.deliveryMode}\n\n## Objectifs\n${d.objectives.map(o=>`- ${o}`).join('\n')}\n\n${d.sequences.map(s=>`## ${s.title}\n${s.activities.map(a=>`### ${a.title}\n- Type : ${a.type}\n- Durée : ${a.durationMinutes} min\n- Évaluation : ${a.assessment}\n- IA : niveau ${a.aiAssistanceLevel}\n\n${a.notes||''}`).join('\n\n')}`).join('\n\n')}`;
}
function toHtml(d) { return `<!doctype html><meta charset="utf-8"><title>${esc(d.title)}</title><h1>${esc(d.title)}</h1><p>${esc(d.audience)} · ${d.durationMinutes} min</p>${d.sequences.map(s=>`<h2>${esc(s.title)}</h2>${s.activities.map(a=>`<h3>${esc(a.title)}</h3><p>${esc(a.type)} · ${a.durationMinutes} min · ${esc(a.assessment)} · IA ${a.aiAssistanceLevel}</p><p>${esc(a.notes||'')}</p>`).join('')}`).join('')}`; }
function download(content, type, filename){ const blob=new Blob([content],{type}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url); }

$('generateBtn').addEventListener('click', buildDesign);
$('addSequenceBtn').addEventListener('click', () => { if(!currentDesign)return; currentDesign.sequences.push({id:crypto.randomUUID(),title:'Nouvelle séquence',activities:[newActivity(3,30,false)]}); render(); });
$('saveBtn').addEventListener('click', () => { if(!currentDesign) buildDesign(); syncHeader(); localStorage.setItem(STORAGE_KEY, JSON.stringify(currentDesign)); $('status').textContent='Brouillon sauvegardé'; });
$('loadBtn').addEventListener('click', () => { const raw=localStorage.getItem(STORAGE_KEY); if(!raw)return; currentDesign=JSON.parse(raw); $('title').value=currentDesign.title||''; $('audience').value=currentDesign.audience||''; $('duration').value=currentDesign.durationMinutes||60; $('mode').value=currentDesign.deliveryMode||'onsite'; $('objectives').value=(currentDesign.objectives||[]).join('\n'); render(); });
$('exportBtn').addEventListener('click', () => { if(!currentDesign) buildDesign(); syncHeader(); const f=$('exportFormat').value; if(f==='md') download(toMarkdown(currentDesign),'text/markdown','orixeo-design.md'); else if(f==='html') download(toHtml(currentDesign),'text/html','orixeo-design.html'); else download(JSON.stringify(currentDesign,null,2),'application/json','orixeo-design.json'); });
['title','audience','duration','mode','objectives'].forEach(id => $(id).addEventListener('input', () => { if(currentDesign){ syncHeader(); renderQualityOnly(); }}));

render();