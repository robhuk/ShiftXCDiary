(()=>{'use strict';
let activeDialog=null;
const $=id=>activeDialog?.querySelector('#'+id)||document.getElementById(id);
const pageDialog=mode=>document.getElementById(mode==='crossings'?'crossingsPageDialog':mode==='stations'?'stationsPageDialog':'accessPointsPageDialog');
if(!pageDialog('crossings')||!pageDialog('stations')||!pageDialog('nhd'))return;
let mode='crossings',crossings=[],stations=[],nhdRecords=[],position=null,accuracy=null,map=null,baseTileLayer=null,railwayOverlayLayers={},markers=[],resultMarkers=[],crossingStatusMarkers=[],mapReady=false,mapFramed=false,visibleItems=[];
const MAP_TYPE_KEY='shiftapp.locationMapType.v1';
const MAP_TYPES={
 street:{label:'Street',url:'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',options:{maxZoom:19,attribution:'&copy; OpenStreetMap contributors',subdomains:'abc'}},
 satellite:{label:'Satellite',url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',options:{maxZoom:19,attribution:'Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'}},
 terrain:{label:'Terrain',url:'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',options:{maxZoom:17,attribution:'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap',subdomains:'abc'}}
};
function selectedMapType(){try{const saved=localStorage.getItem(MAP_TYPE_KEY);return Object.prototype.hasOwnProperty.call(MAP_TYPES,saved)?saved:'street';}catch{return 'street';}}
function setMapType(type){if(!map||!Object.prototype.hasOwnProperty.call(MAP_TYPES,type))return;const centre=map.getCenter(),zoom=map.getZoom();if(baseTileLayer)map.removeLayer(baseTileLayer);const cfg=MAP_TYPES[type];baseTileLayer=L.tileLayer(cfg.url,cfg.options).addTo(map);map.setView(centre,zoom,{animate:false});try{localStorage.setItem(MAP_TYPE_KEY,type);}catch{} }
function addMapTypeControl(){if(!map||!activeDialog)return;const select=activeDialog.querySelector('#aroundMapType');if(!select)return;select.replaceChildren();Object.entries(MAP_TYPES).forEach(([value,cfg])=>{const option=document.createElement('option');option.value=value;option.textContent=cfg.label;select.append(option);});select.value=selectedMapType();select.onchange=()=>setMapType(select.value);}

// OpenRailwayMap is an optional transparent overlay. Tiles are requested only
// when the user enables a layer; selections are remembered across all three maps.
const RAILWAY_OVERLAY_KEY='shiftapp.openRailwayMap.overlays.v1';
const CROSSING_STATUS_LAYER_KEY='shiftapp.crossingStatusLayer.enabled.v1';
let crossingStatusLayerEnabled=(()=>{try{return localStorage.getItem(CROSSING_STATUS_LAYER_KEY)==='true';}catch{return false;}})();
const RAILWAY_OVERLAYS={
 infrastructure:{label:'Infrastructure',style:'standard'},
 maxspeed:{label:'Maximum speeds',style:'maxspeed'},
};
function selectedRailwayOverlays(){try{const saved=JSON.parse(localStorage.getItem(RAILWAY_OVERLAY_KEY)||'[]');return Array.isArray(saved)?saved.filter(key=>Object.prototype.hasOwnProperty.call(RAILWAY_OVERLAYS,key)):[];}catch{return[];}}
function saveRailwayOverlaySelection(){try{localStorage.setItem(RAILWAY_OVERLAY_KEY,JSON.stringify(Object.keys(railwayOverlayLayers).filter(key=>railwayOverlayLayers[key]&&map?.hasLayer(railwayOverlayLayers[key]))));}catch{}}
function setRailwayOverlay(key,enabled){if(!map||!Object.prototype.hasOwnProperty.call(RAILWAY_OVERLAYS,key))return;const existing=railwayOverlayLayers[key];if(enabled&&!existing){const cfg=RAILWAY_OVERLAYS[key];const layer=L.tileLayer(`https://tiles.openrailwaymap.org/${cfg.style}/{z}/{x}/{y}.png`,{minZoom:2,maxZoom:19,maxNativeZoom:19,opacity:0.86,attribution:'Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, Style: <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA 2.0</a> <a href="https://www.openrailwaymap.org/">OpenRailwayMap</a>'});railwayOverlayLayers[key]=layer;layer.addTo(map);}else if(!enabled&&existing){map.removeLayer(existing);delete railwayOverlayLayers[key];}saveRailwayOverlaySelection();}
function addRailwayOverlayControl(){if(!map||!activeDialog)return;const list=activeDialog.querySelector('#aroundRailwayOptions');if(!list)return;list.replaceChildren();const selected=selectedRailwayOverlays();Object.entries(RAILWAY_OVERLAYS).forEach(([key,cfg])=>{const label=document.createElement('label');label.className='railway-overlay-option';const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.value=key;checkbox.checked=selected.includes(key);const text=document.createElement('span');text.textContent=cfg.label;label.append(checkbox,text);checkbox.addEventListener('change',()=>setRailwayOverlay(key,checkbox.checked));list.append(label);});if(mode==='crossings'){const label=document.createElement('label');label.className='railway-overlay-option crossing-status-option';const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.id='aroundCrossingStatusLayer';checkbox.checked=crossingStatusLayerEnabled;const text=document.createElement('span');text.textContent='🚦 Crossing status';label.append(checkbox,text);checkbox.addEventListener('change',()=>setCrossingStatusLayer(checkbox.checked));list.append(label);const legend=document.createElement('small');legend.className='railway-overlay-note crossing-status-layer-legend';legend.innerHTML='<i class="open-dot"></i> Green: open &nbsp; <i class="closed-dot"></i> Red: closed &nbsp; <i class="unknown-dot"></i> Grey: unknown';list.append(legend);}const note=document.createElement('small');note.className='railway-overlay-note';note.textContent='OpenRailwayMap community-mapped data; may be incomplete and is not an operational safety source.';list.append(note);}
function applySavedRailwayOverlays(){selectedRailwayOverlays().forEach(key=>setRailwayOverlay(key,true));}
function setCrossingStatusLayer(enabled){crossingStatusLayerEnabled=!!enabled;try{localStorage.setItem(CROSSING_STATUS_LAYER_KEY,String(crossingStatusLayerEnabled));}catch{};updateCrossingStatusMarkers();}
function updateCrossingStatusMarkers(){if(!map)return;drawMap(visibleItems);}
function liveStatusForMapItem(item){if(mode!=='crossings'||!Array.isArray(liveCrossingRows))return 'unknown';let match=liveCrossingRows.find(row=>row.uid&&item.uid&&String(row.uid)===String(item.uid));if(!match){let nearest=null,best=Infinity;for(const row of liveCrossingRows){const lat=Number(row.lat),lon=Number(row.lon);if(!Number.isFinite(lat)||!Number.isFinite(lon))continue;const distance=hav(Number(item.lat),Number(item.lon),lat,lon);if(distance<best){best=distance;nearest=row;}}if(best<=120)match=nearest;}return match?liveStatusLabel(match.liveStatus?.status||match.liveStatus):'unknown';}

const NHD_BASE='https://raw.githubusercontent.com/infrastructureclub/nr-national-hazard-directory/main/data/';
const NHD_REGIONS=[['QE','East Coast'],['QF','North and East'],['QL','Scotland'],['QM','East Midlands'],['QR','London North West North'],['QS','London North West South'],['QT','Anglia'],['QK','Kent'],['QU','Sussex'],['QC','Wales'],['QW','Wessex'],['QD','Western']];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const UNIT_KEY='shiftapp.mappingDistanceUnit';
const getDistanceUnit=()=>localStorage.getItem(UNIT_KEY)==='km'?'km':'mi';
const fmt=d=>getDistanceUnit()==='mi'?(d/1609.344).toFixed(2)+' mi':d<1000?Math.round(d)+' m':(d/1000).toFixed(2)+' km';
function updateRadiusLabels(){const unit=getDistanceUnit(),plural=unit==='mi'?'mile':'km';document.querySelectorAll('#aroundRadius').forEach(sel=>{[...sel.options].forEach(o=>{if(o.value==='all')o.textContent='All distances';else o.textContent=`${o.value} ${Number(o.value)===1?plural:(unit==='mi'?'miles':'km')}`;});});}
const hav=(a,b,c,d)=>{const R=6371000,p=Math.PI/180,dp=(c-a)*p,dl=(d-b)*p,x=Math.sin(dp/2)**2+Math.cos(a*p)*Math.cos(c*p)*Math.sin(dl/2)**2;return 2*R*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));};
const bngToWgs84=(E,N)=>{
 const a=6377563.396,b=6356256.909,F0=.9996012717,lat0=49*Math.PI/180,lon0=-2*Math.PI/180,N0=-100000,E0=400000,e2=1-(b*b)/(a*a),n=(a-b)/(a+b),n2=n*n,n3=n2*n;
 let lat=lat0,M=0;do{lat=(N-N0-M)/(a*F0)+lat;const d=lat-lat0;M=b*F0*((1+n+5/4*n2+5/4*n3)*d-(3*n+3*n2+21/8*n3)*Math.sin(d)*Math.cos(lat+lat0)+(15/8*n2+15/8*n3)*Math.sin(2*d)*Math.cos(2*(lat+lat0))-(35/24*n3)*Math.sin(3*d)*Math.cos(3*(lat+lat0)));}while(Math.abs(N-N0-M)>=0.00001);
 const sin=Math.sin(lat),cos=Math.cos(lat),tan=Math.tan(lat),nu=a*F0/Math.sqrt(1-e2*sin*sin),rho=a*F0*(1-e2)/Math.pow(1-e2*sin*sin,1.5),eta2=nu/rho-1;
 const VII=tan/(2*rho*nu),VIII=tan/(24*rho*Math.pow(nu,3))*(5+3*tan*tan+eta2-9*tan*tan*eta2),IX=tan/(720*rho*Math.pow(nu,5))*(61+90*tan*tan+45*Math.pow(tan,4));
 const X=1/(cos*nu),XI=1/(6*cos*Math.pow(nu,3))*(nu/rho+2*tan*tan),XII=1/(120*cos*Math.pow(nu,5))*(5+28*tan*tan+24*Math.pow(tan,4)),XIIA=1/(5040*cos*Math.pow(nu,7))*(61+662*tan*tan+1320*Math.pow(tan,4)+720*Math.pow(tan,6));
 const dE=E-E0,latO=lat-VII*dE*dE+VIII*Math.pow(dE,4)-IX*Math.pow(dE,6),lonO=lon0+X*dE-XI*Math.pow(dE,3)+XII*Math.pow(dE,5)-XIIA*Math.pow(dE,7);
 const H=6377563.396,hb=6356256.909,ee=1-hb*hb/(H*H),sl=Math.sin(latO),cl=Math.cos(latO),so=Math.sin(lonO),co=Math.cos(lonO),v=H/Math.sqrt(1-ee*sl*sl),x=v*cl*co,y=v*cl*so,z=v*(1-ee)*sl;
 const sec=Math.PI/(180*3600),tx=446.448,ty=-125.157,tz=542.060,rx=.1502*sec,ry=.2470*sec,rz=.8421*sec,s=-20.4894e-6;
 const x2=tx+(1+s)*x-rz*y+ry*z,y2=ty+rz*x+(1+s)*y-rx*z,z2=tz-ry*x+rx*y+(1+s)*z;
 const wa=6378137,wb=6356752.3141,we=1-wb*wb/(wa*wa),p=Math.sqrt(x2*x2+y2*y2);let latW=Math.atan2(z2,p*(1-we));for(let j=0;j<8;j++){const vv=wa/Math.sqrt(1-we*Math.sin(latW)**2);latW=Math.atan2(z2+we*vv*Math.sin(latW),p);}
 return {lat:latW*180/Math.PI,lon:Math.atan2(y2,x2)*180/Math.PI};
};
function parseCSV(text){const rows=[];let row=[],field='',quoted=false;for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(quoted){if(c==='"'&&n==='"'){field+='"';i++;}else if(c==='"')quoted=false;else field+=c;}else if(c==='"')quoted=true;else if(c===','){row.push(field);field='';}else if(c==='\n'){row.push(field);rows.push(row);row=[];field='';}else if(c!=='\r')field+=c;}if(field.length||row.length){row.push(field);rows.push(row);}return rows;}
function mapNhdRows(rows,code){if(!rows.length)return[];const header=rows[0].map(x=>x.trim().toLowerCase()),idx=k=>{const i=header.indexOf(k);return i>=0?i:null;};const col={id:idx('hazard id'),elr:idx('elr'),mile:idx('start mileage'),item:idx('item code'),east:idx('easting'),north:idx('northing'),name:idx('local name'),updated:idx('last updated')},out=[];for(let i=1;i<rows.length;i++){const r=rows[i],get=k=>col[k]===null?'':(r[col[k]]||'').trim(),E=Number(get('east')),N=Number(get('north'));if(!Number.isFinite(E)||!Number.isFinite(N)||E<0||E>700000||N<0||N>1300000)continue;const ll=bngToWgs84(E,N);if(!Number.isFinite(ll.lat)||!Number.isFinite(ll.lon))continue;out.push({id:get('id'),elr:get('elr'),mileage:get('mile'),itemCode:get('item'),name:get('name')||'Unnamed access point',lat:ll.lat,lon:ll.lon,updated:get('updated'),region:code});}return out;}
function openNhdDb(){return new Promise((resolve,reject)=>{const req=indexedDB.open('shift-diary-around-me-nhd',1);req.onupgradeneeded=()=>req.result.createObjectStore('regions',{keyPath:'code'});req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
async function getNhdCache(code){try{const db=await openNhdDb();return await new Promise((res,rej)=>{const r=db.transaction('regions').objectStore('regions').get(code);r.onsuccess=()=>res(r.result||null);r.onerror=()=>rej(r.error);});}catch{return null;}}
async function putNhdCache(code,records){const db=await openNhdDb();return new Promise((res,rej)=>{const tx=db.transaction('regions','readwrite');tx.objectStore('regions').put({code,records,savedAt:new Date().toISOString()});tx.oncomplete=()=>res(true);tx.onerror=()=>rej(tx.error);});}
async function loadCachedAllNhd(){
 const loaded=[];
 for(const [code] of NHD_REGIONS){
  const cached=await getNhdCache(code);
  if(cached?.records?.length)loaded.push(...cached.records);
 }
 nhdRecords=loaded;
 $('aroundNhdStatus').textContent=loaded.length
  ? `${loaded.length.toLocaleString()} access point records from all saved UK regions are available${navigator.onLine?'':' offline'}. Use Update all to refresh the data.`
  : 'No access point data is saved yet. Tap Update all to download every UK region.';
 render();
}
async function loadAllNhd(){
 if(!confirm('Update access point data for all UK regions? This may use substantial mobile data and storage.'))return;
 const button=$('aroundNhdLoadAll');if(button){button.disabled=true;button.textContent='⏳ Updating all UK regions…';}
 let ok=0,failed=[];const merged=[];
 try{
  for(const [code,name] of NHD_REGIONS){
   $('aroundNhdStatus').textContent=`Updating ${name} (${code})…`;
   try{
    const response=await fetch(NHD_BASE+code+'/coreData.csv',{cache:'no-store'});
    if(!response.ok)throw Error('Source returned '+response.status);
    const records=mapNhdRows(parseCSV(await response.text()),code);
    if(!records.length)throw Error('No usable coordinate records were found.');
    await putNhdCache(code,records);merged.push(...records);ok++;
   }catch(error){
    const cached=await getNhdCache(code);
    if(cached?.records?.length){merged.push(...cached.records);failed.push(`${code} (using saved data)`);}
    else failed.push(code);
   }
  }
  nhdRecords=merged;
  $('aroundNhdStatus').textContent=`${ok} of ${NHD_REGIONS.length} regions updated${failed.length?'; unavailable or using saved data: '+failed.join(', '):''}. ${nhdRecords.length.toLocaleString()} access point records from across the UK are loaded.`;
  render();
 }finally{
  if(button){button.disabled=false;button.textContent='🔄 Update all access point data (UK)';}
 }
}
let baseDataPromise=null;
async function loadBaseData(){
 if(crossings.length&&stations.length){render();return true;}
 if(baseDataPromise)return baseDataPromise;
 baseDataPromise=(async()=>{
  try{
   const [crossingData,stationData]=await Promise.all([
    fetch('./crossings.json').then(r=>{if(!r.ok)throw Error(`Crossing data HTTP ${r.status}`);return r.json()}),
    fetch('./stations.json').then(r=>{if(!r.ok)throw Error(`Station data HTTP ${r.status}`);return r.json()})
   ]);
   if(!Array.isArray(crossingData)||!Array.isArray(stationData))throw Error('The location databases have an invalid format.');
   crossings=crossingData;stations=stationData;
   if(activeDialog?.open)render();
   return true;
  }catch(error){
   console.warn('Location reference data could not be loaded:',error);
   const results=$('aroundResults');
   if(results)results.innerHTML='<div class="empty">The crossing and station lists could not be loaded. Check your connection, then close and reopen this finder.</div>';
   const count=$('aroundResultCount');if(count)count.textContent='Reference data unavailable';
   return false;
  }finally{baseDataPromise=null;}
 })();
 return baseDataPromise;
}
function currentData(){return mode==='crossings'?crossings:mode==='stations'?stations:nhdRecords;}
function deviceMapsLink(x){const lat=Number(x.lat),lon=Number(x.lon),hasCoords=Number.isFinite(lat)&&Number.isFinite(lon),label=encodeURIComponent(x.name||'Railway location');if(!hasCoords)return `https://www.google.com/maps/search/?api=1&query=${label}`;const coords=`${lat},${lon}`,ua=navigator.userAgent||'',ios=/iPhone|iPad|iPod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);return ios?`maps://?daddr=${coords}&q=${label}`:`geo:${coords}?q=${coords}(${label})`;}
function render(){if(!activeDialog?.open)return;const q=$('aroundSearch').value.trim().toLowerCase(),rad=$('aroundRadius').value,lim=Number($('aroundLimit').value);let arr=currentData().map(x=>({...x,d:position?hav(position.lat,position.lon,x.lat,x.lon):null}));arr=arr.filter(x=>{const hay=mode==='crossings'?[x.name,x.uid,x.elr,x.type,x.route,x.region].join(' '):mode==='stations'?[x.name,x.code].join(' '):[x.name,x.id,x.elr,x.itemCode,x.mileage,x.region].join(' ');return !q||hay.toLowerCase().includes(q)});if(position){arr.sort((a,b)=>a.d-b.d);if(rad!=='all')arr=arr.filter(x=>x.d<=Number(rad)*(getDistanceUnit()==='mi'?1609.344:1000));}arr=arr.slice(0,lim);visibleItems=arr;$('aroundResultHeading').textContent=mode==='crossings'?'Nearest level crossings':mode==='stations'?'Nearest railway stations':'Nearest access points';$('aroundResultCount').textContent=position?`${arr.length} shown`:mode==='nhd'?`${nhdRecords.length.toLocaleString()} access point records loaded · GPS needed`:'GPS needed for distance sorting';if(!arr.length){$('aroundResults').innerHTML=`<div class="empty">${mode==='nhd'&&!nhdRecords.length?'No access point data loaded. Use Update all at the bottom of this page to download all UK regions.':'No matching records in this search radius.'}</div>`;drawMap([]);return;}$('aroundResults').innerHTML=arr.map(x=>{let detail='',emoji=mode==='crossings'?'🚧':mode==='stations'?'🚉':'📍';if(mode==='crossings')detail=`UID ${esc(x.uid)} · ${esc(x.type||'Type unknown')} · ${esc(x.status||'Status unknown')}<br>ELR ${esc(x.elr||'—')} · ${esc(x.route||'—')} · Risk ${esc(x.risk||'—')}`;else if(mode==='stations')detail=`CRS ${esc(x.code||'—')}`;else detail=`Hazard ID ${esc(x.id||'—')} · ELR ${esc(x.elr||'—')} · Mileage ${esc(x.mileage||'—')}<br>Item ${esc(x.itemCode||'—')} · Region ${esc(x.region)}<br>Last updated ${esc(x.updated||'Not supplied')}`;const mapAction=`<div class="around-result-links"><a class="open-device-maps" href="${deviceMapsLink(x)}">📍 Open in Maps</a></div>`;return `<article class="around-result" data-map-index="${visibleItems.indexOf(x)}" role="group" tabindex="0" aria-label="${mode==='nhd'?'Access point':'Show '+esc(x.name)+' on map'}"><div class="around-result-icon">${emoji}</div><div class="around-result-main"><strong>${esc(x.name)}</strong><div class="around-result-meta">${detail}</div>${mapAction}</div><div class="around-distance">${x.d===null?'—':fmt(x.d)}</div></article>`;}).join('');drawMap(arr);}
const MIND_THE_GATES_API='https://mindthegates.uk/api/v1';
let liveRequestId=0,liveCrossingRows=[],liveDetails={};
function liveTime(value){if(!value)return 'Time unavailable';const date=new Date(value);if(Number.isNaN(date.getTime()))return String(value);return '~'+new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit',hour12:false}).format(date);}
function liveStatusLabel(status){const state=typeof status==='string'?status:status?.state;return ['open','closed','unknown'].includes(String(state||'').toLowerCase())?String(state).toLowerCase():'unknown';}
function statusRowsFromPayload(payload,slugs){const source=payload?.crossings||payload?.statuses||payload?.results||payload?.items||payload?.status||payload;const out={};if(Array.isArray(source)){source.forEach(row=>{const slug=row?.slug||row?.crossing?.slug;if(slug)out[slug]=row;});}else if(source&&typeof source==='object'){slugs.forEach(slug=>{if(source[slug])out[slug]=source[slug];});}return out;}
function nearRowsFromPayload(payload){if(Array.isArray(payload))return payload;for(const key of ['crossings','results','items','nearby','data'])if(Array.isArray(payload?.[key]))return payload[key];return [];}
function renderLiveCrossings(){const target=$('aroundLiveResults');if(!target)return;if(!liveCrossingRows.length){target.innerHTML='<div class="empty">No live crossing results are available yet.</div>';return;}target.innerHTML=liveCrossingRows.map(row=>{const status=liveStatusLabel(row.liveStatus?.status||row.liveStatus),confirmed=!!(row.liveStatus?.status?.confirmed??row.liveStatus?.confirmed),next=row.liveStatus?.next_closure||row.liveStatus?.status?.next_closure||null,until=row.liveStatus?.status?.until||row.liveStatus?.until||next?.end||null;const stateText=status==='open'?'OPEN':status==='closed'?'CLOSED':'UNKNOWN';let meta=confirmed?'Confirmed by railway signalling/monitor data.':'Forecast status — not confirmed by signalling.';if(until)meta+=` Expected to change ~${liveTime(until).replace(/^~/,'')}.`;if(next?.start)meta+=` Next closure ~${liveTime(next.start).replace(/^~/,'')}${next.end?' to ~'+liveTime(next.end).replace(/^~/,''):''}.`;const detail=liveDetails[row.slug];let detailHtml='';if(detail){const timeline=Array.isArray(detail.timeline)?detail.timeline:[],trains=Array.isArray(detail.trains)?detail.trains:[];detailHtml=`<div class="live-crossing-details"><strong>Forecast timeline</strong>${timeline.length?'<ul>'+timeline.map(t=>`<li>${esc(String(t.state||'unknown').toUpperCase())}: ${esc(liveTime(t.start))} – ${esc(liveTime(t.end))}${t.conditional?' · Conditional':''}${t.parked?' · Train standing on approach':''}${t.marginal?' · May already be starting':''}</li>`).join('')+'</ul>':'<p>No timeline supplied.</p>'}<strong>Trains associated with this crossing</strong>${trains.length?'<ul>'+trains.map(t=>`<li><strong>${esc(t.headcode||'Train')}</strong> · ${esc(t.origin||'Origin unavailable')} → ${esc(t.destination||'Destination unavailable')} · ${esc(t.direction||'Direction unavailable')} · ${t.cancelled?'Cancelled':(Number.isFinite(Number(t.delay_sec))?`${Math.round(Number(t.delay_sec)/60)} min delay`:t.live?'Live':'Timetable')} · ${esc(liveTime(t.at))}</li>`).join('')+'</ul>':'<p>No approaching trains listed in this forecast.</p>'}${detail.meta?.known_coverage_gap?`<p><strong>Coverage note:</strong> ${esc(detail.meta.known_coverage_gap)}</p>`:''}</div>`;}return `<article class="live-crossing-card"><div class="live-crossing-card-head"><strong>${esc(row.name)}</strong><span class="live-crossing-state ${status}">${stateText}</span></div><div class="live-crossing-meta">${esc(row.type||'Crossing type not supplied')}${row.region?' · '+esc(row.region):''}<br>${esc(meta)}</div><div class="live-crossing-actions"><button type="button" data-live-detail="${esc(row.slug)}">${detail?'Hide details':'Forecast & approaching trains'}</button></div>${detail?detailHtml:''}</article>`;}).join('');}
async function refreshLiveCrossings(){const target=$('aroundLiveResults'),updated=$('aroundLiveUpdated');if(mode!=='crossings'||!activeDialog?.open)return;if(!position){if(target)target.innerHTML='<div class="empty">Acquire your GPS location to load live crossing information.</div>';if(updated)updated.textContent='Waiting for GPS location';return;}const requestId=++liveRequestId;if(target)target.innerHTML='<div class="empty">Loading nearby crossings and live forecasts…</div>';if(updated)updated.textContent='Contacting Mind the Gates';liveDetails={};try{const url=`${MIND_THE_GATES_API}/near?lat=${encodeURIComponent(position.lat)}&lon=${encodeURIComponent(position.lon)}&limit=10`;const nearResponse=await fetch(url,{headers:{Accept:'application/json'}});if(!nearResponse.ok)throw Error(`Nearby crossing service returned HTTP ${nearResponse.status}`);const nearPayload=await nearResponse.json();const rows=nearRowsFromPayload(nearPayload).filter(x=>x&&x.slug);if(requestId!==liveRequestId||mode!=='crossings'||!activeDialog?.open)return;if(!rows.length){liveCrossingRows=[];updateCrossingStatusMarkers();if(target)target.innerHTML='<div class="empty">Mind the Gates did not return any nearby crossings for this location.</div>';if(updated)updated.textContent='No nearby results';return;}const slugs=rows.map(x=>x.slug);let statusMap={};try{const statusUrl=`${MIND_THE_GATES_API}/status?crossings=${encodeURIComponent(slugs.join(','))}`;const statusResponse=await fetch(statusUrl,{headers:{Accept:'application/json'}});if(statusResponse.ok)statusMap=statusRowsFromPayload(await statusResponse.json(),slugs);}catch(err){console.warn('Mind the Gates batch status unavailable:',err);}if(requestId!==liveRequestId||mode!=='crossings'||!activeDialog?.open)return;liveCrossingRows=rows.map(row=>({...row,liveStatus:statusMap[row.slug]||null}));renderLiveCrossings();updateCrossingStatusMarkers();if(updated)updated.textContent=`Updated ${new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())} · ${rows.length} nearby`; }catch(err){console.warn('Mind the Gates live crossing lookup failed:',err);if(requestId!==liveRequestId)return;if(target)target.innerHTML='<div class="empty">Live crossing information is temporarily unavailable. Check your connection or try Refresh again.</div>';if(updated)updated.textContent='Live data unavailable';}}
async function loadLiveCrossingDetail(slug){const row=liveCrossingRows.find(x=>x.slug===slug);if(!row)return;if(liveDetails[slug]){delete liveDetails[slug];renderLiveCrossings();return;}try{const response=await fetch(`${MIND_THE_GATES_API}/crossing/${encodeURIComponent(slug)}?horizon=30`,{headers:{Accept:'application/json'}});if(!response.ok)throw Error(`Crossing detail HTTP ${response.status}`);const data=await response.json();liveDetails[slug]=data;renderLiveCrossings();}catch(err){console.warn('Mind the Gates crossing detail unavailable:',err);const target=$('aroundLiveResults');if(target){const card=[...target.querySelectorAll('[data-live-detail]')].find(b=>b.dataset.liveDetail===slug)?.closest('.live-crossing-card');if(card){let msg=card.querySelector('.live-crossing-error');if(!msg){msg=document.createElement('p');msg.className='live-crossing-error live-crossing-meta';card.append(msg);}msg.textContent='Could not load the detailed forecast. Please try again.';}}}}
$('aroundLiveResults')?.addEventListener('click',e=>{const button=e.target.closest('[data-live-detail]');if(button){e.preventDefault();loadLiveCrossingDetail(button.dataset.liveDetail);}});
$('aroundLiveRefresh')?.addEventListener('click',refreshLiveCrossings);
let locating=false;
function locate(){
 const dialog=activeDialog;
 if(!dialog?.open)return;
 if(!navigator.geolocation){$('aroundGpsStatus').textContent='GPS is not supported by this browser.';return;}
 if(locating)return;
 locating=true;
 $('aroundGpsStatus').textContent='Requesting GPS location…';
 navigator.geolocation.getCurrentPosition(p=>{
  locating=false;
  if(activeDialog!==dialog||!dialog.open)return;
  position={lat:p.coords.latitude,lon:p.coords.longitude};accuracy=p.coords.accuracy;
  $('aroundGpsTitle').textContent='Location acquired';
  $('aroundGpsStatus').textContent=`Accuracy approximately ${Math.round(accuracy)} m`;
  render();
  if(map){map.invalidateSize();drawMap();}
  if(mode==='crossings')refreshLiveCrossings();
 },e=>{
  locating=false;
  if(activeDialog!==dialog||!dialog.open)return;
  $('aroundGpsStatus').textContent=({1:'Location permission denied. Enable it in browser settings.',2:'Current location unavailable. Try again outdoors.',3:'GPS request timed out. Try again.'}[e.code]||'Could not obtain GPS location');
 },{enableHighAccuracy:true,timeout:20000,maximumAge:30000});
}
function numberedPin(number,status='default'){const colour=status==='open'?'#159447':status==='closed'?'#d71920':status==='unknown'?'#777777':'#A50034';return L.divIcon({className:'',html:`<div style="width:34px;height:34px;background:${colour};border:2px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 7px rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center"><span style="transform:rotate(45deg);color:#fff;font-size:14px;font-weight:900;line-height:1;text-shadow:0 1px 1px #0005">${number}</span></div>`,iconSize:[38,38],iconAnchor:[19,34],popupAnchor:[0,-31]});}
function mapPopup(x,number){if(mode==='crossings')return `<strong>${number}. ${esc(x.name)}</strong><br>UID ${esc(x.uid||'—')} · ${esc(x.type||'Type unknown')}<br>ELR ${esc(x.elr||'—')} · ${esc(x.route||'—')}`;if(mode==='stations')return `<strong>${number}. ${esc(x.name)}</strong><br>CRS ${esc(x.code||'—')}`;return `<strong>${number}. ${esc(x.name)}</strong><br>Hazard ID ${esc(x.id||'—')} · ELR ${esc(x.elr||'—')} · Mileage ${esc(x.mileage||'—')}`;}
function drawMap(items=visibleItems){
 if(!map)return;
 visibleItems=Array.isArray(items)?items:visibleItems;
 markers.forEach(m=>map.removeLayer(m));markers=[];resultMarkers=[];
 if(position)markers.push(L.circleMarker([position.lat,position.lon],{radius:8,color:'#1769aa',fillColor:'#42a5f5',fillOpacity:1}).addTo(map).bindPopup('Your GPS location'));
 (visibleItems||[]).forEach((x,index)=>{
  const number=index+1,status=mode==='crossings'&&crossingStatusLayerEnabled?liveStatusForMapItem(x):'default',marker=L.marker([x.lat,x.lon],{icon:numberedPin(number,status)}).bindPopup(mapPopup(x,number)+(mode==='crossings'&&crossingStatusLayerEnabled?`<br><strong>Live crossing status: ${status.toUpperCase()}</strong>`:''));
  resultMarkers[index]=marker;markers.push(marker.addTo(map));
 });
 const centre=position?[position.lat,position.lon]:(visibleItems.length?[visibleItems[0].lat,visibleItems[0].lon]:null);
 if(centre){
  if(!mapFramed){map.setView(centre,12.5,{animate:false});mapFramed=true;}
  else map.panTo(centre,{animate:false});
 }
}
function initMap(){if(!window.L||mapReady)return;try{map=L.map(activeDialog?.querySelector('#aroundMap'),{zoomControl:false,scrollWheelZoom:false,wheelPxPerZoomLevel:120,doubleClickZoom:false,boxZoom:false,keyboard:false,dragging:true,touchZoom:false,tap:true,zoomSnap:0.5,zoomDelta:0.5}).setView([54.5,-2.5],5.5);setMapType(selectedMapType());addMapTypeControl();addRailwayOverlayControl();applySavedRailwayOverlays();mapReady=true;drawMap();updateCrossingStatusMarkers();}catch(err){console.warn('Around me map unavailable:',err);$('aroundResultCount').textContent='Map unavailable; list results are still available.';}}
function setMode(next){mode=next;$('aroundSearch').placeholder=mode==='crossings'?'Search crossing name, UID or ELR…':mode==='stations'?'Search station name or CRS code…':'Search access point name, ID, ELR or item code…';render();}
function setMapFullscreen(enabled){if(!activeDialog)return;const shell=activeDialog.querySelector('.around-map-shell');if(!shell)return;shell.classList.toggle('is-fullscreen',!!enabled);const close=shell.querySelector('.around-map-fullscreen-close');if(close)close.hidden=!enabled;const open=activeDialog.querySelector('.map-fullscreen-open');if(open)open.hidden=!!enabled;document.body.classList.toggle('map-fullscreen-active',!!enabled);setTimeout(()=>{try{map?.invalidateSize();}catch(e){}},100);}
function openAround(selectedMode){
  try{
    updateRadiusLabels();
    mode=selectedMode;
    activeDialog=pageDialog(selectedMode);
    if(!activeDialog.open){
      try{if(typeof activeDialog.showModal==='function')activeDialog.showModal();else activeDialog.setAttribute('open','');}
      catch(openError){activeDialog.setAttribute('open','');}
    }
    activeDialog.style.display='block';
    setMode(selectedMode);
    // Show a fixed-zoom reference map that can be panned by dragging for access points, crossings and stations.
    const mapPanel=activeDialog.querySelector('#aroundMap');if(mapPanel)mapPanel.style.display='';
    // Each dedicated page owns its own map element; recreate Leaflet when changing pages.
    if(map){try{map.remove();}catch(e){}}
    map=null;baseTileLayer=null;railwayOverlayLayers={};mapReady=false;mapFramed=false;markers=[];resultMarkers=[];crossingStatusMarkers=[];visibleItems=[];
    initMap();
    if(selectedMode==='nhd'){
      loadCachedAllNhd();
    }else{
      // Load the bundled reference datasets before presenting results. Re-render
      // only if this page is still the active, open dialog when the fetch completes.
      loadBaseData().then(()=>{
        if(activeDialog===pageDialog(selectedMode)&&activeDialog?.open)render();
      });
    }
    render();
    setTimeout(()=>{try{if(map)map.invalidateSize();}catch(e){}},150);
    locate();
  }catch(err){console.error('Could not open location page:',err);const status=$('aroundGpsStatus');if(status)status.textContent='Could not open this page. Please close and try again.';}
}
// Bind each launcher directly. This avoids missed delegated clicks in installed mobile PWAs.
function bindClick(el,fn){
 if(!el)return;
 el.addEventListener('click',e=>{
  e.preventDefault();
  try{
   const result=fn(e);
   if(result&&typeof result.catch==='function')result.catch(error=>{
    console.error('Location tool action failed:',error);
    const status=$('aroundGpsStatus');if(status)status.textContent='That action could not be completed. Please try again.';
   });
  }catch(error){
   console.error('Location tool action failed:',error);
   const status=$('aroundGpsStatus');if(status)status.textContent='That action could not be completed. Please try again.';
  }
 });
}
bindClick(document.getElementById('openCrossings'),()=>openAround('crossings'));
bindClick(document.getElementById('openStations'),()=>openAround('stations'));
bindClick(document.getElementById('openAccessPoints'),()=>openAround('nhd'));
document.addEventListener('mappingdistancechange',()=>{updateRadiusLabels();render();});
updateRadiusLabels();

['crossingsPageDialog','stationsPageDialog','accessPointsPageDialog'].forEach(id=>{
 const page=document.getElementById(id);
 if(!page)return;
 bindClick(page.querySelector('#aroundMeClose'),()=>{try{if(page.open)page.close();else page.removeAttribute('open');}catch(e){page.removeAttribute('open');}});
 bindClick(page.querySelector('#aroundLocate'),locate);
 bindClick(page.querySelector('#aroundFind'),locate);
 if(page.dataset.pageMode==='crossings')bindCrossingStatusLayerControl();
 page.querySelectorAll('[data-map-zoom]').forEach(button=>bindClick(button,()=>{if(!map)return;button.dataset.mapZoom==='in'?map.zoomIn():map.zoomOut();}));
 bindClick(page.querySelector('.map-fullscreen-open'),()=>setMapFullscreen(true));
 bindClick(page.querySelector('.around-map-fullscreen-close'),()=>setMapFullscreen(false));
 if(page.dataset.pageMode==='nhd')bindClick(page.querySelector('#aroundNhdLoadAll'),loadAllNhd);
 page.querySelector('#aroundRadius')?.addEventListener('change',render);
 page.querySelector('#aroundLimit')?.addEventListener('change',render);
 page.querySelector('#aroundSearch')?.addEventListener('input',render);
 const resultsEl=page.querySelector('#aroundResults');
 const focusResult=(e)=>{
  const card=e.target.closest('.around-result[data-map-index]');
  if(!card||!resultsEl?.contains(card)||e.target.closest('a'))return;
  const index=Number(card.dataset.mapIndex),item=visibleItems[index],marker=resultMarkers[index];
  if(!item||!marker||!map)return;
  e.preventDefault();
  try{map.invalidateSize();map.panTo([item.lat,item.lon],{animate:false});marker.openPopup();}
  catch(err){console.warn('Could not focus selected station/location on map:',err);}
 };
 resultsEl?.addEventListener('click',focusResult);
 resultsEl?.addEventListener('keydown',e=>{
  if((e.key==='Enter'||e.key===' ')&&e.target.matches('.around-result[data-map-index]')){
   e.preventDefault();focusResult(e);
  }
 });
 page.addEventListener('click',e=>{if(e.target===page){try{page.close();}catch(e){page.removeAttribute('open');}}});
 page.addEventListener('cancel',e=>{const shell=page.querySelector('.around-map-shell');if(shell?.classList.contains('is-fullscreen')){e.preventDefault();setMapFullscreen(false);return;}e.preventDefault();try{page.close();}catch(err){page.removeAttribute('open');}});
 page.addEventListener('close',()=>{setMapFullscreen(false);page.style.display='';if(activeDialog===page)activeDialog=null;});
});
})();