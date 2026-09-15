import { activities, activityDomains, activityFormats, filterActivities } from '../../packages/activities/src/catalog.mjs';

const search = document.querySelector('#search');
const domain = document.querySelector('#domain');
const format = document.querySelector('#format');
const cards = document.querySelector('#cards');
const count = document.querySelector('#count');
const dialog = document.querySelector('#activity-dialog');
const dialogContent = document.querySelector('#dialog-content');

domain.insertAdjacentHTML('beforeend', activityDomains.map((v) => `<option>${v}</option>`).join(''));
format.insertAdjacentHTML('beforeend', activityFormats.map((v) => `<option>${v}</option>`).join(''));

function render() {
  const items = filterActivities({ query: search.value, domain: domain.value, format: format.value });
  count.textContent = items.length;
  cards.innerHTML = items.map((item) => `
    <article class="activity-card">
      <div class="card-top"><span class="pill">${item.domain}</span><span>${item.duration} min</span></div>
      <h2>${item.title}</h2>
      <p>${item.objective}</p>
      <div class="meta"><span>${item.format}</span><span>${item.level}</span><span>${item.audience}</span></div>
      <button data-id="${item.id}">Voir la fiche</button>
    </article>`).join('');
}

function openActivity(id) {
  const item = activities.find((activity) => activity.id === id);
  if (!item) return;
  dialogContent.innerHTML = `
    <p class="eyebrow">${item.domain} · ${item.duration} min · ${item.format}</p>
    <h2>${item.title}</h2>
    <h3>Objectif pedagogique</h3><p>${item.objective}</p>
    <h3>Situation professionnelle</h3><p>${item.situation}</p>
    <h3>Consignes</h3><ol>${item.instructions.map((v) => `<li>${v}</li>`).join('')}</ol>
    <h3>Template apprenant</h3><div class="template-row">${item.learnerTemplate.map((v) => `<span>${v}</span>`).join('')}</div>
    <h3>Reponse attendue</h3><p>${item.expectedAnswer}</p>
    <h3>Debrief formateur</h3><ul>${item.debrief.map((v) => `<li>${v}</li>`).join('')}</ul>
    <div class="ai-note"><strong>Assistance IA :</strong> ${item.aiAssistance}</div>`;
  dialog.showModal();
}

[search, domain, format].forEach((element) => element.addEventListener('input', render));
cards.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-id]');
  if (button) openActivity(button.dataset.id);
});
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
render();
