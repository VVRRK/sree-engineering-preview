// SREE ENGINEERING V6 - main.js
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
  // Contact form -> Netlify Forms (AJAX) with inline success message
  var form=document.getElementById('quoteForm');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var btn=document.getElementById('submitBtn');
      var orig=btn?btn.innerHTML:'';
      if(btn){btn.innerHTML='Sending\u2026';btn.disabled=true;}
      var enc=new URLSearchParams();
      new FormData(form).forEach(function(v,k){enc.append(k,v);});
      enc.append('form-name','enquiry');
      fetch(window.location.pathname,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:enc.toString()})
        .then(function(r){
          if(!r.ok){throw new Error('HTTP '+r.status);}
          form.innerHTML='<div style="text-align:center;padding:44px 12px;">'
            +'<div style="font-size:44px;line-height:1;color:#FF6A00;">\u2713</div>'
            +'<h3 style="margin:18px 0 10px;">Enquiry Received.</h3>'
            +'<p class="fs">Thank you \u2014 your project details have reached us. We will respond with a structured approach, typically within one working day. For anything urgent, write to <a href="mailto:info@sreeengineering.co.in">info@sreeengineering.co.in</a>.</p>'
            +'</div>';
        })
        .catch(function(){
          if(btn){btn.innerHTML=orig;btn.disabled=false;}
          alert('Sorry \u2014 something went wrong sending your enquiry. Please email us directly at info@sreeengineering.co.in');
        });
    });
  }
});
