// SREE ENGINEERING V5 - main.js
(function(){'use strict';})();
document.addEventListener('DOMContentLoaded',function(){
  // Nav shadow on scroll
  var nav=document.getElementById('nav');
  if(nav){var sh=function(){window.scrollY>8?nav.classList.add('scrolled'):nav.classList.remove('scrolled')};window.addEventListener('scroll',sh,{passive:true});sh();}
  // Mobile menu
  var burger=document.getElementById('burger'),mm=document.getElementById('mobileMenu');
  if(burger&&mm){burger.addEventListener('click',function(){burger.classList.toggle('open');mm.classList.toggle('open');});
    mm.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){burger.classList.remove('open');mm.classList.remove('open');});});}
  // Reveal on scroll
  var revs=document.querySelectorAll('.reveal');
  if(revs.length){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.1,rootMargin:'0px 0px -50px 0px'});revs.forEach(function(el){io.observe(el);});}
  // Hero parallax (subtle)
  var hi=document.querySelector('.hero-img img');
  if(hi){window.addEventListener('scroll',function(){var s=window.scrollY;if(s<window.innerHeight){hi.style.transform='scale(1.06) translateY('+(s*.18)+'px)';}},{passive:true});}
  // Year
  var y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();
  // Contact form -> mailto with specified subject format
  var form=document.getElementById('quoteForm');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var d=new FormData(form);
      var g=function(k){return (d.get(k)||'').toString().trim()};
      var name=g('name')||'Website Visitor';
      var svc=g('service')||'General Enquiry';
      var subj='New Website Enquiry | SREE ENGINEERING | '+svc+' | '+name;
      var now=new Date();
      var dt=now.toLocaleString('en-IN',{timeZone:'Asia/Kolkata',dateStyle:'medium',timeStyle:'short'});
      var body='NEW WEBSITE ENQUIRY\n\n'+
        'Name: '+g('name')+'\n'+
        'Company: '+g('company')+'\n'+
        'Email: '+g('email')+'\n'+
        'Phone: '+g('phone')+'\n'+
        'Project / Requirement: '+g('requirement')+'\n'+
        'Location: '+g('location')+'\n'+
        'Service Required: '+g('service')+'\n'+
        'Message: '+g('message')+'\n'+
        'Date & Time: '+dt+'\n';
      window.location.href='mailto:info@sreeengineering.co.in?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(body);
      var btn=document.getElementById('submitBtn');
      if(btn){btn.innerHTML='Opening Email Client...';setTimeout(function(){btn.innerHTML='REQUEST A QUOTE';},4000);}
    });
  }
});
