'use strict';
(() => {
  const $ = (s, scope = document) => scope.querySelector(s);
  const $$ = (s, scope = document) => [...scope.querySelectorAll(s)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  let toastTimer;
  function toast(message) {
    const el = $('#toast'); el.textContent = message; el.classList.add('visible');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 3200);
  }
  const motionButton = $('#motion-toggle');
  function updateMotion() {
    document.body.classList.toggle('motion-paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.setAttribute('aria-label', paused ? 'Käynnistä animaatiot' : 'Pysäytä animaatiot');
    motionButton.title = paused ? 'Käynnistä animaatiot' : 'Pysäytä animaatiot';
    motionButton.innerHTML = paused ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z"/></svg>' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M9 5v14M15 5v14"/></svg>';
  }
  updateMotion();
  motionButton.addEventListener('click', () => { paused = !paused; updateMotion(); });
  reducedMotion.addEventListener('change', e => { paused = e.matches; updateMotion(); });
  const menuButton = $('.menu-toggle'), menu = $('#mobile-nav');
  function closeMenu() {menu.hidden = true; menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','Avaa valikko');}
  menuButton.addEventListener('click', () => {const open = menu.hidden; menu.hidden = !open; menuButton.setAttribute('aria-expanded',String(open)); menuButton.setAttribute('aria-label',open ? 'Sulje valikko' : 'Avaa valikko');});
  $$('a',menu).forEach(a => a.addEventListener('click',closeMenu));
  document.addEventListener('keydown', e => {if(e.key === 'Escape') closeMenu();});
  const tabs = $$('.skill-tab');
  function selectTab(tab, focus = false) {
    tabs.forEach(t => {const active=t===tab;t.classList.toggle('active',active);t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;$('#'+t.getAttribute('aria-controls')).hidden=!active;});
    if(focus) tab.focus();
  }
  tabs.forEach((tab,i) => {tab.addEventListener('click',()=>selectTab(tab)); tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowDown'||e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowUp'||e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();selectTab(tabs[next],true);}});});
  const cases = {
    inrego: {category:'INREGO / KÄYTÄNNÖN TYÖKOKEMUS',title:'Laitteelle uusi elämä.',intro:'Tuotannon työpöydällä oppii nopeasti, että jokaisella laitteella on oma tarinansa. Minun tehtäväni oli selvittää, voiko sille kirjoittaa vielä uuden luvun.',body:'<h3>Oma roolini</h3><p>Työskentelin Inregon tuotannossa IT-teknikkona noin neljä vuotta. Käsittelin IT- ja mobiililaitteita, tein toiminnallista testausta, tietoturvallista tyhjennystä ja laatuluokittelua sekä selvittelin haastavampia käsittelytapauksia.</p><h3>Mitä tästä jäi työkalupakkiin?</h3><ul><li>Järjestelmällinen vianrajaus ja huolellinen dokumentointi.</li><li>Blancco-tyhjennys ja yritysten laitehallinnan ymmärtäminen.</li><li>Kokonaiskuva laitteiden elinkaaresta ja uudelleenkäytöstä.</li></ul><p class="case-note">Nykyään hyödynnän samaa tuotannon ymmärrystä buyback-myynnissä: osaan avata asiakkaalle myös sen, mitä laitteelle tapahtuu noudon jälkeen.</p>'},
    grano: {category:'GRANO / YHTEISTYÖ TEKNISEN TIIMIN KANSSA',title:'Työmaa taskussa.',intro:'Asennustiimin arjessa oikean tiedon pitää kulkea mukana. Olin mukana teknisen tiimin kanssa mobiilisovelluksen kehitystyössä.',body:'<h3>Käytännön tarve</h3><p>Sovellus antoi asennustiimille reaaliaikaisen näkymän aikataulutettuihin tehtäviin ja projektien tilanteeseen. Asiakaskoordinoinnin taustani auttoi ymmärtämään, millaista tietoa käytännön työssä tarvitaan.</p><h3>Mitä opin?</h3><ul><li>Käyttäjän arjen ymmärtäminen ennen ratkaisun määrittelyä.</li><li>Yhteistyö asiakastyön ja teknisen toteutuksen välillä.</li><li>Selkeän, ajantasaisen tiedon merkitys projektien sujumiselle.</li></ul><p class="case-note">Työ yhdisti asiakasymmärryksen ja teknisen toteutuksen. Sama yhteistyöote on mukana myös nykyisessä työssäni.</p>'},
    learning: {category:'METROPOLIA / OPINNOT & OMAT KOKEILUT',title:'Seuraava versio.',intro:'Haluan ymmärtää, miten järjestelmät toimivat pinnan alla. Siksi syvennän käytännön IT-taustaani ohjelmointi-, tietoturva- ja tekoälyopinnoilla.',body:'<h3>Työn alla olevia suuntia</h3><ul><li>Web-kehitys: JavaScript, Node.js, Express ja MongoDB.</li><li>Python ja tekoälyn käytännön sovellukset.</li><li>SQL ja tietokannat.</li><li>Tietoturvan perusteet ja Ethical Hacking -opintoja.</li></ul><h3>Minua kiinnostaa erityisesti</h3><p>Arjen toistuvien vaiheiden automatisointi ja tekniset ratkaisut, joiden hyöty näkyy käyttäjälle. Haluan yhdistää ohjelmistokehityksen, laitteet ja asiakasymmärryksen samaan kokonaisuuteen.</p><p class="case-note">Tavoitteeni on kasvaa tekijäksi, joka ymmärtää käyttäjän tarpeen, teknisen toteutuksen ja ratkaisun käytännön vaikutukset.</p>'}
  };
  const dialog = $('#case-dialog');
  let lastCaseButton;
  $$('.work-row').forEach(button => button.addEventListener('click', () => {const data = cases[button.dataset.case];lastCaseButton=button;$('#case-category').textContent=data.category;$('#case-title').textContent=data.title;$('#case-intro').textContent=data.intro;$('#case-body').innerHTML=data.body;dialog.showModal();document.body.style.overflow='hidden';}));
  function closeDialog() {dialog.close();}
  $('.dialog-close').addEventListener('click',closeDialog);$('.dialog-dismiss').addEventListener('click',closeDialog);
  dialog.addEventListener('click', e => {if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
  dialog.addEventListener('close',()=>{document.body.style.overflow='';lastCaseButton?.focus();});
  $$('.print-cv').forEach(button => button.addEventListener('click',()=>window.print()));
  $('.top-button').addEventListener('click',()=>window.scrollTo({top:0,behavior:paused?'instant':'smooth'}));
  $('#year').textContent=new Date().getFullYear();
  $('#copy-email').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('rautavirtajaime@gmail.com');toast('Sähköpostiosoite kopioitu. Jutellaan!');}catch{toast('Osoite: rautavirtajaime@gmail.com');}});
  let scrollQueued=false;
  function updateProgress(){const range=document.documentElement.scrollHeight-window.innerHeight;$('.reading-progress').style.transform=`scaleX(${range>0?window.scrollY/range:0})`;scrollQueued=false;}
  window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateProgress);}},{passive:true});updateProgress();
  // A small dependency-free 3D workbench. Every surface is projected from real 3D points.
  const canvas=$('#lab-canvas'),ctx=canvas.getContext('2d');
  if(!ctx)return;
  let W=500,H=465,dpr=1,yaw=-.44,pitch=.22,targetYaw=yaw,targetPitch=pitch,dragging=false,lastX=0,lastY=0,mode='it',time=0,visible=true,lastFrame=0;
  let accent=[190,237,122],targetAccent=[190,237,122];
  const palette={it:[190,237,122],people:[224,179,145],reuse:[157,211,190]};
  const captions={it:'LAITE KÄTEEN. ONGELMA RATKAISTAAN.',people:'TEKNIIKKA TOIMII IHMISTEN KAUTTA.',reuse:'KÄYTÖSTÄ POIS. TAKAISIN KÄYTTÖÖN.'};
  const indices={it:'01',people:'02',reuse:'03'};
  $$('.mode-button').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;targetAccent=palette[mode];$('.hero-lab').dataset.mode=mode;$('#lab-caption-label').textContent=captions[mode];$('#mode-index').textContent=indices[mode];$$('.mode-button').forEach(x=>{const active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active));});}));
  function resize(){const r=canvas.getBoundingClientRect();W=r.width;H=r.height;dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
  new ResizeObserver(resize).observe(canvas);resize();
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{rootMargin:'100px'}).observe(canvas);
  canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(dragging){targetYaw+=(e.clientX-lastX)*.009;targetPitch=Math.max(-.15,Math.min(.65,targetPitch+(e.clientY-lastY)*.005));lastX=e.clientX;lastY=e.clientY;}});
  function endDrag(){dragging=false;}canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);canvas.addEventListener('lostpointercapture',endDrag);
  canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key)){e.preventDefault();if(e.key==='ArrowLeft')targetYaw-=.18;if(e.key==='ArrowRight')targetYaw+=.18;if(e.key==='ArrowUp')targetPitch=Math.min(.65,targetPitch+.1);if(e.key==='ArrowDown')targetPitch=Math.max(-.15,targetPitch-.1);if(e.key==='Home'){targetYaw=-.44;targetPitch=.22;}}});
  function rgb(a,f=1){return `rgb(${a.map(v=>Math.max(0,Math.min(255,Math.round(v*f)))).join(',')})`;}
  function project(p,offset=[0,0,0],angle=0){let [x,y,z]=p;const ca=Math.cos(angle),sa=Math.sin(angle);const xx=x*ca+z*sa,zz=-x*sa+z*ca;x=xx+offset[0];y+=offset[1];z=zz+offset[2];const cy=Math.cos(yaw),sy=Math.sin(yaw);const rx=x*cy+z*sy,rz=-x*sy+z*cy;const cp=Math.cos(pitch+.27),sp=Math.sin(pitch+.27);const ry=y*cp-rz*sp,depth=y*sp+rz*cp;const scale=Math.min(W/5.9,H/4.7);const perspective=8/(8-depth);return {x:W*.48+rx*scale*perspective,y:H*.51-ry*scale*perspective,z:depth};}
  let faces=[];
  function face(points,color,stroke='#52644355',offset=[0,0,0],angle=0,paint=null){const ps=points.map(p=>project(p,offset,angle));faces.push({ps,color,stroke,z:ps.reduce((v,p)=>v+p.z,0)/ps.length,paint});}
  function box(x,y,z,w,h,d,colors,offset=[0,0,0],angle=0){const p=[[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z],[x,y,z+d],[x+w,y,z+d],[x+w,y+h,z+d],[x,y+h,z+d]];[[0,1,2,3],[4,7,6,5],[0,4,5,1],[3,2,6,7],[0,3,7,4],[1,5,6,2]].forEach((f,i)=>face(f.map(n=>p[n]),colors[i%colors.length],'#60744c44',offset,angle));}
  function line3(points,color,width=1,offset=[0,0,0],angle=0,dash=[]){const ps=points.map(p=>project(p,offset,angle));ctx.beginPath();ps.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);}
  const texture=document.createElement('canvas');texture.width=560;texture.height=350;const tx=texture.getContext('2d');
  function screenTexture(){tx.fillStyle=rgb(accent);tx.fillRect(0,0,560,350);tx.strokeStyle='#31452933';tx.lineWidth=1;for(let x=20;x<560;x+=26){tx.beginPath();tx.moveTo(x,0);tx.lineTo(x,350);tx.stroke();}for(let y=16;y<350;y+=26){tx.beginPath();tx.moveTo(0,y);tx.lineTo(560,y);tx.stroke();}tx.fillStyle='#35472c';tx.font='500 16px monospace';tx.fillText('JAIME.OS',28,37);tx.font='12px monospace';tx.fillText('SYSTEM READY',402,37);tx.fillRect(27,51,506,1);tx.font='600 66px "Space Grotesk",sans-serif';tx.textAlign='center';tx.fillText(mode==='it'?'> hello.':mode==='people'?'connect.':'re:start.',280,181);tx.font='16px monospace';tx.fillText(mode==='it'?'IT × UTELIAISUUS':mode==='people'?'TEKNIIKKA × IHMISET':'IT × KIERTOTALOUS',280,215);tx.textAlign='left';tx.font='12px monospace';tx.fillText('01 / BUILD · SOLVE · REPEAT',28,312);tx.fillStyle='#35472c';[0,1,2,3].forEach(i=>tx.fillRect(435+i*22,298,i===0?15:5,15));}
  function drawTexture(ps){const p0=ps[0],p1=ps[1],p3=ps[3];ctx.save();ctx.beginPath();ps.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.clip();ctx.transform((p1.x-p0.x)/560,(p1.y-p0.y)/560,(p3.x-p0.x)/350,(p3.y-p0.y)/350,p0.x,p0.y);ctx.drawImage(texture,0,0);ctx.restore();}
  function buildLaptop(float){const o=[-.15,float-.04,0],a=.08;const metal=['#9ca68d','#b8c2a7','#8c987c','#dbe2cc','#a6b398','#c0cbb1'];box(-1.5,-.63,-1,3,.13,2.03,metal,o,a);
    // Keyboard and trackpad sit on the top face of the aluminium base.
    for(let row=0;row<4;row++)for(let col=0;col<11;col++){const x=-1.29+col*.235,z=-.78+row*.235;face([[x,-.493,z],[x+.18,-.493,z],[x+.18,-.493,z+.16],[x,-.493,z+.16]],row===3&&col===5?'#758665':'#516049','#3c4f3422',o,a);faces[faces.length-1].z=3;}
    face([[-.5,-.488,.31],[.5,-.488,.31],[.5,-.488,.83],[-.5,-.488,.83]],'#c4d0b3','#8b9d7766',o,a);
    // Screen housing leans back from the hinge.
    const back=[[-1.5,-.49,-.94],[1.5,-.49,-.94],[1.5,1.46,-1.43],[-1.5,1.46,-1.43]];
    face(back,'#35432f','#23341e',o,a);face(back.map(p=>[p[0],p[1],p[2]-.09]),'#9eac8e','#849573',o,a);
    face([[-1.5,-.49,-.94],[-1.5,1.46,-1.43],[-1.5,1.46,-1.52],[-1.5,-.49,-1.03]],'#c9d3ba','#849573',o,a);
    face([[1.5,1.46,-1.43],[-1.5,1.46,-1.43],[-1.5,1.46,-1.52],[1.5,1.46,-1.52]],'#d5ddc7','#849573',o,a);
    const screen=[[-1.36,1.32,-1.385],[1.36,1.32,-1.385],[1.36,-.29,-.98],[-1.36,-.29,-.98]];
    face(screen,rgb(accent),'#293a2266',o,a,drawTexture);
  }
  function buildPhone(float){const o=[1.87,.02+float*.7,.2],a=-.45;box(-.38,-.8,0,.76,1.49,.12,['#617458','#becba9','#51654a','#dfebca','#8da17b','#839a72'],o,a);face([[-.32,-.7,.122],[.32,-.7,.122],[.32,.56,.122],[-.32,.56,.122]],'#2d4028','#2a3e23',o,a);face([[-.24,.36,.125],[.24,.36,.125],[.24,.44,.125],[-.24,.44,.125]],rgb(accent),'transparent',o,a);for(let row=0;row<3;row++)for(let col=0;col<2;col++){const x=-.23+col*.26,y=-.18-row*.19;face([[x,y,.125],[x+.18,y,.125],[x+.18,y+.12,.125],[x,y+.12,.125]],row===0?rgb(accent,.8):'#6e865e','transparent',o,a);}}
  function drawIcon(x,y,type){ctx.save();ctx.translate(x,y);ctx.strokeStyle='#62794e';ctx.lineWidth=1.1;ctx.fillStyle='#edf2e3';ctx.beginPath();ctx.arc(0,0,23,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();if(type==='security'){ctx.moveTo(0,-11);ctx.lineTo(10,-6);ctx.lineTo(8,5);ctx.lineTo(0,12);ctx.lineTo(-8,5);ctx.lineTo(-10,-6);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.moveTo(-4,0);ctx.lineTo(-1,4);ctx.lineTo(5,-4);}else{ctx.arc(0,0,10,-.8,Math.PI*.9);ctx.moveTo(8,-7);ctx.lineTo(11,-7);ctx.lineTo(10,-12);ctx.moveTo(-8,7);ctx.lineTo(-11,7);ctx.lineTo(-10,12);ctx.arc(0,0,10,Math.PI-.8,Math.PI*1.9);}ctx.stroke();ctx.restore();}
  function render(now){requestAnimationFrame(render);if(!visible||document.hidden)return;if(now-lastFrame<30)return;const dt=Math.min((now-lastFrame)/1000,.07);lastFrame=now;if(!paused)time+=dt;const float=paused?0:Math.sin(time*.9)*.055;yaw+=(targetYaw-yaw)*.1;pitch+=(targetPitch-pitch)*.1;accent=accent.map((v,i)=>v+(targetAccent[i]-v)*.07);ctx.clearRect(0,0,W,H);ctx.save();
    // Projected floor and subtle orbital construction marks.
    for(let i=-4;i<=4;i++)line3([[-3,-1.04,i*.56],[3,-1.04,i*.56]],'#7f986616',.65);for(let i=-5;i<=5;i++)line3([[i*.56,-1.04,-2.25],[i*.56,-1.04,2.25]],'#7f986616',.65);
    const shadow=project([-.1,-1.03,0]);ctx.save();ctx.translate(shadow.x,shadow.y);ctx.scale(1,.25);const g=ctx.createRadialGradient(0,0,10,0,0,W*.28);g.addColorStop(0,'#435e3429');g.addColorStop(1,'#435e3400');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,W*.29,0,Math.PI*2);ctx.fill();ctx.restore();
    const orbit=[];for(let i=0;i<=80;i++){const t=i/80*Math.PI*2;orbit.push([Math.cos(t)*2.72,.24+Math.sin(t)*.32,Math.sin(t)*1.95]);}line3(orbit,'#8caa6b55',.8,undefined,0,[3,5]);screenTexture();faces=[];buildLaptop(float);buildPhone(float);faces.sort((a,b)=>a.z-b.z).forEach(f=>{ctx.beginPath();f.ps.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=f.color;ctx.fill();ctx.strokeStyle=f.stroke;ctx.lineWidth=.65;ctx.stroke();if(f.paint)f.paint(f.ps);});
    const node=project([-2.05,.92,.42]);drawIcon(node.x,node.y,'security');const node2=project([1.15,1.9,-.2]);drawIcon(node2.x,node2.y,'reuse');
    const p=project([-2.15,-.15,.25]);ctx.fillStyle='#788b64';ctx.font='7px monospace';ctx.fillText('SECURE BY PRACTICE',p.x-46,p.y+20);ctx.restore();$('#coord-x').textContent=String(Math.round(yaw*180/Math.PI)).padStart(3,'0')+'°';$('#coord-y').textContent=String(Math.round(pitch*180/Math.PI)).padStart(3,'0')+'°';
  }
  requestAnimationFrame(render);
})();
