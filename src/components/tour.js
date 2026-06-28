/**
 * tour.js v6 — Final Professional Version
 * - Scroll is FREE — user can scroll while tour is active
 * - Spotlight tracks the target element during scroll (requestAnimationFrame)
 * - Tooltip positions smartly relative to target
 * - hero__title correctly framed for step 2
 */
(function initGuidedTour() {

  const STEPS = [
    { target:'.nav__logo',
      title:'Welcome to Particle Playground',
      section:'Introduction · 1',
      text:'This simulator is built on <strong>real collision data</strong> from the CMS detector at CERN\'s Large Hadron Collider. Every interaction follows the same physical laws used by particle physicists worldwide.',
      insight:{label:'Data Source',text:'All particle properties are sourced from the Particle Data Group (PDG) 2024 Review — the authoritative global reference for experimental particle physics.'},
      visual:'cern_ring', width:340 },

    { target:'.hero__title',
      title:'Three Pillars of Discovery',
      section:'Introduction · 2',
      text:'<strong>Collide</strong> — accelerate particles to near-light speed. <strong>Discover</strong> — examine the debris for signatures of new particles. <strong>Understand</strong> — connect observations to the fundamental laws of nature.',
      insight:{label:'Historical Context',text:'This cycle drove every major particle physics breakthrough over 70 years, culminating in the Higgs boson discovery at CERN in 2012.'},
      visual:'discovery_timeline', width:360 },

    { target:'#beamSelector',
      title:'Beam Type — What Are We Colliding?',
      section:'The Collider · 3',
      text:'<strong>p–p</strong> is the standard mode — clean and precise, ideal for Higgs studies. <strong>Pb–Pb</strong> smashes two heavy nuclei, briefly recreating the Quark-Gluon Plasma that existed microseconds after the Big Bang.',
      insight:{label:'Scale',text:'A lead-208 nucleus contains 82 protons and 126 neutrons — 624 quarks in total. Pb–Pb collisions create energy densities exceeding 10 GeV/fm³, hotter than a supernova core.'},
      visual:'beam_types', width:320 },

    { target:'#energySlider',
      title:'Centre-of-Mass Energy (√s)',
      section:'The Collider · 4',
      text:'Controls the total energy available to create new particles. Higher energy unlocks heavier particles — a direct application of Einstein\'s <em>E = mc²</em>. At the collision point, kinetic energy converts into particle mass.',
      formula:'E = mc²   →   √s  ≥  m_particle · c²',
      insight:{label:'Key Fact',text:'The Higgs boson weighs 125.2 GeV. At 7 TeV, quarks inside each proton carry enough energy to produce Higgs bosons — which is why Run 1 (2011–2012) made the discovery possible.'},
      visual:'energy_thresholds', width:340 },

    { target:'#lumiSlider',
      title:'Luminosity — Collision Rate',
      section:'The Collider · 5',
      text:'Luminosity quantifies collisions per unit area per unit time. The Higgs boson is produced only once in every <strong>10 billion</strong> collisions — accumulating statistics requires very high luminosity.',
      insight:{label:'LHC Record',text:'The LHC achieved a peak luminosity of 2.1 × 10³⁴ cm⁻²s⁻¹ in Run 3 (2022–2025) — more than double its original design specification.'},
      visual:'luminosity_chart', width:320 },

    { target:'#focusChannel',
      title:'Focus Channel — Signal Selection',
      section:'The Collider · 6',
      text:'Without filtering, QCD jet background overwhelms rare signals by a factor of billions. Selecting a channel replicates how real detector <strong>trigger systems</strong> operate at the LHC in real time.',
      insight:{label:'CMS Trigger',text:'The CMS trigger makes 40 million binary decisions per second, reducing the raw 40 MHz event rate to approximately 1,000 events per second worth storing for analysis.'},
      visual:'trigger_funnel', width:320 },

    { target:'#collideBtn',
      title:'COLLIDE — Fire the Beam',
      section:'The Collider · 7',
      text:'Each press simulates one bunch crossing. The engine samples from NLO cross-section distributions, then generates final-state particle kinematics from physically accurate phase-space distributions.',
      insight:{label:'Pileup',text:'At the LHC, up to 50 proton–proton interactions can occur in a single bunch crossing — a phenomenon called pileup that experimentalists must carefully subtract from measurements.'},
      visual:'collision_flash', width:320 },

    { target:'#predictionPanel',
      title:'Physics Prediction — Cross-Section Ratios',
      section:'The Collider · 8',
      text:'These percentages show <strong>relative production rates</strong> from NLO/NNLO theoretical cross-sections. QCD jets dominate at low energies; W, Z, and Higgs production rates become significant at higher energies.',
      insight:{label:'Scale of Rarity',text:'The QCD dijet cross-section at 7 TeV is ~10⁸ nb. Higgs production via gluon fusion is only 15 pb — a ratio of ten billion to one.'},
      visual:'xs_comparison', width:340 },

    { target:'.collider-stage',
      title:'Event Display — Reading the Tracks',
      section:'The Collider · 9',
      text:'The canvas shows the <strong>transverse r-φ view</strong> — looking directly down the beam axis. Charged tracks curve in the 3.8 T solenoid field; the curvature radius is inversely proportional to transverse momentum.',
      insight:{label:'CMS Magnet',text:'The CMS solenoid is 12.5 m long and 6 m in diameter, storing enough magnetic energy to melt 18 tonnes of gold.'},
      visual:'detector_layers', width:360 },

    { target:'#feynmanPanel',
      title:'Feynman Diagrams — Mathematical Notation',
      section:'Feynman Diagrams · 10',
      text:'Each collision generates its Feynman diagram. <strong>Time flows left to right.</strong> Straight lines are fermions. Wavy lines are electroweak bosons. Curly lines are gluons. Each diagram is a precise term in Quantum Field Theory.',
      insight:{label:'More Than Illustration',text:'Every Feynman diagram corresponds to a specific Feynman amplitude — a complex number whose squared modulus gives the probability of that interaction occurring.'},
      visual:'feynman_legend', width:340 },

    { target:'#zoo',
      title:'Particle Zoo — The Standard Model',
      section:'Particle Zoo · 11',
      text:'All known fundamental particles in one place. The Standard Model contains <strong>6 quarks, 6 leptons, 4 gauge bosons, and the Higgs boson</strong>. Every particle shown has been experimentally confirmed. Click any card to explore its story.',
      insight:{label:'Precision Test',text:'The Standard Model\'s prediction of the electron anomalous magnetic moment agrees with experiment to 12 decimal places — the most precisely tested scientific theory in history.'},
      visual:'sm_table', width:340 },

    { target:'.zoo-filters',
      title:'Particle Families',
      section:'Particle Zoo · 12',
      text:'<strong>Quarks</strong> experience all forces and form hadrons. <strong>Leptons</strong> carry no colour charge. <strong>Bosons</strong> are force carriers. Fermions obey the Pauli exclusion principle; bosons do not.',
      insight:{label:'Spin Statistics',text:'Fermions (spin 1/2) obey Fermi-Dirac statistics — no two can occupy the same quantum state. Bosons (spin 0, 1) obey Bose-Einstein statistics, which is why lasers work.'},
      visual:'particle_families', width:320 },

    { target:'#events',
      title:'Real Collision Events — CMS Open Data',
      section:'Real Events · 13',
      text:'Every event was <strong>actually recorded by CMS</strong> during p–p collisions at √s = 7 TeV in 2010. Published by CERN under CC0 — the same raw data used in peer-reviewed publications.',
      insight:{label:'Open Data Scale',text:'CERN has released over 2 petabytes of collision data freely to anyone in the world — researchers, educators, and students alike.'},
      visual:'cms_layers', width:340 },

    { target:'.events-display',
      title:'Reading the Event Display',
      section:'Real Events · 14',
      text:'Curved arcs — <strong>charged tracks</strong> in the magnetic field. Filled cones — <strong>hadronic jets</strong>. Dashed lines — <strong>photons</strong>. The arrow — <strong>missing transverse energy</strong> from an undetected neutrino.',
      insight:{label:'Missing Energy',text:'Neutrinos leave no detector signal. Their presence is inferred from momentum conservation: if visible particles do not balance, an invisible particle carried away the remainder.'},
      visual:'event_legend', width:320 },

    { target:'#histogram',
      title:'Invariant Mass Spectrum — The Discovery Tool',
      section:'Mass Spectrum · 15',
      text:'Each collision adds the <strong>invariant mass of particle pairs</strong> to this histogram. When a real particle decays into a pair, a resonance peak appears above the background. This is how every major particle has been discovered.',
      formula:'M² = (E₁+E₂)² − |p⃗₁+p⃗₂|²',
      insight:{label:'Lorentz Invariance',text:'The invariant mass gives the same result in any reference frame — making it the ideal variable for identifying particles in relativistic collisions.'},
      visual:'z_peak_schematic', width:360 },

    { target:'.histogram-channels',
      title:'Select a Decay Channel',
      section:'Mass Spectrum · 16',
      text:'Choose <strong>Dimuon (μ⁺μ⁻)</strong> and press COLLIDE at energies above 7 TeV. After ~20 events, a peak will emerge near <strong>91.2 GeV</strong> — the Z boson resonance. This exact method won the 1984 Nobel Prize in Physics.',
      insight:{label:'Nobel Prize 1984',text:'Carlo Rubbia and Simon van der Meer received the Nobel Prize for discovering the W and Z bosons at CERN\'s SPS in 1983, using precisely this resonance peak technique.'},
      visual:'peak_accumulation', width:340 },

    { target:'#learn-section',
      title:'What You Can Learn Here',
      section:'Learning · 17',
      text:'This platform covers <strong>Standard Model particle physics</strong>, accelerator science, detector technology, experimental methodology, and data analysis — the same toolkit used by CERN physicists every day.',
      insight:{label:'Go Further',text:'Try colliding at 13.6 TeV with the Higgs channel. Accumulate 30+ dimuon events in the Mass Spectrum. Click every particle in the Zoo. Each action teaches a real physics concept.'},
      visual:'open_data_map', width:340 },
  ];

  /* ══════════════════════════════════════════════════════════════════
     VISUALS
     ══════════════════════════════════════════════════════════════════ */
  const VISUALS = {
    cern_ring:(ctx,W,H,t)=>{
      const cx=W/2,cy=H/2,R=Math.min(cx,cy)*0.78;
      ctx.strokeStyle='rgba(0,229,255,0.14)';ctx.lineWidth=14;ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='rgba(0,229,255,0.5)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.stroke();
      [{a:0,n:'ATLAS'},{a:Math.PI/2,n:'CMS'},{a:Math.PI,n:'ALICE'},{a:3*Math.PI/2,n:'LHCb'}].forEach(d=>{
        const dx=cx+Math.cos(d.a)*R,dy=cy+Math.sin(d.a)*R;
        ctx.fillStyle='#ffd740';ctx.shadowColor='#ffd740';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(dx,dy,4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
        ctx.fillStyle='rgba(255,215,64,0.85)';ctx.font=`bold 8px 'DM Mono',monospace`;ctx.textAlign='center';
        ctx.fillText(d.n,cx+Math.cos(d.a)*(R+16),cy+Math.sin(d.a)*(R+16)+3);
      });
      [[t*0.035,'#00e5ff'],[-(t*0.035),'#ff0080']].forEach(([a,c])=>{
        ctx.fillStyle=c;ctx.shadowColor=c;ctx.shadowBlur=12;ctx.beginPath();ctx.arc(cx+Math.cos(a)*R,cy+Math.sin(a)*R,5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
      });
      ctx.fillStyle='rgba(138,154,181,0.45)';ctx.font=`8px 'DM Mono',monospace`;ctx.textAlign='center';ctx.fillText('27 km · Geneva',cx,H-3);
    },
    discovery_timeline:(ctx,W,H,t)=>{
      const ms=[{y:'1983',l:'W, Z',c:'#00e5ff'},{y:'1995',l:'Top quark',c:'#ff6b35'},{y:'2000',l:'τ neutrino',c:'#69ff47'},{y:'2012',l:'Higgs',c:'#ff0080'}];
      const pad=22,cy=H/2,step=(W-pad*2)/(ms.length-1);
      ctx.strokeStyle='rgba(255,255,255,0.07)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pad,cy);ctx.lineTo(W-pad,cy);ctx.stroke();
      ms.forEach((m,i)=>{
        const x=pad+i*step,v=Math.min(1,Math.max(0,(t-i*18)/20));
        ctx.save();ctx.globalAlpha=v;ctx.fillStyle=m.c;ctx.shadowColor=m.c;ctx.shadowBlur=10;ctx.beginPath();ctx.arc(x,cy,5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
        ctx.font=`bold 9px 'DM Mono',monospace`;ctx.textAlign='center';ctx.fillText(m.y,x,i%2===0?cy-14:cy+20);
        ctx.fillStyle='rgba(138,154,181,0.85)';ctx.font=`8px 'DM Sans',sans-serif`;ctx.fillText(m.l,x,i%2===0?cy-24:cy+30);ctx.restore();
      });
    },
    beam_types:(ctx,W,H)=>{
      const types=[{l:'p — p',r1:5,r2:5,c:'#00e5ff',n:'Higgs'},{l:'p — Pb',r1:5,r2:12,c:'#ffd740',n:'Nuclear'},{l:'Pb — Pb',r1:12,r2:12,c:'#ff4081',n:'QGP'}];
      const step=W/types.length;
      types.forEach((tp,i)=>{
        const cx=step*i+step/2,cy=H/2;
        const ball=(x,y,r,cc)=>{const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba(255,255,255,0.9)');g.addColorStop(1,cc);ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();};
        ball(cx-14,cy,tp.r1,tp.c);ball(cx+14,cy,tp.r2,tp.c);
        ctx.fillStyle=tp.c;ctx.font=`bold 9px 'DM Mono',monospace`;ctx.textAlign='center';ctx.fillText(tp.l,cx,cy+22);
        ctx.fillStyle='rgba(138,154,181,0.7)';ctx.font=`7.5px 'DM Sans',sans-serif`;ctx.fillText(tp.n,cx,cy+32);
      });
    },
    energy_thresholds:(ctx,W,H)=>{
      const ps=[{n:'W',m:80.4,c:'#00e5ff'},{n:'Z',m:91.2,c:'#80deea'},{n:'H',m:125.2,c:'#ff0080'},{n:'top',m:172.6,c:'#ff6b35'}];
      const pad=26,maxM=185,bW=(W-pad*2)/ps.length-6;
      ps.forEach((p,i)=>{
        const x=pad+i*(bW+6),bH=(p.m/maxM)*(H-36),y=H-16-bH;
        const g=ctx.createLinearGradient(x,y,x,H-16);g.addColorStop(0,p.c);g.addColorStop(1,p.c+'20');
        ctx.fillStyle=g;ctx.fillRect(x,y,bW,bH);
        ctx.fillStyle=p.c;ctx.font=`bold 8px 'DM Mono',monospace`;ctx.textAlign='center';ctx.fillText(p.m+' GeV',x+bW/2,y-3);
        ctx.fillStyle='rgba(138,154,181,0.8)';ctx.font=`9px 'DM Mono',monospace`;ctx.fillText(p.n,x+bW/2,H-2);
      });
    },
    luminosity_chart:(ctx,W,H)=>{
      const levels=['10³⁰','10³¹','10³²','10³³','10³⁴'];
      const pad=18,cy=H/2,step=(W-pad*2)/(levels.length-1);
      ctx.strokeStyle='rgba(0,229,255,0.15)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(pad,cy);ctx.lineTo(W-pad,cy);ctx.stroke();
      levels.forEach((l,i)=>{
        const x=pad+i*step,r=4+i*2.2;
        ctx.fillStyle=i===4?'#00e5ff':'rgba(0,229,255,0.35)';ctx.shadowColor='#00e5ff';ctx.shadowBlur=i===4?12:0;
        ctx.beginPath();ctx.arc(x,cy,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
        ctx.fillStyle='rgba(138,154,181,0.8)';ctx.font=`8px 'DM Mono',monospace`;ctx.textAlign='center';ctx.fillText(l,x,i%2===0?cy-16:cy+20);
      });
    },
    trigger_funnel:(ctx,W,H)=>{
      const stages=[{l:'40M / sec',n:'Raw events',c:'rgba(255,255,255,0.1)',w:1},{l:'100K / sec',n:'L1 Trigger',c:'rgba(0,229,255,0.2)',w:0.6},{l:'1K / sec',n:'HLT Output',c:'#00e5ff',w:0.28}];
      stages.forEach((s,i)=>{
        const x=(W-s.w*W)*0.5,y=i*(H/3),h=H/3-4;
        ctx.fillStyle=s.c;ctx.fillRect(x,y+2,s.w*W,h);
        ctx.fillStyle=i===2?'#fff':'rgba(255,255,255,0.7)';ctx.font=`bold 8px 'DM Mono',monospace`;ctx.textAlign='center';ctx.fillText(s.l,W/2,y+h/2);
        ctx.fillStyle='rgba(138,154,181,0.7)';ctx.font=`7.5px 'DM Sans',sans-serif`;ctx.fillText(s.n,W/2,y+h/2+11);
      });
    },
    collision_flash:(ctx,W,H,t)=>{
      const phase=(t%80)/80,cx=W/2,cy=H/2;
      if(phase<0.48){
        const p=phase/0.48;
        [[0,'#00e5ff'],[W,'#ff0080']].forEach(([sx,cc])=>{
          ctx.strokeStyle=cc;ctx.lineWidth=2.5;ctx.shadowColor=cc;ctx.shadowBlur=10;
          ctx.beginPath();ctx.moveTo(sx,cy);ctx.lineTo(sx+(cx-sx)*p,cy);ctx.stroke();ctx.shadowBlur=0;
        });
      } else {
        const p=Math.min(1,(phase-0.48)/0.52);
        const flash=Math.max(0,1-(phase-0.48)*7);
        if(flash>0){const g=ctx.createRadialGradient(cx,cy,0,cx,cy,40);g.addColorStop(0,`rgba(255,255,255,${flash})`);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
        ['#00e5ff','#ff4081','#69ff47','#ffd740','#ff6b35'].forEach((cc,i)=>{
          const a=(i/5)*Math.PI*2,d=p*32;ctx.fillStyle=cc;ctx.shadowColor=cc;ctx.shadowBlur=8;
          ctx.beginPath();ctx.arc(cx+Math.cos(a)*d,cy+Math.sin(a)*d,3,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
        });
      }
    },
    xs_comparison:(ctx,W,H)=>{
      const data=[{n:'QCD Jets',p:97.8,c:'#69ff47'},{n:'W/Z',p:1.9,c:'#00e5ff'},{n:'tt̄',p:0.19,c:'#ff6b35'},{n:'Higgs',p:0.01,c:'#ff0080'}];
      const pad=8,bH=13,gap=8,lW=60,maxW=W-pad*2-lW-36;
      data.forEach((d,i)=>{
        const y=pad+i*(bH+gap);
        ctx.fillStyle='rgba(255,255,255,0.04)';ctx.fillRect(pad+lW,y,maxW,bH);
        const bW=(d.p/100)*maxW;
        const g=ctx.createLinearGradient(pad+lW,0,pad+lW+bW,0);g.addColorStop(0,d.c);g.addColorStop(1,d.c+'44');
        ctx.fillStyle=g;ctx.fillRect(pad+lW,y,bW,bH);
        ctx.fillStyle='rgba(138,154,181,0.9)';ctx.font=`9px 'DM Mono',monospace`;ctx.textAlign='right';ctx.textBaseline='middle';ctx.fillText(d.n,pad+lW-4,y+bH/2);
        ctx.fillStyle=d.c;ctx.textAlign='left';ctx.fillText(d.p+'%',pad+lW+bW+4,y+bH/2);
      });
    },
    detector_layers:(ctx,W,H)=>{
      const cx=W/2,cy=H/2,R=Math.min(cx,cy)*0.9;
      [{r:0.14,l:'Beam',c:'rgba(255,255,255,0.3)'},{r:0.28,l:'Pixel',c:'rgba(0,229,255,0.4)'},{r:0.48,l:'Strip',c:'rgba(0,229,255,0.3)'},{r:0.66,l:'ECAL',c:'rgba(255,215,64,0.45)'},{r:0.82,l:'HCAL',c:'rgba(105,255,71,0.35)'},{r:0.97,l:'Muon',c:'rgba(255,64,129,0.4)'}].forEach(l=>{
        ctx.strokeStyle=l.c;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,l.r*R,0,Math.PI*2);ctx.stroke();
        ctx.fillStyle=l.c;ctx.font=`7.5px 'DM Mono',monospace`;ctx.textAlign='left';ctx.fillText(l.l,cx+l.r*R*0.65,cy-l.r*R*0.65);
      });
    },
    feynman_legend:(ctx,W,H)=>{
      const items=[
        {l:'Fermion (quark / lepton)',c:'#00e5ff',fn:(x1,y)=>{ctx.strokeStyle='#00e5ff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x1,y);ctx.lineTo(x1+55,y);ctx.stroke();const a=x1+27;ctx.beginPath();ctx.moveTo(a,y);ctx.lineTo(a-6,y-4);ctx.moveTo(a,y);ctx.lineTo(a-6,y+4);ctx.stroke();}},
        {l:'Boson (W, Z, photon)',c:'#ffd740',fn:(x1,y)=>{ctx.strokeStyle='#ffd740';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x1,y);for(let i=1;i<=25;i++){const tt=i/25;ctx.lineTo(x1+55*tt,y+Math.sin(tt*Math.PI*5)*5);}ctx.stroke();}},
        {l:'Gluon (strong force)',c:'#ff6b35',fn:(x1,y)=>{ctx.strokeStyle='#ff6b35';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x1,y);for(let i=1;i<=25;i++){const tt=i/25;ctx.lineTo(x1+55*tt,y+Math.sin(tt*Math.PI*6)*5+Math.cos(tt*Math.PI*6)*2);}ctx.stroke();}},
      ];
      const rowH=H/(items.length+1);
      items.forEach((item,i)=>{
        const y=rowH*(i+1);ctx.save();item.fn(12,y);ctx.restore();
        ctx.fillStyle='rgba(138,154,181,0.9)';ctx.font=`8.5px 'DM Sans',sans-serif`;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(item.l,76,y);
      });
    },
    sm_table:(ctx,W,H)=>{
      const fams=[{l:'Quarks',c:'#ff6b35',p:['u','d','s','c','b','t']},{l:'Leptons',c:'#00e5ff',p:['e','μ','τ','νe','νμ','ντ']},{l:'Bosons',c:'#ffd740',p:['γ','W','Z','g','H','']}];
      const cW=W/3;
      fams.forEach((f,col)=>{
        const x=col*cW+3;ctx.fillStyle=f.c;ctx.font=`bold 8px 'DM Mono',monospace`;ctx.textAlign='left';ctx.fillText(f.l,x,11);
        f.p.forEach((name,row)=>{if(!name)return;const gy=20+row*13;ctx.fillStyle=f.c+'28';ctx.fillRect(x,gy-8,cW-6,12);ctx.fillStyle='rgba(255,255,255,0.85)';ctx.font=`italic 8px 'DM Mono',monospace`;ctx.fillText(name,x+4,gy);});
      });
    },
    particle_families:(ctx,W,H)=>{
      const items=[{l:'Quarks',s:'Strong · EM · Weak',c:'#ff6b35'},{l:'Leptons',s:'EM · Weak only',c:'#00e5ff'},{l:'Gauge Bosons',s:'Force carriers',c:'#ffd740'},{l:'Higgs',s:'Mass mechanism',c:'#ff0080'}];
      const pad=6,bH=(H-pad*2)/items.length-4;
      items.forEach((item,i)=>{
        const y=pad+i*(bH+4);
        ctx.fillStyle=item.c+'18';ctx.strokeStyle=item.c+'50';ctx.lineWidth=1;
        ctx.beginPath();if(ctx.roundRect)ctx.roundRect(pad,y,W-pad*2,bH,3);else ctx.rect(pad,y,W-pad*2,bH);ctx.fill();ctx.stroke();
        ctx.fillStyle=item.c;ctx.font=`bold 9px 'DM Mono',monospace`;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(item.l,pad+8,y+bH/2-4);
        ctx.fillStyle='rgba(138,154,181,0.75)';ctx.font=`7.5px 'DM Sans',sans-serif`;ctx.fillText(item.s,pad+8,y+bH/2+6);
      });
    },
    cms_layers:(ctx,W,H)=>{
      const cx=W/2,cy=H/2;
      [{r:0.95,c:'rgba(255,64,129,0.5)',l:'Muon'},{r:0.75,c:'rgba(105,255,71,0.45)',l:'HCAL'},{r:0.58,c:'rgba(255,215,64,0.5)',l:'ECAL'},{r:0.36,c:'rgba(0,229,255,0.45)',l:'Tracker'},{r:0.15,c:'rgba(255,255,255,0.3)',l:'Beam'}].forEach(l=>{
        const R=Math.min(cx,cy)*0.9;ctx.strokeStyle=l.c;ctx.lineWidth=1.8;ctx.beginPath();ctx.arc(cx,cy,l.r*R,0,Math.PI*2);ctx.stroke();
        ctx.fillStyle=l.c;ctx.font=`7px 'DM Mono',monospace`;ctx.textAlign='left';
        const tx=cx+l.r*R*Math.cos(-Math.PI/4)+4,ty=cy+l.r*R*Math.sin(-Math.PI/4);ctx.fillText(l.l,tx,ty);
      });
    },
    event_legend:(ctx,W,H)=>{
      const items=[{c:'#ff4081',l:'Muon track (curved)',dash:false},{c:'#00e5ff',l:'Electron track',dash:false},{c:'#69ff47',l:'Hadronic jet (cone)',dash:false},{c:'#ffd740',l:'Photon (ECAL only)',dash:true},{c:'rgba(255,255,255,0.3)',l:'Missing ET — neutrino',dash:true}];
      const rowH=H/(items.length+0.5),pad=8;
      items.forEach((item,i)=>{
        const y=pad+(i+0.5)*rowH;ctx.save();ctx.strokeStyle=item.c;ctx.lineWidth=2;ctx.shadowColor=item.c;ctx.shadowBlur=5;
        if(item.dash)ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(pad+52,y);ctx.stroke();ctx.restore();
        ctx.fillStyle='rgba(138,154,181,0.9)';ctx.font=`8px 'DM Sans',sans-serif`;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(item.l,pad+60,y);
      });
    },
    z_peak_schematic:(ctx,W,H)=>{
      const pad=14,pW=W-pad*2,pH=H-pad*2,peakX=pW*0.455;
      ctx.strokeStyle='rgba(105,255,71,0.4)';ctx.lineWidth=1.5;ctx.beginPath();
      for(let x=0;x<=pW;x++){const n=2+Math.random()*1.5;x===0?ctx.moveTo(pad+x,pad+pH-n*(pH*0.12)):ctx.lineTo(pad+x,pad+pH-n*(pH*0.12));}ctx.stroke();
      ctx.strokeStyle='#ff0080';ctx.lineWidth=2;ctx.shadowColor='#ff0080';ctx.shadowBlur=8;ctx.beginPath();
      for(let x=0;x<=pW;x++){const dx=x-peakX,s=pW*0.07,g=Math.exp(-(dx*dx)/(2*s*s));x===0?ctx.moveTo(pad+x,pad+pH-g*pH*0.72-3):ctx.lineTo(pad+x,pad+pH-g*pH*0.72-3);}ctx.stroke();ctx.shadowBlur=0;
      ctx.fillStyle='#ff0080';ctx.font=`bold 10px 'DM Mono',monospace`;ctx.textAlign='center';ctx.fillText('91.2 GeV',pad+peakX,pad+10);
      ctx.fillStyle='rgba(138,154,181,0.6)';ctx.font=`8px 'DM Mono',monospace`;ctx.fillText('Z boson resonance',pad+peakX,pad+21);
    },
    peak_accumulation:(ctx,W,H,t)=>{
      const pad=14,pW=W-pad*2,pH=H-pad*2,peakX=pW*0.455;
      const n=Math.min(80,Math.floor(t*0.75));
      for(let i=0;i<n;i++){const xi=peakX+(Math.random()-0.5)*pW*0.11+(Math.random()-0.5)*pW*0.09;const bH=3+Math.random()*7;ctx.fillStyle='rgba(255,64,129,0.22)';ctx.fillRect(pad+xi-1.5,pad+pH-bH,3,bH);}
      if(n>10){ctx.strokeStyle='#ff4081';ctx.lineWidth=1.5;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(pad+peakX,pad);ctx.lineTo(pad+peakX,pad+pH);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#ff4081';ctx.font=`bold 9px 'DM Mono',monospace`;ctx.textAlign='center';ctx.fillText('91.2 GeV',pad+peakX,pad+9);}
      ctx.fillStyle='rgba(138,154,181,0.5)';ctx.font=`8px 'DM Mono',monospace`;ctx.textAlign='center';ctx.fillText(`${n} dimuon events`,W/2,H-2);
    },
    open_data_map:(ctx,W,H)=>{
      const items=[{l:'CERN Open Data',c:'#00e5ff'},{l:'PDG 2024',c:'#ffd740'},{l:'NLO Cross-Sections',c:'#69ff47'},{l:'CC0 License',c:'#ff4081'}];
      const cols=2,cW=W/cols,rH=H/Math.ceil(items.length/cols);
      items.forEach((item,i)=>{
        const col=i%cols,row=Math.floor(i/cols),x=col*cW+4,y=row*rH+4,w=cW-8,h=rH-8;
        ctx.fillStyle=item.c+'12';ctx.strokeStyle=item.c+'35';ctx.lineWidth=1;
        ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,w,h,4);else ctx.rect(x,y,w,h);ctx.fill();ctx.stroke();
        ctx.fillStyle=item.c;ctx.font=`bold 8.5px 'DM Mono',monospace`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(item.l,x+w/2,y+h/2);
      });
    },
  };

  /* ══════════════════════════════════════════════════════════════════
     STATE
     ══════════════════════════════════════════════════════════════════ */
  let currentStep=0, isActive=false, animFrame=null, trackFrame=null, diagT=0;
  const KEY='pp_tour_v6_seen';

  /* ══════════════════════════════════════════════════════════════════
     DOM
     ══════════════════════════════════════════════════════════════════ */
  const welcomeEl=document.createElement('div');
  welcomeEl.className='tour-welcome';welcomeEl.hidden=true;
  welcomeEl.innerHTML=`
    <div class="tour-welcome__backdrop"></div>
    <div class="tour-welcome__card">
      <div class="tour-welcome__hero">
        <div class="tour-welcome__tag">Guided Tour · Particle Playground</div>
        <h2 class="tour-welcome__title">Explore the <span>subatomic world</span><br>step by step.</h2>
        <p class="tour-welcome__desc">A 17-step educational walkthrough covering particle collisions, the Standard Model, real CERN data, and how physicists discover fundamental particles. No prior knowledge required.</p>
      </div>
      <div class="tour-welcome__body">
        <div class="tour-welcome__modules">
          <div class="tour-module"><span class="tour-module__num">01–02</span><span class="tour-module__text"><strong>Introduction</strong> — LHC overview and discovery methodology</span></div>
          <div class="tour-module"><span class="tour-module__num">03–09</span><span class="tour-module__text"><strong>The Collider</strong> — beam parameters, energy, cross-sections, tracks</span></div>
          <div class="tour-module"><span class="tour-module__num">10</span><span class="tour-module__text"><strong>Feynman Diagrams</strong> — the mathematical language of particle physics</span></div>
          <div class="tour-module"><span class="tour-module__num">11–12</span><span class="tour-module__text"><strong>Particle Zoo</strong> — Standard Model and force carriers</span></div>
          <div class="tour-module"><span class="tour-module__num">13–14</span><span class="tour-module__text"><strong>Real Events</strong> — authentic CMS detector data from 2010</span></div>
          <div class="tour-module"><span class="tour-module__num">15–17</span><span class="tour-module__text"><strong>Mass Spectrum & Learning</strong> — discover the Z boson yourself</span></div>
        </div>
        <div class="tour-welcome__meta">
          <div class="tour-meta-item"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.2"/><path d="M6 3.5v3l2 1.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>8–10 minutes · Scroll freely during tour</div>
          <div class="tour-meta-item"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>Space · Arrow keys · Esc to exit</div>
        </div>
        <div class="tour-welcome__actions">
          <button class="btn btn--primary" id="tourStart">Begin Tour</button>
          <button class="tour-welcome__skip" id="tourSkipWelcome">Skip — explore independently</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(welcomeEl);

  const spotlight=document.createElement('div');
  spotlight.className='tour-spotlight';spotlight.hidden=true;
  document.body.appendChild(spotlight);

  const overlay=document.createElement('div');
  overlay.className='tour-overlay';overlay.hidden=true;
  document.body.appendChild(overlay);

  const tooltipEl=document.createElement('div');
  tooltipEl.className='tour-tooltip';tooltipEl.hidden=true;
  document.body.appendChild(tooltipEl);

  const triggerBtn=document.createElement('button');
  triggerBtn.className='tour-trigger';
  triggerBtn.innerHTML=`<span class="tour-trigger__dot"></span>Guided Tour`;
  triggerBtn.addEventListener('click',()=>{welcomeEl.hidden=false;});
  document.body.appendChild(triggerBtn);

  document.getElementById('tourStart').addEventListener('click',()=>{welcomeEl.hidden=true;startTour();});
  document.getElementById('tourSkipWelcome').addEventListener('click',()=>{welcomeEl.hidden=true;localStorage.setItem(KEY,'1');});

  /* ══════════════════════════════════════════════════════════════════
     SPOTLIGHT TRACKER — follows element during scroll
     ══════════════════════════════════════════════════════════════════ */
  function startTracking(target){
    cancelAnimationFrame(trackFrame);
    function track(){
      if(!isActive||!target){return;}
      const rect=target.getBoundingClientRect();
      updateSpotlight(rect);
      trackFrame=requestAnimationFrame(track);
    }
    trackFrame=requestAnimationFrame(track);
  }

  function updateSpotlight(rect){
    const p=10, vw=window.innerWidth, vh=window.innerHeight;
    // Only show spotlight if element is at least partially in viewport
    if(rect.bottom < -50 || rect.top > vh+50){
      spotlight.style.opacity='0';
      return;
    }
    spotlight.style.opacity='1';
    const top   = Math.max(4, rect.top - p);
    const left  = Math.max(4, rect.left - p);
    const right = Math.min(vw - 4, rect.right + p);
    const bot   = Math.min(vh - 4, rect.bottom + p);
    spotlight.style.top    = `${top}px`;
    spotlight.style.left   = `${left}px`;
    spotlight.style.width  = `${Math.max(0, right-left)}px`;
    spotlight.style.height = `${Math.max(0, bot-top)}px`;
  }

  /* ══════════════════════════════════════════════════════════════════
     ENGINE
     ══════════════════════════════════════════════════════════════════ */
  function startTour(){
    isActive=true;currentStep=0;
    overlay.hidden=false;spotlight.hidden=false;tooltipEl.hidden=false;
    spotlight.style.transition='top 0.35s cubic-bezier(0.16,1,0.3,1),left 0.35s cubic-bezier(0.16,1,0.3,1),width 0.35s cubic-bezier(0.16,1,0.3,1),height 0.35s cubic-bezier(0.16,1,0.3,1)';
    localStorage.setItem(KEY,'1');
    showStep(0);
  }

  function endTour(){
    isActive=false;
    overlay.hidden=true;spotlight.hidden=true;tooltipEl.hidden=true;
    cancelAnimationFrame(animFrame);cancelAnimationFrame(trackFrame);
  }

  function showStep(idx){
    const step=STEPS[idx];
    if(!step){endTour();return;}
    const target=document.querySelector(step.target);
    if(!target){showStep(idx+1);return;}

    // Scroll target into view — user can scroll freely after
    target.scrollIntoView({behavior:'smooth',block:'center'});

    setTimeout(()=>{
      // Start live tracking
      startTracking(target);
      renderTooltip(step,idx,target);
    },420);
  }

  function renderTooltip(step,idx,target){
    const isLast=idx===STEPS.length-1;
    const dots=STEPS.map((_,i)=>`<div class="tour-dot${i<idx?' done':i===idx?' active':''}"></div>`).join('');
    const hasVis=step.visual&&VISUALS[step.visual];

    tooltipEl.innerHTML=`
      <div class="tour-card">
        <div class="tour-card__bar"></div>
        <div class="tour-card__header">
          <div>
            <div class="tour-card__step">${step.section}</div>
            <div class="tour-card__title">${step.title}</div>
          </div>
          <button class="tour-card__close" id="tourClose">✕</button>
        </div>
        ${hasVis?`<div class="tour-card__visual"><canvas id="tourVC" height="96"></canvas></div>`:''}
        <div class="tour-card__body">
          <p class="tour-card__text">${step.text}</p>
          ${step.formula?`<div class="tour-card__formula">${step.formula}</div>`:''}
          ${step.insight?`<div class="tour-card__insight"><div class="tour-card__insight-label">${step.insight.label}</div><div class="tour-card__insight-text">${step.insight.text}</div></div>`:''}
        </div>
        <div class="tour-card__footer">
          <div class="tour-card__progress">${dots}</div>
          ${idx>0?`<button class="tour-btn-prev" id="tourPrev">Back</button>`:''}
          <button class="tour-btn-next" id="tourNext">${isLast?'Finish':'Continue'}</button>
        </div>
        <div class="tour-card__kb">
          <span class="tour-kb-key">Space</span> or <span class="tour-kb-key">→</span> Next &nbsp;·&nbsp;
          <span class="tour-kb-key">←</span> Back &nbsp;·&nbsp;
          <span class="tour-kb-key">Esc</span> Exit
        </div>
      </div>`;

    document.getElementById('tourClose').addEventListener('click',endTour);
    document.getElementById('tourNext').addEventListener('click',()=>{
      if(idx>=STEPS.length-1)endTour();else{currentStep++;showStep(currentStep);}
    });
    const pb=document.getElementById('tourPrev');
    if(pb)pb.addEventListener('click',()=>{currentStep--;showStep(currentStep);});

    // Position tooltip relative to target
    const tW=step.width||340;
    tooltipEl.style.width=`${tW}px`;
    const rect=target.getBoundingClientRect();
    smartPosition(rect,tW);

    // Also reposition on scroll
    window.addEventListener('scroll',()=>{
      if(!isActive)return;
      const r=target.getBoundingClientRect();
      smartPosition(r,tW);
    },{passive:true});

    // Visual animation
    cancelAnimationFrame(animFrame);diagT=0;
    if(hasVis){
      const vc=document.getElementById('tourVC');
      if(vc){
        vc.width=vc.offsetWidth||tW;
        const vctx=vc.getContext('2d');
        (function loop(){
          vctx.clearRect(0,0,vc.width,vc.height);
          VISUALS[step.visual](vctx,vc.width,vc.height,diagT);
          diagT++;animFrame=requestAnimationFrame(loop);
        })();
      }
    }
  }

  function smartPosition(targetRect,tW){
    const vw=window.innerWidth, vh=window.innerHeight;
    const tH=460, mg=14;
    let top,left,placed=false;

    // Try RIGHT
    if(targetRect.right+tW+mg<vw-mg){left=targetRect.right+mg;top=Math.max(mg,Math.min(targetRect.top,vh-tH-mg));placed=true;}
    // Try LEFT
    if(!placed&&targetRect.left-tW-mg>mg){left=targetRect.left-tW-mg;top=Math.max(mg,Math.min(targetRect.top,vh-tH-mg));placed=true;}
    // Try BELOW
    if(!placed&&targetRect.bottom+tH+mg<vh){top=targetRect.bottom+mg;left=Math.max(mg,Math.min(targetRect.left+targetRect.width/2-tW/2,vw-tW-mg));placed=true;}
    // Try ABOVE
    if(!placed&&targetRect.top-tH-mg>mg){top=targetRect.top-tH-mg;left=Math.max(mg,Math.min(targetRect.left+targetRect.width/2-tW/2,vw-tW-mg));placed=true;}
    // Fallback
    if(!placed){left=Math.max(mg,vw-tW-mg);top=Math.max(mg,Math.min(vh/2-tH/2,vh-tH-mg));}

    left=Math.max(mg,Math.min(left,vw-tW-mg));
    top =Math.max(mg,Math.min(top,vh-tH-mg));
    tooltipEl.style.top =`${top}px`;
    tooltipEl.style.left=`${left}px`;
  }

  /* ── Keyboard ─────────────────────────────────────────────────── */
  document.addEventListener('keydown',e=>{
    if(!isActive)return;
    if(e.key==='ArrowRight'||e.key===' '||e.key==='Enter'){
      e.preventDefault();
      if(currentStep<STEPS.length-1){currentStep++;showStep(currentStep);}else endTour();
    }
    if(e.key==='ArrowLeft'&&currentStep>0){e.preventDefault();currentStep--;showStep(currentStep);}
    if(e.key==='Escape')endTour();
  });

  window.addEventListener('resize',()=>{
    if(!isActive)return;
    const t=document.querySelector(STEPS[currentStep].target);
    if(t){const r=t.getBoundingClientRect();smartPosition(r,STEPS[currentStep].width||340);}
  });

  window.addEventListener('load',()=>{
    if(!localStorage.getItem(KEY))setTimeout(()=>{welcomeEl.hidden=false;},1400);
  });
})();
