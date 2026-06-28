/**
 * histogram.js v3 — Fixed canvas sizing, proper data flow
 */
(function initHistogram() {

  const CHANNELS = [
    { key:'dimuon',     name:'Dimuon (μ⁺μ⁻)',    color:'#ff4081', peak:91.2  },
    { key:'dielectron', name:'Dielectron (e⁺e⁻)', color:'#00e5ff', peak:91.2  },
    { key:'diphoton',   name:'Diphoton (γγ)',      color:'#ffd740', peak:125.2 },
    { key:'all',        name:'All Particles',      color:'#69ff47', peak:null  },
  ];
  const BIN_MIN=0, BIN_MAX=200, BIN_SIZE=2, N_BINS=100;

  let bins={}, counts={}, activeKey='dimuon', totalEvents=0, peakFound=false, mode='count';
  CHANNELS.forEach(c=>{bins[c.key]=new Float32Array(N_BINS);counts[c.key]=0;});

  const canvas    = document.getElementById('histogramCanvas');
  const emptyEl   = document.getElementById('histogramEmpty');
  const peakBadge = document.getElementById('histogramPeakBadge');
  const peakValEl = document.getElementById('histogramPeakVal');
  const peakSubEl = document.getElementById('histogramPeakSub');
  const statEvEl  = document.getElementById('histStatEvents');
  const statEnEl  = document.getElementById('histStatEntries');
  const statPkEl  = document.getElementById('histStatPeak');
  const discEl    = document.getElementById('histDiscovery');

  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W=0, H=0;

  /* Resize — waits until element is visible */
  function resize(){
    const wrap = canvas.parentElement;
    if(!wrap) return;
    const w = wrap.clientWidth || 0;
    const h = wrap.clientHeight || 0;
    if(w<10 || h<10) return; // not visible yet
    if(w===W && h===H) return;
    W=canvas.width=w;
    H=canvas.height=h;
    draw();
  }

  // Multiple strategies to catch when element becomes visible
  new ResizeObserver(()=>{ resize(); }).observe(canvas.parentElement);
  document.addEventListener('scroll', ()=>{ if(W<10) resize(); }, {passive:true});
  window.addEventListener('load', ()=>{ setTimeout(resize,100); setTimeout(resize,500); });

  function gauss(mu,sigma){
    let u,v,s;
    do{u=Math.random()*2-1;v=Math.random()*2-1;s=u*u+v*v;}while(s>=1||s===0);
    return mu+sigma*u*Math.sqrt(-2*Math.log(s)/s);
  }

  function invMass(p1,p2){
    const dEta=p1.eta-p2.eta;
    const dPhi=Math.abs(p1.phi-p2.phi);
    const dp=dPhi>Math.PI?2*Math.PI-dPhi:dPhi;
    const M2=2*p1.pT*p2.pT*(Math.cosh(dEta)-Math.cos(dp));
    return M2>0?Math.sqrt(M2):0;
  }

  function fillBin(ch,mass){
    if(mass<BIN_MIN||mass>=BIN_MAX)return;
    const i=Math.floor((mass-BIN_MIN)/BIN_SIZE);
    if(i>=0&&i<N_BINS) bins[ch][i]++;
  }

  window.histogramFill = function(result){
    if(!result||!result.products)return;
    totalEvents++;
    const pr=result.products;

    // Dimuon
    const muP=pr.find(p=>p.symbol==='μ⁺'||p.name==='Antimuon');
    const muN=pr.find(p=>p.symbol==='μ⁻'||p.name==='Muon');
    if(muP&&muN){const m=invMass(muP,muN);if(m>0){fillBin('dimuon',gauss(m,1.8));fillBin('all',gauss(m,1.8));counts['dimuon']++;}}

    // Dielectron
    const eP=pr.find(p=>p.symbol==='e⁺'||p.name==='Positron');
    const eN=pr.find(p=>p.symbol==='e⁻'||p.name==='Electron');
    if(eP&&eN){const m=invMass(eP,eN);if(m>0){fillBin('dielectron',gauss(m,2.2));fillBin('all',gauss(m,2.2));counts['dielectron']++;}}

    // Diphoton
    const photons=pr.filter(p=>p.symbol==='γ'||p.name==='Photon');
    if(photons.length>=2){const m=invMass(photons[0],photons[1]);if(m>0){fillBin('diphoton',gauss(m,1.5));fillBin('all',gauss(m,1.5));counts['diphoton']++;}}

    // All: use pT as proxy mass
    pr.forEach(p=>{
      if(p.pT&&!p.isMET){
        const proxy=Math.abs(gauss(p.pT*0.45, p.pT*0.09));
        if(proxy>0&&proxy<BIN_MAX) fillBin('all',proxy);
      }
    });

    if(W<10) resize(); // trigger resize if not yet visible
    draw();
    updateStats();
    checkPeak();
  };

  function draw(){
    if(!ctx||W<10||H<10)return;
    ctx.clearRect(0,0,W,H);

    const data=bins[activeKey];
    const maxBin=Math.max(...data,1);
    const ch=CHANNELS.find(c=>c.key===activeKey);
    const color=ch?ch.color:'#00e5ff';
    const hasData=totalEvents>0;

    if(emptyEl) emptyEl.style.display=hasData?'none':'flex';
    if(!hasData)return;

    const PAD={top:28,right:20,bottom:50,left:54};
    const pW=W-PAD.left-PAD.right;
    const pH=H-PAD.top-PAD.bottom;

    function yScale(v){
      const val=mode==='log'?Math.log10(v+1):v;
      const max=mode==='log'?Math.log10(maxBin+1):maxBin;
      return PAD.top+pH-(val/(max*1.1))*pH;
    }

    // Grid
    ctx.save();
    ctx.strokeStyle='rgba(255,255,255,0.035)';ctx.lineWidth=1;
    for(let i=1;i<=5;i++){const y=PAD.top+(pH/5)*i;ctx.beginPath();ctx.moveTo(PAD.left,y);ctx.lineTo(PAD.left+pW,y);ctx.stroke();}
    ctx.restore();

    // Bars
    const bW=pW/N_BINS;
    ctx.save();
    for(let i=0;i<N_BINS;i++){
      if(data[i]===0)continue;
      const x=PAD.left+i*bW,y=yScale(data[i]),bH=PAD.top+pH-y;
      if(bH<1)continue;
      const grd=ctx.createLinearGradient(x,y,x,PAD.top+pH);
      grd.addColorStop(0,color);grd.addColorStop(1,color+'18');
      ctx.fillStyle=grd;ctx.fillRect(x,y,Math.max(bW-0.5,1),bH);
    }
    ctx.restore();

    // Peak marker
    if(ch&&ch.peak){
      const peakBinIdx=Math.floor((ch.peak-BIN_MIN)/BIN_SIZE);
      if(data[peakBinIdx]>1){
        const px=PAD.left+((ch.peak-BIN_MIN)/BIN_SIZE)*bW;
        ctx.save();
        ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.setLineDash([5,5]);ctx.globalAlpha=0.7;
        ctx.beginPath();ctx.moveTo(px,PAD.top);ctx.lineTo(px,PAD.top+pH);ctx.stroke();
        ctx.setLineDash([]);ctx.globalAlpha=1;
        ctx.fillStyle=color;ctx.font=`bold 11px 'DM Mono',monospace`;ctx.textAlign='center';
        ctx.fillText(`${ch.peak} GeV`,px,PAD.top+12);
        ctx.restore();
        if(peakBadge){peakBadge.classList.add('visible');}
        if(peakValEl) peakValEl.textContent=`${ch.peak} GeV`;
        if(peakSubEl) peakSubEl.textContent=ch.key==='diphoton'?'Higgs Candidate':'Z Boson Resonance';
        if(statPkEl)  statPkEl.textContent=`${ch.peak} GeV`;
      }
    }

    // Axes
    ctx.save();
    ctx.strokeStyle='rgba(255,255,255,0.12)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(PAD.left,PAD.top+pH);ctx.lineTo(PAD.left+pW,PAD.top+pH);ctx.stroke();
    ctx.beginPath();ctx.moveTo(PAD.left,PAD.top);ctx.lineTo(PAD.left,PAD.top+pH);ctx.stroke();
    ctx.restore();

    // X labels
    ctx.save();
    ctx.fillStyle='rgba(138,154,181,0.75)';ctx.font=`10px 'DM Mono',monospace`;
    ctx.textAlign='center';ctx.textBaseline='top';
    [0,20,40,60,80,91,100,125,150,200].forEach(v=>{
      const x=PAD.left+((v-BIN_MIN)/BIN_SIZE)*bW;
      ctx.fillText(v,x,PAD.top+pH+5);
    });
    ctx.fillStyle='rgba(138,154,181,0.5)';ctx.textBaseline='alphabetic';
    ctx.fillText('Invariant Mass  (GeV/c²)',PAD.left+pW/2,H-3);
    ctx.restore();

    // Y labels
    ctx.save();
    ctx.fillStyle='rgba(138,154,181,0.75)';ctx.font=`10px 'DM Mono',monospace`;
    ctx.textAlign='right';ctx.textBaseline='middle';
    for(let i=0;i<=4;i++){
      const frac=i/4,y=PAD.top+pH*(1-frac),val=Math.round(frac*maxBin);
      ctx.fillText(val,PAD.left-5,y);
    }
    ctx.save();ctx.translate(14,PAD.top+pH/2);ctx.rotate(-Math.PI/2);
    ctx.textAlign='center';ctx.fillStyle='rgba(138,154,181,0.5)';
    ctx.fillText('Events / 2 GeV',0,0);ctx.restore();
    ctx.restore();
  }

  function updateStats(){
    if(statEvEl) statEvEl.textContent=totalEvents.toLocaleString();
    if(statEnEl) statEnEl.textContent=(counts[activeKey]||0).toLocaleString();
    document.querySelectorAll('.histogram-channel').forEach(el=>{
      const c=el.querySelector('.histogram-channel__count');
      if(c) c.textContent=(counts[el.dataset.channel]||0).toString();
    });
  }

  function checkPeak(){
    if(peakFound)return;
    let sum=0;
    for(let i=Math.floor((89-BIN_MIN)/BIN_SIZE);i<=Math.floor((93-BIN_MIN)/BIN_SIZE);i++) sum+=bins['dimuon'][i];
    if(sum>=6){peakFound=true;if(discEl)discEl.classList.add('visible');setChannel('dimuon');}
  }

  function setChannel(key){
    activeKey=key;
    if(peakBadge) peakBadge.classList.remove('visible');
    document.querySelectorAll('.histogram-channel').forEach(el=>el.classList.toggle('active',el.dataset.channel===key));
    updateStats();draw();
  }

  document.querySelectorAll('.histogram-channel').forEach(el=>el.addEventListener('click',()=>setChannel(el.dataset.channel)));
  document.querySelectorAll('.histogram-mode-btn').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.histogram-mode-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');mode=btn.dataset.mode;draw();
  }));
  const clearBtn=document.getElementById('histogramClearBtn');
  if(clearBtn) clearBtn.addEventListener('click',()=>{
    CHANNELS.forEach(c=>{bins[c.key].fill(0);counts[c.key]=0;});
    totalEvents=0;peakFound=false;
    if(peakBadge) peakBadge.classList.remove('visible');
    if(discEl) discEl.classList.remove('visible');
    if(statPkEl) statPkEl.textContent='—';
    updateStats();draw();
  });

})();
