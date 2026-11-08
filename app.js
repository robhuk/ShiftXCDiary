(()=>{'use strict';
const APP_ID='uk.co.crosscountry.shiftapp', VERSION='1.0.4', STORE='uk.co.crosscountry.shiftapp.shiftdata.v1', UPDATE_CHECK_KEY='uk.co.crosscountry.shiftapp.lastUpdateCheck';
const $=id=>document.getElementById(id);
const state={trains:[],entries:[]};
const nowLocal=()=>{const d=new Date();return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)};
const stamp=()=>new Date().toISOString();
const fmt=iso=>{const d=new Date(iso);return Number.isNaN(d.getTime())?'Unknown time':d.toLocaleString('en-GB',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'})};
const cleanHead=v=>String(v||'').toUpperCase().replace(/[^0-9A-Z]/g,'').slice(0,4);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const status=msg=>{$('status').textContent=msg};
$('shiftDate').value=nowLocal();
if($('version'))$('version').textContent='v'+VERSION;
function snapshot(){return {appId:APP_ID,version:VERSION,shift:{date:$('shiftDate').value,headcode:cleanHead($('shiftHeadcode').value),notes:$('shiftNotes').value},trains:state.trains,entries:state.entries,updatedAt:stamp()}}
function persist(silent=false){try{localStorage.setItem(STORE,JSON.stringify(snapshot()));if(!silent)status('Saved on this device · '+new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}));return true}catch(err){if(!silent)status('Could not save locally. Check device storage settings.');return false}}
// Save a final snapshot whenever the app is backgrounded, refreshed or closed.
window.addEventListener('pagehide',()=>persist(true));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')persist(true)});
function load(){try{const raw=localStorage.getItem(STORE);if(raw){const s=JSON.parse(raw);if(s&&s.appId===APP_ID){if(s.shift){$('shiftDate').value=s.shift.date||nowLocal();$('shiftHeadcode').value=s.shift.headcode||'';$('shiftNotes').value=s.shift.notes||''}state.trains=Array.isArray(s.trains)?s.trains:[];state.entries=Array.isArray(s.entries)?s.entries:[]}}}catch(err){console.warn('Saved shift could not be read',err);status('Saved data could not be read.')}render()}
function render(){
 $('trains').className=state.trains.length?'':'empty';
 $('trains').innerHTML=state.trains.length?state.trains.map((t,i)=>`<div class="trainrow"><div><strong>${esc(t.headcode)}</strong><div class="muted">Unit ${esc(t.unit)}</div></div><button type="button" class="remove" data-train="${i}" aria-label="Remove train">Remove</button></div>`).join(''):'No trains added yet.';
 $('entries').className='entries '+(state.entries.length?'':'empty');
 $('entries').innerHTML=state.entries.length?state.entries.map((e,i)=>`<article class="entry ${e.type==='Reminder'?'reminder':''}"><div class="entrytop"><span>${esc(String(e.type||'NOTE').toUpperCase())}</span><time>${esc(fmt(e.timestamp))}</time></div><p>${esc(e.text)}</p><button type="button" class="remove" data-entry="${i}">Delete</button><div style="clear:both"></div></article>`).join(''):'No log entries yet.';
 $('entryCount').textContent=`${state.entries.length} ${state.entries.length===1?'entry':'entries'}`;
}
$('shiftHeadcode').addEventListener('input',e=>{e.target.value=cleanHead(e.target.value);persist(true)});
['shiftDate','shiftNotes'].forEach(id=>$(id).addEventListener('input',()=>persist(true)));
$('addTrain').addEventListener('click',()=>{$('trainForm').reset();$('trainDialog').showModal();$('trainCode').focus()});
$('trainForm').addEventListener('submit',e=>{e.preventDefault();const code=cleanHead($('trainCode').value),unit=$('unitNumber').value.replace(/\D/g,'');if(code.length!==4){alert('Enter a four-character headcode, for example 1V50.');$('trainCode').focus();return}if(unit.length!==6){alert('Enter a six-digit unit number.');$('unitNumber').focus();return}state.trains.push({headcode:code,unit,addedAt:stamp()});$('trainDialog').close();render();persist()});
const type=$('entryType'),dyn=$('dynamicFields');
function fields(){const common=(id,label,placeholder='')=>`<label>${label}<input id="${id}" placeholder="${placeholder}"></label>`;let html='';switch(type.value){case'Defect':html=common('coach','Coach letter','e.g. A')+`<label>Defect category<select id="defectCategory"><option>Safety Critical</option><option>Non-Safety Critical</option><option>Service Critical</option></select></label>`;break;case'Passenger Counts':html=`<div class="dynamic-grid"><label>First Class<input id="firstCount" type="number" min="0" step="1" value="0"></label><label>Standard Class<input id="standardCount" type="number" min="0" step="1" value="0"></label></div>`+common('location','Location','Station / between stations');break;case'Delay':html=`<label>Delay (minutes)<input id="delayMinutes" type="number" min="0" step="1" value="0"></label>`;break;case'Assist':html=`<div class="dynamic-grid">${common('coach','Coach letter','e.g. B')}${common('seat','Seat number','e.g. 42')}</div>`;break;}
 dyn.innerHTML=html;
 const labels={'Control Message':'Control message','Reminder':'Reminder details','General Note':'General note','Defect':'Defect description','Passenger Counts':'Additional information','Delay':'Nature of delay','Assist':'Nature of assistance'};
 $('descriptionLabel').firstChild.textContent=labels[type.value]||'Information / description';
}
type.addEventListener('change',fields);
$('addIssue').addEventListener('click',()=>{$('issueForm').reset();fields();$('issueDialog').showModal();$('description').focus()});
$('issueForm').addEventListener('submit',e=>{e.preventDefault();const t=type.value,desc=$('description').value.trim();if(!desc){$('description').focus();status('Please enter the entry details.');return}let prefix='';const val=id=>$(id)?.value??'';switch(t){case'Defect':prefix=`Coach ${val('coach')||'Not specified'} · ${val('defectCategory')}\n`;break;case'Passenger Counts':prefix=`First Class: ${val('firstCount')} · Standard Class: ${val('standardCount')} · Location: ${val('location')||'Not specified'}\n`;break;case'Delay':prefix=`Delay: ${val('delayMinutes')} minutes\n`;break;case'Assist':prefix=`Coach ${val('coach')||'Not specified'} · Seat ${val('seat')||'Not specified'}\n`;break;}
 state.entries.push({type:t,text:prefix+desc,timestamp:stamp(),id:(crypto.randomUUID?crypto.randomUUID():String(Date.now())+'-'+Math.random().toString(16).slice(2))});$('issueDialog').close();render();persist()});
$('entries').addEventListener('click',e=>{const i=e.target.dataset.entry;if(i!==undefined){state.entries.splice(Number(i),1);render();persist()}});
$('trains').addEventListener('click',e=>{const i=e.target.dataset.train;if(i!==undefined){state.trains.splice(Number(i),1);render();persist()}});
function report(){const s=snapshot();return `XC SHIFTAPP — OPERATIONAL SHIFT LOG\nDate: ${s.shift.date}\nHeadcode: ${s.shift.headcode}\nShift notes:\n${s.shift.notes||'—'}\n\nTRAINS\n${s.trains.length?s.trains.map(t=>`${t.headcode} — Unit ${t.unit}`).join('\n'):'None recorded'}\n\nCHRONOLOGICAL LOG\n${s.entries.length?s.entries.map(e=>`${fmt(e.timestamp)} | ${e.type}\n${e.text}`).join('\n\n'):'No entries recorded'}\n\nGenerated by XC ShiftApp ${VERSION}`}
async function copyText(text){try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text)}else{fallbackCopy(text)}status('Shift log copied to clipboard.')}catch(err){try{fallbackCopy(text)}catch(e){status('Copy unavailable. Please use a secure browser connection.')}}}
function fallbackCopy(text){const el=document.createElement('textarea');el.value=text;el.setAttribute('readonly','');el.style.position='fixed';el.style.opacity='0';document.body.appendChild(el);el.select();const ok=document.execCommand('copy');el.remove();if(!ok)throw new Error('Clipboard copy failed')}
$('save').addEventListener('click',()=>persist());
$('copy').addEventListener('click',()=>copyText(report()));
$('email').addEventListener('click',()=>copyText(`Subject: Shift Log – ${$('shiftHeadcode').value||'No headcode'} – ${$('shiftDate').value}\n\n${report()}`));
$('pdf').addEventListener('click',()=>{persist(true);openPrintPreview()});
$('clear').addEventListener('click',()=>{if(!confirm('Clear all shift details, trains and log entries? This cannot be undone.'))return;state.trains=[];state.entries=[];$('shiftDate').value=nowLocal();$('shiftHeadcode').value='';$('shiftNotes').value='';render();try{localStorage.removeItem(STORE);status('Shift cleared.')}catch(err){status('Shift cleared from screen, but saved data could not be removed.')}});
let deferredPrompt;$('installBtn')?.addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('installBtn').classList.add('hidden')});window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('installBtn')?.classList.remove('hidden')});
function openPrintPreview(){
 const s=snapshot(), body=`<h1>XC ShiftApp — Operational Shift Log</h1><section><h2>Shift details</h2><p><b>Date:</b> ${esc(s.shift.date||'—')} &nbsp; <b>Headcode:</b> ${esc(s.shift.headcode||'—')}</p><p><b>Shift notes</b><br>${esc(s.shift.notes||'—').replace(/\n/g,'<br>')}</p></section><section><h2>Trains</h2>${s.trains.length?s.trains.map(t=>`<p><b>${esc(t.headcode)}</b> — Unit ${esc(t.unit)}</p>`).join(''):'<p>None recorded</p>'}</section><section><h2>Chronological log</h2>${s.entries.length?s.entries.map(e=>`<article><div class="entryhead">${esc(e.type)} <time>${esc(fmt(e.timestamp))}</time></div><p>${esc(e.text).replace(/\n/g,'<br>')}</p></article>`).join(''):'<p>No entries recorded</p>'}</section>`;
 const w=window.open('','_blank');
 if(!w){status('Print preview was blocked. Allow pop-ups for this app and try again.');return}
 w.document.open();w.document.write(`<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Shift log print preview</title><style>*{box-sizing:border-box}body{margin:0;background:#f2edf0;color:#241821;font:15px/1.5 system-ui, sans-serif}.toolbar{position:sticky;top:0;display:flex;gap:10px;justify-content:flex-end;padding:12px;background:#240713;color:white;border-bottom:3px solid #e50069}.toolbar button{border:0;border-radius:9px;padding:10px 16px;font-weight:800;cursor:pointer}.print{background:#e50069;color:#fff}.close{background:#fff;color:#a50034}.sheet{max-width:850px;margin:22px auto;padding:34px;background:#fff;box-shadow:0 4px 24px #0002;border-radius:12px}h1{color:#a50034;border-bottom:3px solid #e50069;padding-bottom:12px}h2{font-size:18px;color:#a50034;margin:22px 0 8px}section{break-inside:avoid}article{border:1px solid #ddd;border-left:4px solid #e50069;border-radius:7px;padding:10px 13px;margin:10px 0;break-inside:avoid}.entryhead{font-weight:800;display:flex;justify-content:space-between;gap:12px}time{font-size:12px;color:#655b62;font-weight:500}article p{white-space:normal;margin:6px 0 0}.foot{margin-top:28px;color:#777;font-size:11px}@media print{body{background:#fff}.toolbar{display:none}.sheet{margin:0;max-width:none;padding:0;box-shadow:none;border-radius:0}h1,h2{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><nav class="toolbar"><button class="close" type="button" onclick="window.close()">Close preview</button><button class="print" type="button" onclick="window.print()">Print / Save PDF</button></nav><main class="sheet">${body}<p class="foot">Generated by XC ShiftApp ${VERSION}</p></main></body></html>`);w.document.close();
}
async function checkForUpdates(reg){
 try{const last=Number(localStorage.getItem(UPDATE_CHECK_KEY)||0), now=Date.now();if(now-last<24*60*60*1000)return;await reg.update();localStorage.setItem(UPDATE_CHECK_KEY,String(now));status('App update check completed.');}catch(err){console.warn('Update check failed',err)}
}
if('serviceWorker'in navigator)window.addEventListener('load',async()=>{
 try{const reg=await navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'});await checkForUpdates(reg);
  window.setInterval(()=>checkForUpdates(reg),24*60*60*1000);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')checkForUpdates(reg)});
 }catch(err){console.warn('Service worker registration failed',err)}
});
load();
})();
