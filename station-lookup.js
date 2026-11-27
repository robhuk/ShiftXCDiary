(()=>{'use strict';
const $=id=>document.getElementById(id);
const dialog=$('stationLookupDialog');if(!dialog)return;
const search=$('stationLookupSearch'),results=$('stationLookupResults'),status=$('stationLookupStatus');
let stations=[],loaded=false;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const codeOf=x=>String(x.code||'').toUpperCase();
function mapUrl(x){const hasCoords=Number.isFinite(Number(x.lat))&&Number.isFinite(Number(x.lon));const q=hasCoords?`${x.lat},${x.lon}`:`${x.name} railway station UK`;return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);}
async function load(){
 if(loaded)return;
 try{
  const r=await fetch('./stations.json');if(!r.ok)throw Error('HTTP '+r.status);
  const data=await r.json();stations=Array.isArray(data)?data.filter(x=>x&&x.name&&x.code):[];
  loaded=true;status.textContent=`${stations.length.toLocaleString()} UK stations in the directory`;
  render();
 }catch(e){
  status.textContent='Station list unavailable';
  results.innerHTML='<div class="station-lookup-empty"><span class="station-lookup-empty-icon">🚉</span><strong>We couldn’t load the station list</strong><span>Check your connection, then close and reopen Station Lookup.</span></div>';
 }
}
function render(){
 if(!loaded)return;
 const q=search.value.trim().toLowerCase();
 if(!q){
  status.textContent=`${stations.length.toLocaleString()} UK stations in the directory`;
  results.innerHTML='<div class="station-lookup-empty"><span class="station-lookup-empty-icon">🔎</span><strong>Find a station</strong><span>Enter a station name or its three-letter CRS code. For example, <b>Newcastle</b> or <b>NCL</b>.</span></div>';
  return;
 }
 const matches=stations.map(x=>{
  const name=String(x.name).toLowerCase(),code=String(x.code).toLowerCase();
  let rank=99;
  if(code===q)rank=0;
  else if(name===q)rank=1;
  else if(code.startsWith(q))rank=2;
  else if(name.startsWith(q))rank=3;
  else if(name.split(/\s+/).some(word=>word.startsWith(q)))rank=4;
  else if(name.includes(q)||code.includes(q))rank=5;
  return {x,rank};
 }).filter(v=>v.rank<99).sort((a,b)=>a.rank-b.rank||String(a.x.name).localeCompare(String(b.x.name)));
 const total=matches.length,shown=matches.slice(0,60);
 status.textContent=total?`${total.toLocaleString()} result${total===1?'':'s'}${total>60?' · showing the first 60':''}`:'No matching stations';
 if(!total){
  results.innerHTML='<div class="station-lookup-empty"><span class="station-lookup-empty-icon">🚉</span><strong>No stations found</strong><span>Try another spelling or search using the station’s three-letter CRS code.</span></div>';
  return;
 }
 results.innerHTML=shown.map(({x})=>{
  const code=codeOf(x);
  return `<article class="station-lookup-card station-lookup-card-simple">
   <div class="station-lookup-card-top">
    <div class="station-lookup-result-main"><strong>${esc(x.name)}</strong></div>
    <span class="station-lookup-crs" aria-label="CRS code ${esc(code)}">${esc(code)}</span>
   </div>
  </article>`;
 }).join('');
}
function closeLookup(){
 // Use close(), not requestClose(): requestClose() dispatches a cancel event,
 // and this dialog's cancel handler also closes it. Calling requestClose()
 // from that handler can recurse indefinitely on supported browsers.
 try{if(dialog.open&&typeof dialog.close==='function')dialog.close();}catch(e){}
 // Fallback for browsers/webviews with incomplete <dialog> support.
 dialog.removeAttribute('open');
 hideLookupFocus();
}
function hideLookupFocus(){
 if(document.activeElement&&dialog.contains(document.activeElement))document.activeElement.blur();
}
function open(){
 dialog.style.removeProperty('display');
 if(!dialog.open){
  if(typeof dialog.showModal==='function'){
   try{dialog.showModal();}catch(e){dialog.setAttribute('open','');}
  }else dialog.setAttribute('open','');
 }
 load().then(()=>{render();try{search.focus({preventScroll:true});}catch(e){search.focus();}});
}
document.addEventListener('click',e=>{
 const b=e.target.closest('#openStationLookup,#stationLookupClose,#stationLookupClear');
 if(!b)return;
 if(b.id==='openStationLookup'){e.preventDefault();open();}
 else if(b.id==='stationLookupClose'){e.preventDefault();e.stopPropagation();closeLookup();}
 else if(b.id==='stationLookupClear'){e.preventDefault();e.stopPropagation();search.value='';render();search.focus();}
},true);
dialog.addEventListener('click',e=>{if(e.target===dialog)closeLookup();});
dialog.addEventListener('cancel',e=>{e.preventDefault();closeLookup();});
dialog.addEventListener('close',hideLookupFocus);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dialog.hasAttribute('open'))closeLookup();},true);
search.addEventListener('input',render);
// Directory cards are informational only. Keep taps inside the lookup and allow native vertical scrolling.
results.addEventListener('click',e=>{
 const card=e.target.closest('.station-lookup-card');
 if(card){e.preventDefault();e.stopPropagation();}
});
// Keep the Station Lookup launcher only in Shift Tools / Reference.
document.addEventListener('DOMContentLoaded',()=>{
 const canonical=document.querySelector('#shiftToolsReference #openStationLookup');
 document.querySelectorAll('#openStationLookup').forEach(button=>{
  if(button!==canonical)button.remove();
 });
});
load();
})();