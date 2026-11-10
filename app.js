(()=>{'use strict';
const APP_ID='uk.co.crosscountry.shiftapp', VERSION='1.1.7', STORE='uk.co.crosscountry.shiftapp.shiftdata.v1', UPDATE_CHECK_KEY='uk.co.crosscountry.shiftapp.lastUpdateCheck';
const $=id=>document.getElementById(id);
const state={trains:[],entries:[]};
const nowLocal=()=>{const d=new Date();return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10)};
const stamp=()=>new Date().toISOString();
const fmt=iso=>{const d=new Date(iso);return Number.isNaN(d.getTime())?'Unknown time':d.toLocaleString('en-GB',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'})};
const cleanHead=v=>String(v||'').toUpperCase().replace(/[^0-9A-Z]/g,'').slice(0,4);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const status=msg=>{$('status').textContent=msg};
// Live CrossCountry clock: Europe/London handles GMT/BST transitions automatically.
function ledDigits(value){
 return String(value).split('').map(n=>'<span class="led-digit">'+n+'</span>').join('');
}
function updateClock(){
 const now=new Date(), parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(now);
 const part=type=>parts.find(x=>x.type===type)?.value||'00';
 $('clockHours').innerHTML=ledDigits(part('hour'));$('clockMinutes').innerHTML=ledDigits(part('minute'));$('clockSeconds').innerHTML=ledDigits(part('second'));
 $('clockDate').textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',weekday:'long',day:'2-digit',month:'long',year:'numeric'}).format(now).toUpperCase();
 const zone=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',timeZoneName:'short'}).formatToParts(now).find(x=>x.type==='timeZoneName')?.value||'UK TIME';
 $('clockZone').textContent=zone;
}
updateClock();window.setInterval(updateClock,250);
$('shiftDate').value=nowLocal();
if($('version'))$('version').textContent='v'+VERSION;
function snapshot(){return {appId:APP_ID,version:VERSION,shift:{date:$('shiftDate').value,jobNumber:$('shiftJobNumber').value.trim(),notes:$('shiftNotes').value},trains:state.trains,entries:state.entries,updatedAt:stamp()}}
function persist(silent=false){try{localStorage.setItem(STORE,JSON.stringify(snapshot()));if(!silent)status('Saved on this device · '+new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}));return true}catch(err){if(!silent)status('Could not save locally. Check device storage settings.');return false}}
// Save a final snapshot whenever the app is backgrounded, refreshed or closed.
window.addEventListener('pagehide',()=>persist(true));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')persist(true)});
function load(){try{const raw=localStorage.getItem(STORE);if(raw){const s=JSON.parse(raw);if(s&&s.appId===APP_ID){if(s.shift){$('shiftDate').value=s.shift.date||nowLocal();$('shiftJobNumber').value=s.shift.jobNumber||s.shift.headcode||'';$('shiftNotes').value=s.shift.notes||''}state.trains=Array.isArray(s.trains)?s.trains:[];state.entries=Array.isArray(s.entries)?s.entries:[]}}}catch(err){console.warn('Saved shift could not be read',err);status('Saved data could not be read.')}render()}
function render(){
 $('trains').className=state.trains.length?'':'empty';
 $('trains').innerHTML=state.trains.length?state.trains.map((t,i)=>`<div class="trainrow"><div><strong>${esc(t.headcode)}</strong><div class="muted">Unit ${esc(t.unit)}${t.unit2?' + '+esc(t.unit2):''}</div></div><button type="button" class="remove" data-train="${i}" aria-label="Remove train">Remove</button></div>`).join(''):'No trains added yet.';
 $('entries').className='entries '+(state.entries.length?'':'empty');
 $('entries').innerHTML=state.entries.length?state.entries.map((e,i)=>{return `<article class="entry ${e.type==='Reminder'?'reminder':''} ${e.type==='Incident'?'incident-entry':''}"><div class="entrytop"><span>${esc((e.type==='Incident'&&e.incidentNumber?`INCIDENT ${e.incidentNumber} — `:'')+String(e.type||'NOTE').toUpperCase())}</span><time>${esc(fmt(e.timestamp))}</time></div><p>${esc(e.text)}</p><button type="button" class="remove" data-entry="${i}">Delete</button><div style="clear:both"></div></article>`}).join(''):'No log entries yet.';
 $('entryCount').textContent=`${state.entries.length} ${state.entries.length===1?'entry':'entries'}`;
}
$('shiftJobNumber').addEventListener('input',()=>persist(true));
['shiftDate','shiftNotes'].forEach(id=>$(id).addEventListener('input',()=>persist(true)));
$('addTrain').addEventListener('click',()=>{$('trainForm').reset();$('trainDialog').showModal();$('trainCode').focus()});
$('trainCancel').addEventListener('click',()=>$('trainDialog').close());$('trainClose').addEventListener('click',()=>$('trainDialog').close());
$('trainForm').addEventListener('submit',e=>{e.preventDefault();const code=cleanHead($('trainCode').value),unit=$('unitNumber').value.replace(/\D/g,''),unit2=$('unitNumber2').value.replace(/\D/g,'');if(code.length!==4){alert('Enter a four-character headcode, for example 1V50.');$('trainCode').focus();return}if(unit.length!==6){alert('Enter a six-digit unit number.');$('unitNumber').focus();return}if(unit2&&unit2.length!==6){alert('Second unit number must be six digits, or left blank.');$('unitNumber2').focus();return}state.trains.push({headcode:code,unit,unit2,addedAt:stamp()});$('trainDialog').close();render();persist()});
let pendingIncidentLogNumber='';
$('incidentLogClose').addEventListener('click',()=>{ $('incidentLogDialog').close(); type.value='General Note'; fields(); });
$('incidentLogCancel').addEventListener('click',()=>{ $('incidentLogDialog').close(); type.value='General Note'; fields(); });
$('hasIncidentLog').addEventListener('change',()=>{const yes=$('hasIncidentLog').value==='yes';$('incidentLogNumberWrap').classList.toggle('hidden',!yes);if(yes)$('incidentLogNumber').focus();});
$('incidentLogContinue').addEventListener('click',()=>{if($('hasIncidentLog').value==='yes'&&!$('incidentLogNumber').value.trim()){$('incidentLogNumber').focus();status('Enter the incident log number, or select No / not yet.');return}pendingIncidentLogNumber=$('hasIncidentLog').value==='yes'?$('incidentLogNumber').value.trim():'';$('incidentLogDialog').close();$('description').focus();});
// Dedicated lost-property capture; stored as a normal timestamped log entry so it appears in every export.
$('lostProperty').addEventListener('click',()=>{$('lostPropertyForm').reset();$('lostPropertyDialog').showModal();$('propertyItem').focus()});
$('lostPropertyCancel').addEventListener('click',()=>$('lostPropertyDialog').close());
$('lostPropertyClose').addEventListener('click',()=>$('lostPropertyDialog').close());
$('lostPropertyForm').addEventListener('submit',e=>{e.preventDefault();const item=$('propertyItem').value.trim(),description=$('propertyDescription').value.trim(),location=$('propertyLocation').value.trim();if(!item||!description||!location){status('Complete the item, description and location fields.');return}const lines=[`Receipt: ${$('propertyReceipt').value}`,`Item: ${item}`,`Description: ${description}`,`Found / handed in at: ${location}`,`Person details: ${$('propertyPerson').value.trim()||'Not provided'}`,`Handover / storage: ${$('propertyHandover').value.trim()||'Not recorded'}`];state.entries.push({type:'Lost Property',text:lines.join('\n'),timestamp:stamp(),id:(crypto.randomUUID?crypto.randomUUID():String(Date.now())+'-'+Math.random().toString(16).slice(2))});$('lostPropertyDialog').close();render();persist();status('Lost property record added to the shift log.')});
const type=$('entryType'),dyn=$('dynamicFields');
function fields(){const common=(id,label,placeholder='')=>`<label>${label}<input id="${id}" placeholder="${placeholder}"></label>`;let html='';switch(type.value){case'Defect':html=common('coach','Coach letter','e.g. A')+`<label>Defect category<select id="defectCategory"><option>Safety Critical</option><option>Non-Safety Critical</option><option>Service Critical</option></select></label>`;break;case'Passenger Counts':html=`<div class="dynamic-grid"><label>First Class<input id="firstCount" type="number" min="0" step="1" value="0"></label><label>Standard Class<input id="standardCount" type="number" min="0" step="1" value="0"></label></div>`+common('location','Location','Station / between stations')+`<label class="checkline"><input id="fullStanding" type="checkbox"> Full and standing</label>`;break;case'Delay':html=`<label>Delay (minutes)<input id="delayMinutes" type="number" min="0" step="1" value="0"></label>`;break;case'Assist':html=`<div class="dynamic-grid">${common('coach','Coach letter','e.g. B')}${common('seat','Seat number','e.g. 42')}</div>`;break;}
 dyn.innerHTML=html;
 const labels={'Incident':'Incident details','Control Message':'Control message','Reminder':'Reminder details','General Note':'General note','Update':'Update details','Defect':'Defect description','Passenger Counts':'Additional information','Delay':'Nature of delay','Assist':'Nature of assistance'};
 $('descriptionLabel').firstChild.textContent=labels[type.value]||'Information / description';
}
type.addEventListener('change',()=>{fields();if(type.value==='Incident'){pendingIncidentLogNumber='';$('incidentLogForm').reset();$('incidentLogNumberWrap').classList.add('hidden');$('incidentLogDialog').showModal();}});
$('addIssue').addEventListener('click',()=>{$('issueForm').reset();fields();$('issueDialog').querySelector('.dialoghead h2').textContent='Add log entry';$('entrySubmit').textContent='Add to log';$('issueDialog').showModal();$('description').focus()});
$('issueCancel').addEventListener('click',()=>$('issueDialog').close());$('issueClose').addEventListener('click',()=>$('issueDialog').close());
$('issueForm').addEventListener('submit',e=>{e.preventDefault();const t=type.value,desc=$('description').value.trim();if(!desc){$('description').focus();status('Please enter the entry details.');return}let prefix='';const val=id=>$(id)?.value??'';switch(t){case'Defect':prefix=`Coach ${val('coach')||'Not specified'} · ${val('defectCategory')}\n`;break;case'Passenger Counts':prefix=`First Class: ${val('firstCount')} · Standard Class: ${val('standardCount')} · Location: ${val('location')||'Not specified'} · Full and standing: ${$('fullStanding')?.checked?'Yes':'No'}\n`;break;case'Delay':prefix=`Delay: ${val('delayMinutes')} minutes\n`;break;case'Assist':prefix=`Coach ${val('coach')||'Not specified'} · Seat ${val('seat')||'Not specified'}\n`;break;}
 const id=crypto.randomUUID?crypto.randomUUID():String(Date.now())+'-'+Math.random().toString(16).slice(2);const entry={type:t,text:(t==='Incident'&&pendingIncidentLogNumber?`Log number: ${pendingIncidentLogNumber}\n`:'')+prefix+desc,timestamp:stamp(),id};
 if(t==='Incident'){entry.incidentNumber=state.entries.filter(x=>x.type==='Incident').length+1;entry.logNumber=pendingIncidentLogNumber;}
 state.entries.push(entry);pendingIncidentLogNumber='';$('issueDialog').close();$('issueDialog').querySelector('.dialoghead h2').textContent='Add log entry';$('entrySubmit').textContent='Add to log';render();persist();if(t==='Incident')status(`Incident ${entry.incidentNumber} added to the log.`);else status(`${t} added to the log.`)});
$('entries').addEventListener('click',e=>{const i=e.target.dataset.entry;if(i!==undefined){state.entries.splice(Number(i),1);render();persist()}});
$('trains').addEventListener('click',e=>{const i=e.target.dataset.train;if(i!==undefined){state.trains.splice(Number(i),1);render();persist()}});
function entryLabel(e){return e.type==='Incident'&&e.incidentNumber?`INCIDENT ${e.incidentNumber}`:e.type}
function report(){const s=snapshot();return `XC SHIFTAPP — OPERATIONAL SHIFT LOG\nDate: ${dateDMY(s.shift.date)}\nJob number: ${s.shift.jobNumber}\nShift notes:\n${s.shift.notes||'—'}\n\nTRAINS\n${s.trains.length?s.trains.map(t=>`${t.headcode} — Unit ${t.unit}${t.unit2?' + '+t.unit2:''}`).join('\n'):'None recorded'}\n\nCHRONOLOGICAL LOG\n${s.entries.length?s.entries.map(e=>`${fmt(e.timestamp)} | ${entryLabel(e)}\n${e.text}`).join('\n\n'):'No entries recorded'}\n\nGenerated by XC ShiftApp ${VERSION}`}
async function copyText(text){try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text)}else{fallbackCopy(text)}status('Shift log copied to clipboard.')}catch(err){try{fallbackCopy(text)}catch(e){status('Copy unavailable. Please use a secure browser connection.')}}}
function fallbackCopy(text){const el=document.createElement('textarea');el.value=text;el.setAttribute('readonly','');el.style.position='fixed';el.style.opacity='0';document.body.appendChild(el);el.select();const ok=document.execCommand('copy');el.remove();if(!ok)throw new Error('Clipboard copy failed')}
$('save').addEventListener('click',()=>persist());
$('copy').addEventListener('click',()=>copyText(report()));
function emailTables(){
 const s=snapshot(), escHtml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const table=(headers,rows)=>`<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:13px"><thead><tr>${headers.map(h=>`<th align="left" bgcolor="#A50034" style="color:#fff">${escHtml(h)}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map(row=>`<tr>${row.map(cell=>`<td>${escHtml(cell).replace(/\n/g,'<br>')}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${headers.length}">None recorded</td></tr>`}</tbody></table>`;
 const details=table(['Field','Value'],[['Date',dateDMY(s.shift.date)],['Job number',s.shift.jobNumber||'—'],['Shift notes',s.shift.notes||'—']]);
 const trains=table(['Headcode','Unit number(s)'],s.trains.map(t=>[t.headcode,`${t.unit}${t.unit2?' + '+t.unit2:''}`]));
 const logs=table(['Time / date','Entry type','Details'],s.entries.map(e=>[fmt(e.timestamp),entryLabel(e),e.text]));
 const html=`<div style="font-family:Arial,sans-serif;color:#241821"><h2 style="color:#A50034">Shift details</h2>${details}<h2 style="color:#A50034">Trains</h2>${trains}<h2 style="color:#A50034">Chronological log</h2>${logs}<p>Generated ${escHtml(new Date().toLocaleString('en-GB'))}</p></div>`;
 const plainTable=(headers,rows)=>[headers.join(' | '),headers.map(()=> '----------------').join(' | '),...(rows.length?rows.map(r=>r.join(' | ')):['None recorded'])].join('\n');
 const plain=[`SHIFT DETAILS\n${plainTable(['Field','Value'],[['Date',dateDMY(s.shift.date)],['Job number',s.shift.jobNumber||'—'],['Shift notes',s.shift.notes||'—']])}`,`TRAINS\n${plainTable(['Headcode','Unit number(s)'],s.trains.map(t=>[t.headcode,`${t.unit}${t.unit2?' + '+t.unit2:''}`]))}`,`CHRONOLOGICAL LOG\n${plainTable(['Time / date','Entry type','Details'],s.entries.map(e=>[fmt(e.timestamp),entryLabel(e),e.text]))}`,`Generated: ${new Date().toLocaleString('en-GB')}`].join('\n\n');
 return {html,plain,subject:`Shift Log – ${s.shift.jobNumber||'No job number'} – ${dateDMY(s.shift.date)}`};
}
$('email').addEventListener('click',async()=>{
 const {html,plain,subject}=emailTables();
 // Open the device's default email handler with readable table-formatted content.
 const mailto=`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plain)}`;
 try{
  if(navigator.clipboard&&window.isSecureContext&&window.ClipboardItem){
   const item=new ClipboardItem({'text/html':new Blob([html],{type:'text/html'}),'text/plain':new Blob([plain],{type:'text/plain'})});
   await navigator.clipboard.write([item]);
  }else{fallbackCopy(plain)}
  status('Tables copied. Opening your default email app…');
 }catch(err){try{fallbackCopy(plain);status('Text tables copied. Opening your default email app…')}catch(e){status('Could not copy tables; opening email with the text report.')}}
 window.location.href=mailto;
});
$('pdf').addEventListener('click',()=>{persist(true);openPrintPreview()});
$('clear').addEventListener('click',()=>{if(!confirm('Clear all shift details, trains and log entries? This cannot be undone.'))return;state.trains=[];state.entries=[];$('shiftDate').value=nowLocal();$('shiftJobNumber').value='';$('shiftNotes').value='';render();try{localStorage.removeItem(STORE);status('Shift cleared.')}catch(err){status('Shift cleared from screen, but saved data could not be removed.')}});
let deferredPrompt;$('installBtn')?.addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('installBtn').classList.add('hidden')});window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('installBtn')?.classList.remove('hidden')});
function dateDMY(value){if(!value)return '—';const m=String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?`${m[3]}/${m[2]}/${m[1]}`:value}
function openPrintPreview(){
 const s=snapshot(), generated=new Date(), generatedText=generated.toLocaleString('en-GB',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});
 const body=`<section><h2>Shift details</h2><p><b>Date:</b> ${esc(dateDMY(s.shift.date))} &nbsp; <b>Job number:</b> ${esc(s.shift.jobNumber||'—')}</p><p><b>Shift notes</b><br>${esc(s.shift.notes||'—').replace(/\n/g,'<br>')}</p></section><section><h2>Trains</h2>${s.trains.length?s.trains.map(t=>`<p><b>${esc(t.headcode)}</b> — Unit ${esc(t.unit)}${t.unit2?' + '+esc(t.unit2):''}</p>`).join(''):'<p>None recorded</p>'}</section><section><h2>Chronological log</h2>${s.entries.length?s.entries.map(e=>`<article><div class="entryhead">${esc(e.type)} <time>${esc(fmt(e.timestamp))}</time></div><p>${esc(e.text).replace(/\n/g,'<br>')}</p></article>`).join(''):'<p>No entries recorded</p>'}</section>`;
 const w=window.open('','_blank');if(!w){status('Print preview was blocked. Allow pop-ups for this app and try again.');return}
 w.document.open();w.document.write(`<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Shift log print preview</title><style>*{box-sizing:border-box}body{margin:0;background:#f2edf0;color:#241821;font:15px/1.5 system-ui,sans-serif}.toolbar{position:sticky;top:0;display:flex;gap:10px;justify-content:flex-end;padding:12px;background:#240713;color:white;border-bottom:3px solid #e50069}.toolbar button{border:0;border-radius:9px;padding:10px 16px;font-weight:800;cursor:pointer}.print{background:#e50069;color:#fff}.close{background:#fff;color:#a50034}.sheet{max-width:850px;margin:22px auto;padding:34px;background:#fff;box-shadow:0 4px 24px #0002;border-radius:12px}h2{font-size:18px;color:#a50034;margin:22px 0 8px}section{break-inside:avoid}article{border:1px solid #ddd;border-left:4px solid #e50069;border-radius:7px;padding:10px 13px;margin:10px 0;break-inside:avoid}.entryhead{font-weight:800;display:flex;justify-content:space-between;gap:12px}time{font-size:12px;color:#655b62;font-weight:500}article p{white-space:normal;margin:6px 0 0}.generated{margin-top:28px;color:#655b62;font-size:11px;text-align:right}@page{margin:16mm 14mm 20mm;@bottom-right{content:'Page ' counter(page) ' of ' counter(pages);font:10px system-ui;color:#655b62}}@media print{body{background:#fff}.toolbar{display:none}.sheet{margin:0;max-width:none;padding:0;box-shadow:none;border-radius:0}}</style></head><body><nav class="toolbar"><button class="close" type="button" onclick="window.close()">Close preview</button><button class="print" type="button" onclick="window.print()">Print / Save PDF</button></nav><main class="sheet">${body}<p class="generated">Generated: ${esc(generatedText)}</p></main></body></html>`);w.document.close();
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
