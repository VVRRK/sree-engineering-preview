/* ===== 400/132 kV AIS Substation — Scroll-Driven 3D Construction ===== */
(function(){
  var section=document.getElementById('substation-section');
  var canvas=document.getElementById('substation-canvas');
  if(!window.THREE||!section||!canvas)return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile=window.innerWidth<760;
  var renderer,scene,camera,rafId,visible=false;
  var stages=[],labels=[];
  var energyItems=[];

  /* materials — light engineering palette */
  var M={
    porc:new THREE.MeshStandardMaterial({color:0xe8e1d4,roughness:.28,metalness:.06}),
    porcDark:new THREE.MeshStandardMaterial({color:0xcfc7b6,roughness:.3,metalness:.06}),
    steel:new THREE.MeshStandardMaterial({color:0xb0b4b8,metalness:.8,roughness:.3}),
    steelDark:new THREE.MeshStandardMaterial({color:0x787c80,metalness:.7,roughness:.35}),
    alu:new THREE.MeshStandardMaterial({color:0xd0d4d8,metalness:.85,roughness:.2}),
    tank:new THREE.MeshStandardMaterial({color:0x5e646a,metalness:.5,roughness:.5}),
    tankTop:new THREE.MeshStandardMaterial({color:0x4a5056,metalness:.45,roughness:.55}),
    fin:new THREE.MeshStandardMaterial({color:0x6a7076,metalness:.45,roughness:.5}),
    concrete:new THREE.MeshStandardMaterial({color:0xaaa8a4,roughness:.92,metalness:.05}),
    concreteDark:new THREE.MeshStandardMaterial({color:0x7a7874,roughness:.92,metalness:.05}),
    panel:new THREE.MeshStandardMaterial({color:0x767a7e,metalness:.55,roughness:.4}),
    panelDark:new THREE.MeshStandardMaterial({color:0x363a3e,metalness:.4,roughness:.5}),
    copper:new THREE.MeshStandardMaterial({color:0xb8843f,metalness:.85,roughness:.3}),
    cable:new THREE.MeshStandardMaterial({color:0x1e1e1e,roughness:.85,metalness:.1}),
    energy:new THREE.MeshBasicMaterial({color:0xff6a00,transparent:true,opacity:0}),
    pulse:new THREE.MeshBasicMaterial({color:0xffd23f,transparent:true,opacity:0}),
    glow:new THREE.MeshBasicMaterial({color:0xff8c33,transparent:true,opacity:0}),
    fire:new THREE.MeshStandardMaterial({color:0x9a9892,roughness:.95,metalness:.05}),
  };

  /* helpers */
  function cyl(r1,r2,h,m,seg){return new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,seg||10),m);}
  function box(w,h,d,m){return new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);}
  function sph(r,m){return new THREE.Mesh(new THREE.SphereGeometry(r,10,10),m);}
  function tor(r,t,m){return new THREE.Mesh(new THREE.TorusGeometry(r,t,8,20),m);}
  function grp(){return new THREE.Group();}
  /* porcelain insulator stack */
  function insulator(h,discs,mat){
    mat=mat||M.porc;var g=grp();var seg=h/discs;
    var core=cyl(.13,.17,h,M.porcDark,8);core.position.y=h/2;g.add(core);
    for(var i=0;i<discs;i++){
      var shed=cyl(.3,.3,seg*.4,mat,10);shed.position.y=seg*(i+.5);g.add(shed);
    }
    return g; /* base at y=0 */
  }

  function init(){
    renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:!isMobile,alpha:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,isMobile?1.5:2));
    renderer.setSize(window.innerWidth,window.innerHeight);
    scene=new THREE.Scene();
    var i}
 ght=document.documentElement.dataset.theme==='light';
    scene.fog=new THREE.FogExp2(i}
 ght?0xe8e8ec:0x0a0a0a,.016);

    scene.add(new THREE.AmbientLight(0x909094,.6));
    var key=new THREE.DirectionalLight(0xffffff,.8);key.position.set(10,18,12);scene.add(key);
    var rim=new THREE.DirectionalLight(0xdde6f0,.3);rim.position.set(-12,8,-10);scene.add(rim);
    var warm=new THREE.PointLight(0xff6a00,.3,40);warm.position.set(0,6,4);scene.add(warm);

    camera=new THREE.PerspectiveCamera(46,window.innerWidth/window.innerHeight,.1,200);

    /* ground */
    var ground=new THREE.Mesh(new THREE.PlaneGeometry(70,70),new THREE.MeshStandardMaterial({color:i}
 ght?0xccccc0:0x141414,roughness:.95,metalness:.05}));
    ground.rotation.x=-Math.PI/2;ground.position.y=-.05;scene.add(ground);
    var grid=new THREE.GridHelper(50,25,i}
 ght?0x666666:0x333333,i}
 ght?0xcccccc:0x1e1e1e);grid.material.transparent=true;grid.material.opacity=.35;scene.add(grid);

    /* build all equipment groups */
    buildSitePrep();buildEarthing();buildPortals();buildBusbar();buildWaveTrap();
    buildCVT();buildLA();buildCT();buildCB();buildIsolator();buildTransformer();buildPanels();buildEnergy();

    stages.forEach(function(s){scene.add(s.group);s.group.visible=false;});
    resetAll();
  }

  /* ===== Stage 1: Site prep ===== */
  function buildSitePrep(){
    var g=grp();
    var pad=box(9,.3,7,M.concrete);pad.position.y=.15;g.add(pad);
    var plinth=box(5.5,.25,3.2,M.concreteDark);plinth.position.set(4,.42,-2);g.add(plinth);
    var pad2=box(4,.2,3,M.concrete);pad2.position.set(-5,.4,-6);g.add(pad2);
    var trench1=box(8,.1,.5,M.concreteDark);trench1.position.set(0,.36,3);g.add(trench1);
    var trench2=box(.5,.1,10,M.concreteDark);trench2.position.set(7,.36,-1);g.add(trench2);
    /* corner markers */
    [[-4,-3.2],[4,-3.2],[-4,3.2],[4,3.2]].forEach(function(p){
      var mk=cyl(.06,.06,.35,8,M.copper);mk.position.set(p[0],.2,p[1]);g.add(mk);
    });
    stages.push({group:g,anim:'riseY'});
  }

  /* ===== Stage 2: Earthing grid ===== */
  function buildEarthing(){
    var g=grp();
    var strips=[[-7,0,14],[7,0,14],[0,-10,12],[0,10,12]];
    strips.forEach(function(s){var st=box(s[2],.04,.12,M.copper);st.position.set(s[0],.03,s[1]);g.add(st);});
    var v1=box(.12,.04,8,M.copper);v1.position.set(-5,.03,-1);g.add(v1);
    var v2=box(.12,.04,8,M.copper);v2.position.set(5,.03,-1);g.add(v2);
    /* riser rods */
    [[-5,-5],[5,-5],[-5,3],[5,3]].forEach(function(p){
      var rod=box(.08,2,.08,M.copper);rod.position.set(p[0],1,p[1]);g.add(rod);
    });
    stages.push({group:g,anim:'fade'});
  }

  /* ===== Stage 3: Portal structures ===== */
  function buildPortals(){
    var g=grp();
    var colH=8;
    [[-8,-6],[8,-6],[-8,3],[8,3]].forEach(function(p){
      var col=box(.5,colH,.5,M.steel);col.position.set(p[0],colH/2,p[1]);g.add(col);
      /* lattice suggestion */
      for(var k=1;k<5;k++){var rung=box(.35,.06,.06,M.steelDark);rung.position.set(p[0],k*1.6,p[1]);g.add(rung);}
    });
    var beam1=box(17,.6,.4,M.steel);beam1.position.set(0,colH-.3,-6);g.add(beam1);
    var beam2=box(17,.6,.4,M.steel);beam2.position.set(0,colH-.3,3);g.add(beam2);
    stages.push({group:g,anim:'riseY'});
  }

  /* ===== Stage 4: Busbar + post insulators ===== */
  function buildBusbar(){
    var g=grp();
    /* post insulators on portal beams */
    var pos=[[ -6,-6],[-2,-6],[2,-6],[6,-6]];
    pos.forEach(function(p){var pi=insulator(1.0,3);pi.position.set(p[0],8,p[1]);g.add(pi);});
    /* tubular bus */
    var bus=cyl(.08,.08,15.5,M.alu,8);bus.rotation.z=Math.PI/2;bus.position.set(0,9,-6);g.add(bus);
    /* 132 kV bus (lower) */
    var bus132=cyl(.06,.06,12,M.alu,8);bus132.rotation.z=Math.PI/2;bus132.position.set(1,5.5,3);g.add(bus132);
    var pi132a=insulator(.8,2);pi132a.position.set(-4,4.8,3);g.add(pi132a);
    var pi132b=insulator(.8,2);pi132b.position.set(6,4.8,3);g.add(pi132b);
    stages.push({group:g,anim:'scaleX'});
  }

  /* ===== Stage 5: Wave trap ===== */
  function buildWaveTrap(){
    var g=grp();
    var base=insulator(2.0,6);base.position.set(-5,0,-14);g.add(base);
    var coil=cyl(.5,.5,2.2,M.alu,12);coil.position.set(-5,3.1,-14);g.add(coil);
    var topRing=tor(.6,.04,M.steel);topRing.rotation.x=Math.PI/2;topRing.position.set(-5,4.3,-14);g.add(topRing);
    var cap=sph(.35,M.steel);cap.position.set(-5,4.3,-14);g.add(cap);
    /* tuning device */
    var tdBase=insulator(1.2,4);tdBase.position.set(-4,0,-14);g.add(tdBase);
    var td=cyl(.22,.22,.8,M.steel,8);td.position.set(-4,1.6,-14);g.add(td);
    stages.push({group:g,anim:'scale'});
  }

  /* ===== Stage 6: CVT (Capacitor Voltage Transformer) ===== */
  function buildCVT(){
    var g=grp();
    var base=insulator(2.5,7);base.position.set(-5,0,-12.5);g.add(base);
    var cap1=cyl(.32,.32,.9,M.porc,10);cap1.position.set(-5,2.95,-12.5);g.add(cap1);
    var cap2=cyl(.3,.3,.85,M.porc,10);cap2.position.set(-5,3.85,-12.5);g.add(cap2);
    var emUnit=box(.5,.45,.5,M.steel);emUnit.position.set(-5,4.5,-12.5);g.add(emUnit);
    var topTerm=cyl(.1,.1,.3,M.copper,6);topTerm.position.set(-5,4.9,-12.5);g.add(topTerm);
    stages.push({group:g,anim:'scale'});
  }

  /* ===== Stage 7: 
 ghtning Arrester (Surge Arrester) ===== */
  function buildLA(){
    var g=grp();
    var stack=insulator(3.2,9);stack.position.set(-5,0,-11.2);g.add(stack);
    /* metal flange rings */
    for(var i=0;i<4;i++){var fl=tor(.2,.03,M.steelDark);fl.rotation.x=Math.PI/2;fl.position.set(-5,.8+i*.8,-11.2);g.add(fl);}
    var corona=tor(.4,.025,M.alu);corona.rotation.x=Math.PI/2;corona.position.set(-5,3.4,-11.2);g.add(corona);
    var topCap=sph(.12,M.steel);topCap.position.set(-5,3.45,-11.2);g.add(topCap);
    var counter=box(.25,.2,.15,M.steelDark);counter.position.set(-5,.25,-11.0);g.add(counter);
    /* second LA */
    var stack2=insulator(3.2,9);stack2.position.set(-5,0,-10.6);g.add(stack2);
    var corona2=tor(.4,.025,M.alu);corona2.rotation.x=Math.PI/2;corona2.position.set(-5,3.4,-10.6);g.add(corona2);
    stages.push({group:g,anim:'scale'});
  }

  /* ===== Stage 8: Current Transformer (CT) ===== */
  function buildCT(){
    var g=grp();
    var stack=insulator(4.0,11);stack.position.set(-5,0,-10);g.add(stack);
    var topBox=box(.45,.35,.45,M.steel);topBox.position.set(-5,4.2,-10);g.add(topBox);
    var term1=cyl(.06,.06,.25,M.copper,6);term1.position.set(-5+.2,4.5,-10);g.add(term1);
    var term2=cyl(.06,.06,.25,M.copper,6);term2.position.set(-5-.2,4.5,-10);g.add(term2);
    var baseBox=box(.7,.5,.7,M.steelDark);baseBox.position.set(-5,.3,-10);g.add(baseBox);
    stages.push({group:g,anim:'scale'});
  }

  /* ===== Stage 9: SF6 Circuit Breaker ===== */
  function buildCB(){
    var g=grp();
    var plinth=box(1.2,.3,1.2,M.concrete);plinth.position.set(-5,.15,-8.5);g.add(plinth);
    var baseBox=box(.7,.5,.7,M.steelDark);baseBox.position.set(-5,.55,-8.5);g.add(baseBox);
    var support=insulator(3.0,8);support.position.set(-5,.8,-8.5);g.add(support);
    var head=box(.9,.25,.9,M.steel);head.position.set(-5,4.15,-8.5);g.add(head);
    /* two-arm interrupter (T shape) */
    var arm1=cyl(.22,.22,2.0,M.porc,10);arm1.rotation.z=Math.PI/2;arm1.position.set(-5-1.1,4.7,-8.5);g.add(arm1);
    var arm2=cyl(.22,.22,2.0,M.porc,10);arm2.rotation.z=Math.PI/2;arm2.position.set(-5+1.1,4.7,-8.5);g.add(arm2);
    var cap1=sph(.28,M.steel);cap1.position.set(-5-2.1,4.7,-8.5);g.add(cap1);
    var cap2=sph(.28,M.steel);cap2.position.set(-5+2.1,4.7,-8.5);g.add(cap2);
    var corona1=tor(.45,.03,M.alu);corona1.rotation.x=Math.PI/2;corona1.position.set(-5-2.1,4.7,-8.5);g.add(corona1);
    var corona2=tor(.45,.03,M.alu);corona2.rotation.x=Math.PI/2;corona2.position.set(-5+2.1,4.7,-8.5);g.add(corona2);
    stages.push({group:g,anim:'scale'});
  }

  /* ===== Stage 10: Isolator with Earth Switch ===== */
  function buildIsolator(){
    var g=grp();
    var post1=insulator(3.6,10);post1.position.set(-5-1.1,0,-7);g.add(post1);
    var post2=insulator(3.6,10);post2.position.set(-5+1.1,0,-7);g.add(post2);
    var blade=box(2.2,.08,.25,M.alu);blade.position.set(-5,3.7,-7);g.add(blade);
    var contact=box(.3,.2,.3,M.copper);contact.position.set(-5+1.1,3.7,-7);g.add(contact);
    /* earth switch */
    var esPost=insulator(1.5,5);esPost.position.set(-5,0,-6.6);g.add(esPost);
    var esBlade=box(1.8,.05,.12,M.steelDark);esBlade.position.set(-5,1.55,-6.8);esBlade.rotation.z=-.3;g.add(esBlade);
    var baseBox=box(2,.3,.5,M.concrete);baseBox.position.set(-5,.15,-7);g.add(baseBox);
    stages.push({group:g,anim:'scale'});
  }

  /* ===== Stage 11: 400/132 kV Power Transformer ===== */
  function buildTransformer(){
    var g=grp();
    /* plinth */
    var plinth=box(5.5,.4,3.6,M.concreteDark);plinth.position.set(4,.4,-1);g.add(plinth);
    /* main tank */
    var tank=box(4.5,2.8,2.8,M.tank);tank.position.set(4,2,-1);g.add(tank);
    var tankTop=box(4.7,.2,3.0,M.tankTop);tankTop.position.set(4,3.5,-1);g.add(tankTop);
    /* radiators — 3 banks each side */
    for(var s=-1;s<=1;s+=2){
      for(var b=0;b<3;b++){
        var radBox=box(.15,2,.5,M.fin);radBox.position.set(4+s*2.35,2,-1+.8*(b-1));g.add(radBox);
        for(var f=0;f<4;f++){var fin=box(.04,1.8,.4,M.fin);fin.position.set(4+s*(2.35+.05+f*.04),2,-1+.8*(b-1));g.add(fin);}
        var pipe1=cyl(.05,.05,.5,M.steel,6);pipe1.position.set(4+s*2.3,3.2,-1+.8*(b-1));g.add(pipe1);
        var pipe2=cyl(.05,.05,.5,M.steel,6);pipe2.position.set(4+s*2.3,.8,-1+.8*(b-1));g.add(pipe2);
      }
    }
    /* HV bushings (400 kV — tall) facing north */
    for(var i=0;i<3;i++){
      var hv=insulator(3.8,12);hv.position.set(4-1.2+i*1.2,3.6,-1-1.0);g.add(hv);
      var hvCap=sph(.18,M.steel);hvCap.position.set(4-1.2+i*1.2,7.5,-1-1.0);g.add(hvCap);
    }
    /* MV bushings (132 kV — shorter) facing south */
    for(var i=0;i<3;i++){
      var mv=insulator(2.2,8);mv.position.set(4-1+i*1,3.6,-1+1.0);g.add(mv);
      var mvCap=sph(.14,M.steel);mvCap.position.set(4-1+i*1,5.9,-1+1.0);g.add(mvCap);
    }
    /* conservator tank */
    var cons=cyl(.45,.45,3.5,M.tankTop,10);cons.rotation.z=Math.PI/2;cons.position.set(4,4.2,-1-1.4);g.add(cons);
    /* OLTC */
    var oltc=box(.6,1.2,.8,M.panelDark);oltc.position.set(4-2.4,1.8,-1);g.add(oltc);
    /* fire wall */
    var wall=box(7,6,.35,M.fire);wall.position.set(4,3,-1+2.2);g.add(wall);
    /* nameplate */
    var plate=box(.4,.25,.02,M.panelDark);plate.position.set(4,2.5,.42);g.add(plate);
    stages.push({group:g,anim:'slide'});
  }

  /* ===== Stage 12: Control & Relay Panels ===== */
  function buildPanels(){
    var g=grp();
    for(var i=0;i<4;i++){
      var panel=box(1.1,2.2,.65,M.panel);panel.position.set(8+i*1.3,1.3,4);g.add(panel);
      var door=box(1.0,.05,.02,M.panelDark);door.position.set(8+i*1.3,1.5,4.34);g.add(door);
      /* indicator lights */
      for(var l=0;l<3;l++){var lt=sph(.05,new THREE.MeshStandardMaterial({color:0xff6a00,emissive:0xff6a00,emissiveIntensity:.5}));lt.position.set(8+i*1.3-.2+l*.2,2.7,4.35);g.add(lt);}
    }
    stages.push({group:g,anim:'scale'});
  }

  /* ===== Stage 13: Energization — connections + glow ===== */
  function buildEnergy(){
    var g=grp();
    /* jumper from isolator to 400 kV bus */
    var j1=cyl(.04,.04,4.0,M.cable,6);j1.rotation.x=.15;j1.position.set(-5,5.8,-6.5);g.add(j1);
    /* jumper from bus to transformer HV bushings */
    var j2=cyl(.04,.04,6,M.cable,6);j2.rotation.z=.5;j2.position.set(0,7,-3);g.add(j2);
    var j3=cyl(.04,.04,4,M.cable,6);j3.position.set(2,5.5,-1);g.add(j3);
    /* MV connections from transformer to 132 kV bus */
    var j4=cyl(.03,.03,3,M.cable,6);j4.position.set(4,4.2,1);g.add(j4);
    var j5=cyl(.03,.03,3,M.cable,6);j5.position.set(2,4.5,2);g.add(j5);
    /* glow at HV bushing tops */
    for(var i=0;i<3;i++){
      var glow=sph(.3,M.glow.clone());glow.position.set(4-1.2+i*1.2,7.5,-2);g.add(glow);
      energyItems.push({mesh:glow,base:7.5});
    }
    /* energy pulses along bus */
    for(var i=0;i<5;i++){
      var pulse=sph(.08,M.pulse.clone());g.add(pulse);
      energyItems.push({mesh:pulse,isPulse:true,t:i/5});
    }
    stages.push({group:g,anim:'fade'});
  }

  function resetAll(){
    stages.forEach(function(s){
      var g=s.group;g.visible=false;
      if(s.anim==='riseY'){g.scale.y=0;}
      else if(s.anim==='scaleX'){g.scale.x=0;}
      else if(s.anim==='scale'){g.scale.set(0,0,0);}
      else if(s.anim==='slide'){g.position.x=20;}
      /* fade and others: just visible toggle */
    });
  }

  /* camera keyframes per stage — [x,y,z, targetX,targetY,targetZ] */
  var CK=[
    [0,26,30, 0,2,0],      /* 1 overview */
    [10,6,14, 0,.5,0],     /* 2 earthing */
    [16,10,6, 0,6,-6],     /* 3 portals */
    [0,12,8, 0,8,-6],      /* 4 busbar */
    [-10,5,-8, -5,3,-14],  /* 5 wave trap */
    [-10,5,-6, -5,3,-12.5],/* 6 CVT */
    [-10,5,-4, -5,3,-11],  /* 7 LA */
    [-10,6,-2, -5,4,-10],  /* 8 CT */
    [-10,6,0, -5,4,-8.5],  /* 9 CB */
    [-10,5,2, -5,3.5,-7],  /* 10 isolator */
    [14,7,6, 4,4,-1],      /* 11 transformer */
    [8,5,11, 10,2,4],      /* 12 panels */
    [0,16,26, 0,3,-2],     /* 13 energize overview */
  ];

  function lerp(a,b,t){return a+(b-a)*t;}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  function rg(t,a,b){return clamp((t-a)/(b-a),0,1);}
  function eoc(t){return 1-Math.pow(1-t,3);}

  function update(p){
    /* p: 0..1 overall scroll progress */
    var nstages=stages.length;
    /* equipment reveal */
    for(var i=0;i<nstages;i++){
      var s=stages[i];
      var sStart=i/nstages;
      var sEnd=(i+1)/nstages;
      var localP=clamp((p-sStart)/(sEnd-sStart),0,1);
      var reveal=eoc(localP);
      if(reveal>.01){
        s.group.visible=true;
        if(s.anim==='riseY'){s.group.scale.y=reveal;}
        else if(s.anim==='scaleX'){s.group.scale.x=reveal;}
        else if(s.anim==='scale'){s.group.scale.setScalar(reveal);}
        else if(s.anim==='slide'){s.group.position.x=20*(1-reveal);}
      }
    }
    /* energy pulses — only after final stage starts */
    var ep=eoc(rg(p,(nstages-1)/nstages,1));
    if(ep>.05){
      energyItems.forEach(function(e){
        if(e.isPulse){
          e.t+=.012;if(e.t>1)e.t=0;
          e.mesh.position.set(lerp(-7,7,e.t),9,-6);
          e.mesh.material.opacity=ep*Math.sin(e.t*Math.PI)*.9;
        }else if(e.mesh.geometryinvaameters.radius>.2){
          e.mesh.material.opacity=ep*.5;
        }
      });
    }else{
      energyItems.forEach(function(e){e.mesh.material.opacity=0;});
    }
    /* camera interpolation between keyframes */
    var cf=p*(CK.length-1);
    var ci=Math.floor(cf);
    var cf2=clamp(cf-ci,0,1);
    var k0=CK[Math.min(ci,CK.length-1)];
    var k1=CK[Math.min(ci+1,CK.length-1)];
    /* smooth easing on camera */
    var ce=eoc(cf2);
    var cx=lerp(k0[0],k1[0],ce);
    var cy=lerp(k0[1],k1[1],ce);
    var cz=lerp(k0[2],k1[2],ce);
    /* during energization, add slow orbit */
    if(p>.92){
      var ang=(p-.92)*Math.PI*4;
      cx=Math.sin(ang)*24;cz=Math.cos(ang)*24;cy=16;
    }
    camera.position.set(cx,cy,cz);
    var tx=lerp(k0[3],k1[3],ce);
    var ty=lerp(k0[4],k1[4],ce);
    var tz=lerp(k0[5],k1[5],ce);
    camera.lookAt(tx,ty,tz);
    renderer.render(scene,camera);
  }

  var STAGE_DATA=[
    [0,'01','Site Prepvaation & Foundations','Civil works: equipment plinths, cable trenches and the switchyard platform take shape.'],
    [.0769,'02','Earthing System','A buried earthing grid with risers ensures every structure and tank is safely grounded.'],
    [.1538,'03','Portal Structures','Galvanized steel portals and beams are erected to carry the 400 kV busbar system.'],
    [.2307,'04','Busbar & Post Insulators','Post insulators fitted and tubular aluminium busbars strung across the portals.'],
    [.3076,'05','Wave Trap (Line Trap)','Blocks power-line carrier signals from entering the switchyard while letting power flow.'],
    [.3846,'06','Capacitor Voltage Transformer (CVT)','Steps down 400 kV for measurement, protection relays and carrier communication.'],
    [.4615,'07','Surge / 
 ghtning Arrester','Zinc-oxide arresters protect equipment from l ghtning and switching surges.'],
    [.5384,'08','Current Transformer (CT)','Scales line current down for protection relays and metering.'],
    [.6153,'09','SF6 Circuit Breaker','420 kV SF6 breakers interrupt fault current within milliseconds.'],
    [.6923,'10','Isolator with Earth Switch','Rotary isolators provide visible isolation; earth switches ground de-energized sections.'],
    [.7692,'11','400/132 kV Power Transformer','The heart of the substation: stepping 400 kV down to 132 kV with OLTC, radiators and fire wall.'],
    [.8461,'12','Control & Relay Panels','Protection, supervision and SCADA panels bring the switchyard to life.'],
    [.9230,'13','Testing & Energization','Pre-commissioning tests complete — the substation is charged, and power flows.'],
  ];
  var labelEl=document.getElementById('stage-name');
  var numEl=document.getElementById('stage-num');
  var descEl=document.getElementById('stage-desc');
  var segEls=document.querySelectorAll('.stage-seg');

  function tick(){
    rafId=requestAnimationFrame(tick);
    if(!visible)return;
    var rect=section.getBoundingClientRect();
    var sh=section.offsetHeight-window.innerHeight;
    var p=clamp(-rect.top/sh,0,1);
    if(!reduce)update(p);else update(p>.05?1:0);
    /* update labels */
    var sd=STAGE_DATA[0];
    for(var i=0;i<STAGE_DATA.length;i++){if(p>=STAGE_DATA[i][0])sd=STAGE_DATA[i];}
    if(numEl)numEl.textContent='Stage '+sd[1]+' / 13';
    if(labelEl)labelEl.textContent=sd[2];
    if(descEl)descEl.textContent=sd[3];
    if(segEls){
      var stageIdx=pvaseInt(sd[1])-1;
      segEls.forEach(function(el,i){e'iclassList.toggle('done',i<=stageIdx);});
    }
  }
  window.addEventListener('resize',function(){
    if(!renderer)return;
    camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
  });
  /* theme change — update fog color */
  window.addEventListener('themechange',function(e){
    if(!scene)return;
    var i}
 ght=e.detail.theme==='light';
    scene.fog.color.set(i}
 ght?0xe8e8ec:0x0a0a0a);
  });
  var obs=new IntersectionObserver(function(e){visible=e[0].isIntersecting;if(visible)tick();else cancelAnimationFrame(rafId);},{threshold:0});
  obs.observe(section);
  try{init();tick();}catch(err){console.warn('Substation scene disabled:',err);canvas.style.display='none';}
})();
