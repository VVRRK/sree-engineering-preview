/* ===== SREE ENGINEERING — Shared JS ===== */
(function(){
  /* NAV */
  var nav=document.getElementById('nav');
  var burger=document.getElementById('burger');
  var mobileMenu=document.getElementById('mobileMenu');
  if(nav){window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>40);});}
  if(burger&&mobileMenu){burger.addEventListener('click',function(){mobileMenu.classList.toggle('open');});mobileMenu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mobileMenu.classList.remove('open');});});}
  var yearEl=document.getElementById('year');if(yearEl)yearEl.textContent=new Date().getFullYear();

  /* THEME TOGGLE */
  var toggle=document.getElementById('themeToggle');
  var stored=localStorage.getItem('sree-theme');
  if(stored){document.documentElement.dataset.theme=stored;}
  if(toggle){toggle.addEventListener('click',function(){
    var cur=document.documentElement.dataset.theme==='light'?'dark':'light';
    document.documentElement.dataset.theme=cur;
    localStorage.setItem('sree-theme',cur);
    window.dispatchEvent(new CustomEvent('themechange',{detail:{theme:cur}}));
  });}

  /* REVEAL */
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.12,rootMargin:'0px 0px -60px 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  /* CONTACT FORM */
  var form=document.getElementById('enquiryForm');
  if(form){
    var success=document.getElementById('formSuccess');
    var TO='info@sreeengineering.co.in';
    function isEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);}
    function isPhone(v){return /^[+]?[\d\s\-()]{7,16}$/.test(v);}
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var ok=true,f={};
      ['name','company','email','phone','requirement','location','service','message'].forEach(function(n){
        f[n]=form.elements[n].value.trim();
        form.elements[n].parentElement.classList.remove('invalid');
      });
      if(form.elements['website'].value)return;
      if(!f.name){form.elements.name.parentElement.classList.add('invalid');ok=false;}
      if(!isEmail(f.email)){form.elements.email.parentElement.classList.add('invalid');ok=false;}
      if(!isPhone(f.phone)){form.elements.phone.parentElement.classList.add('invalid');ok=false;}
      if(!f.message){form.elements.message.parentElement.classList.add('invalid');ok=false;}
      if(!ok)return;
      var svc=f.service||'General Enquiry';
      var subj='New Website Enquiry | SREE ENGINEERING | '+svc+' | '+f.name;
      var dt=new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'});
      var body=['New Website Enquiry','','Name: '+f.name,'Company: '+(f.company||'\u2014'),
        'Email: '+f.email,'Phone: '+f.phone,'Project / Requirement: '+(f.requirement||'\u2014'),
        'Location: '+(f.location||'\u2014'),'Service Required: '+svc,'Message: '+f.message,
        'Date & Time: '+dt].join('\n');
      var ENDPOINT=''; // set to your form backend URL for automatic delivery
      if(ENDPOINT){
        fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)})
          .then(function(r){if(r.ok)show();else mailto(subj,body);}).catch(function(){mailto(subj,body);});
      }else{mailto(subj,body);}
    });
    function mailto(s,b){window.open('mailto:'+TO+'?subject='+encodeURIComponent(s)+'&body='+encodeURIComponent(b),'_blank');show();}
    function show(){form.style.display='none';success.style.display='block';success.scrollIntoView({behavior:'smooth',block:'center'});}
    form.querySelectorAll('input,select,textarea').forEach(function(el){el.addEventListener('input',function(){e'invalid');ok=false;}
    remove('invalid');});});
  }
})();
