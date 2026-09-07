import { can } from '../../packages/saas-core/src/rbac.mjs';
import { getPlan, withinQuota } from '../../packages/saas-core/src/plans.mjs';

const $ = (id) => document.getElementById(id);
const orgs = {
  orixeo: { name:'Orixeo Lab', designs:4, seats:1 },
  acme: { name:'Entreprise Démo B', designs:19, seats:2 }
};

function list(items){ return `<ul>${items.map(x=>`<li>${x}</li>`).join('')}</ul>`; }

function run(){
  const role = $('role').value;
  const org = orgs[$('tenant').value];
  const plan = getPlan($('plan').value);
  const checks = ['design.read','design.write','design.publish','members.manage','billing.manage','analytics.read']
    .map(p => `${p} : ${can(role,p) ? 'oui' : 'non'}`);
  const quotas = [
    `Designs ${org.designs}/${plan.designs} : ${withinQuota({planId:plan.id,metric:'designs',current:org.designs})?'ok':'limite atteinte'}`,
    `Sièges ${org.seats}/${plan.seats} : ${withinQuota({planId:plan.id,metric:'seats',current:org.seats})?'ok':'limite atteinte'}`,
    `Analytics : ${plan.analytics ? 'inclus' : 'non inclus'}`
  ];
  $('status').textContent='Test OK'; $('status').className='badge ok';
  $('result').className='';
  $('result').innerHTML=`<h3>${$('userName').value} · ${org.name}</h3><p class="meta">${role} · ${plan.id}</p><h4>Permissions</h4>${list(checks)}<h4>Quotas</h4>${list(quotas)}`;
}

function isolation(){
  const current = orgs[$('tenant').value];
  const other = $('tenant').value === 'orixeo' ? orgs.acme : orgs.orixeo;
  $('status').textContent='Isolation simulée'; $('status').className='badge ok';
  $('result').className='';
  $('result').innerHTML=`<h3>Isolation des espaces</h3><p>Espace courant : <strong>${current.name}</strong></p><p>Les données de <strong>${other.name}</strong> ne sont pas affichées dans cette session.</p><p class="meta">Le backend réel appliquera le même principe avec les règles multi-tenant et PostgreSQL RLS.</p>`;
}

$('runBtn').addEventListener('click',run);
$('crossTenantBtn').addEventListener('click',isolation);
run();
