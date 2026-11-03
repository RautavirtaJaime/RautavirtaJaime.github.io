'use strict';
(() => {
  document.documentElement.classList.add('js');
  const $ = (selector) => document.querySelector(selector);
  const menuButton = $('.menu-toggle');
  const header = $('.site-header');
  const nav = $('#main-nav');
  function closeMenu(returnFocus = false) {
    header.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Avaa valikko');
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    const open = header.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Sulje valikko' : 'Avaa valikko');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) closeMenu();
  });
  window.matchMedia('(min-width: 701px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });
  $('.print-cv').addEventListener('click', () => window.print());
  $('#year').textContent = new Date().getFullYear();
  let toastTimer;
  $('#copy-email').addEventListener('click', async () => {
    const toast = $('#toast');
    try {
      await navigator.clipboard.writeText('rautavirtajaime@gmail.com');
      toast.textContent = 'Sähköpostiosoite kopioitu.';
    } catch {
      toast.textContent = 'Sähköpostiosoite: rautavirtajaime@gmail.com';
    }
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 4000);
  });
  const wideScreen = window.matchMedia('(min-width: 901px)');
  let initialized = false;
  function startWorkbench() {
    if (initialized || !wideScreen.matches) return;
    const canvas = $('#lab-canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    initialized = true;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let paused = reducedMotion.matches;
    let W=500,H=380,dpr=1,yaw=-.44,pitch=.22,targetYaw=yaw,targetPitch=pitch;
    let dragging=false,lastX=0,lastY=0,time=0,visible=true,lastFrame=0,raf=0,dirty=true;
    const accent=[190,237,122];
    const motionButton=$('#motion-toggle');
    function updateMotion(){
      motionButton.textContent=paused?'Jatka liikettä':'Pysäytä liike';
      motionButton.setAttribute('aria-pressed',String(paused));
      dirty=true;
    }
    motionButton.addEventListener('click',()=>{paused=!paused;updateMotion();});
    reducedMotion.addEventListener('change',event=>{paused=event.matches;updateMotion();});
    updateMotion();
    function resize(){const rect=canvas.getBoundingClientRect();W=rect.width;H=rect.height;if(!W||!H)return;dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);dirty=true;}
    new ResizeObserver(resize).observe(canvas);resize();
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{rootMargin:'60px'}).observe(canvas);
    canvas.addEventListener('pointerdown',event=>{if(event.pointerType==='touch')return;dragging=true;lastX=event.clientX;lastY=event.clientY;canvas.setPointerCapture(event.pointerId);});
    canvas.addEventListener('pointermove',event=>{if(!dragging)return;targetYaw+=(event.clientX-lastX)*.009;targetPitch=Math.max(-.15,Math.min(.65,targetPitch+(event.clientY-lastY)*.005));lastX=event.clientX;lastY=event.clientY;dirty=true;});
    const endDrag=()=>{dragging=false;};
    ['pointerup','pointercancel','lostpointercapture'].forEach(name=>canvas.addEventListener(name,endDrag));
    canvas.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(event.key))return;event.preventDefault();if(event.key==='ArrowLeft')targetYaw-=.18;if(event.key==='ArrowRight')targetYaw+=.18;if(event.key==='ArrowUp')targetPitch=Math.min(.65,targetPitch+.1);if(event.key==='ArrowDown')targetPitch=Math.max(-.15,targetPitch-.1);if(event.key==='Home'){targetYaw=-.44;targetPitch=.22;}dirty=true;});
    function rgb(color,factor=1){return `rgb(${color.map(v=>Math.max(0,Math.min(255,Math.round(v*factor)))).join(',')})`;}
  function project(p,offset=[0,0,0],angle=0){let [x,y,z]=p;const ca=Math.cos(angle),sa=Math.sin(angle);const xx=x*ca+z*sa,zz=-x*sa+z*ca;x=xx+offset[0];y+=offset[1];z=zz+offset[2];const cy=Math.cos(yaw),sy=Math.sin(yaw);const rx=x*cy+z*sy,rz=-x*sy+z*cy;const cp=Math.cos(pitch+.27),sp=Math.sin(pitch+.27);const ry=y*cp-rz*sp,depth=y*sp+rz*cp;const scale=Math.min(W/5.9,H/4.7);const perspective=8/(8-depth);return {x:W*.48+rx*scale*perspective,y:H*.51-ry*scale*perspective,z:depth};}
  let faces=[];
  function face(points,color,stroke='#52644355',offset=[0,0,0],angle=0,paint=null){const ps=points.map(p=>project(p,offset,angle));faces.push({ps,color,stroke,z:ps.reduce((v,p)=>v+p.z,0)/ps.length,paint});}
  function box(x,y,z,w,h,d,colors,offset=[0,0,0],angle=0){const p=[[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z],[x,y,z+d],[x+w,y,z+d],[x+w,y+h,z+d],[x,y+h,z+d]];[[0,1,2,3],[4,7,6,5],[0,4,5,1],[3,2,6,7],[0,3,7,4],[1,5,6,2]].forEach((f,i)=>face(f.map(n=>p[n]),colors[i%colors.length],'#60744c44',offset,angle));}
  function line3(points,color,width=1,offset=[0,0,0],angle=0,dash=[]){const ps=points.map(p=>project(p,offset,angle));ctx.beginPath();ps.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);}
  const texture=document.createElement('canvas');texture.width=560;texture.height=350;const tx=texture.getContext('2d');
  function screenTexture(){tx.fillStyle=rgb(accent);tx.fillRect(0,0,560,350);tx.strokeStyle='#31452933';tx.lineWidth=1;for(let x=20;x<560;x+=26){tx.beginPath();tx.moveTo(x,0);tx.lineTo(x,350);tx.stroke();}for(let y=16;y<350;y+=26){tx.beginPath();tx.moveTo(0,y);tx.lineTo(560,y);tx.stroke();}tx.fillStyle='#35472c';tx.font='500 16px monospace';tx.fillText('JAIME.OS',28,37);tx.font='12px monospace';tx.fillText('VALMIINA',432,37);tx.fillRect(27,51,506,1);tx.font='600 66px "Space Grotesk",sans-serif';tx.textAlign='center';tx.fillText('> moi.',280,181);tx.font='16px monospace';tx.fillText('IT JA ASIAKASTYÖ',280,215);tx.textAlign='left';tx.font='12px monospace';tx.fillText('RATKAISE · OPI · KEHITÄ',28,312);tx.fillStyle='#35472c';[0,1,2,3].forEach(i=>tx.fillRect(435+i*22,298,i===0?15:5,15));}
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

    function render(now){
      raf=requestAnimationFrame(render);
      if(!visible||!wideScreen.matches||document.hidden||!W||!H||now-lastFrame<40)return;
      if(paused&&!dirty&&Math.abs(yaw-targetYaw)<.001&&Math.abs(pitch-targetPitch)<.001)return;
      const dt=Math.min((now-lastFrame)/1000,.07);lastFrame=now;if(!paused)time+=dt;
      const float=paused?0:Math.sin(time*.9)*.04;
      yaw+=(targetYaw-yaw)*.12;pitch+=(targetPitch-pitch)*.12;
      ctx.clearRect(0,0,W,H);ctx.save();
      for(let i=-4;i<=4;i++)line3([[-3,-1.04,i*.56],[3,-1.04,i*.56]],'#7f986612',.65);
      for(let i=-5;i<=5;i++)line3([[i*.56,-1.04,-2.25],[i*.56,-1.04,2.25]],'#7f986612',.65);
      const shadow=project([-.1,-1.03,0]);ctx.save();ctx.translate(shadow.x,shadow.y);ctx.scale(1,.25);
      const gradient=ctx.createRadialGradient(0,0,10,0,0,W*.28);gradient.addColorStop(0,'#435e3429');gradient.addColorStop(1,'#435e3400');ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(0,0,W*.29,0,Math.PI*2);ctx.fill();ctx.restore();
      screenTexture();faces=[];buildLaptop(float);buildPhone(float);
      faces.sort((a,b)=>a.z-b.z).forEach(surface=>{ctx.beginPath();surface.ps.forEach((point,i)=>i?ctx.lineTo(point.x,point.y):ctx.moveTo(point.x,point.y));ctx.closePath();ctx.fillStyle=surface.color;ctx.fill();ctx.strokeStyle=surface.stroke;ctx.lineWidth=.65;ctx.stroke();if(surface.paint)surface.paint(surface.ps);});
      const shield=project([-2.05,.92,.42]);drawIcon(shield.x,shield.y,'security');
      const reuse=project([1.15,1.9,-.2]);drawIcon(reuse.x,reuse.y,'reuse');
      ctx.restore();dirty=false;
    }
    document.fonts.ready.then(()=>{dirty=true;});
    wideScreen.addEventListener('change',event=>{if(event.matches){resize();raf=requestAnimationFrame(render);}else cancelAnimationFrame(raf);});
    raf=requestAnimationFrame(render);
  }
  wideScreen.addEventListener('change',startWorkbench);
  startWorkbench();
})();
