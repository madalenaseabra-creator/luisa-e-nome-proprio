/* Galeria · lightbox, revelar ao fazer scroll, parallax suave. Respeita prefers-reduced-motion. */
(()=>{const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const lb=document.getElementById('lb'),img=document.getElementById('lbimg'),cap=document.getElementById('lbcap');let cur=0,last=null;
function show(i){cur=(i+GI.length)%GI.length;img.src=GI[cur].src;img.alt=cap.textContent=GI[cur].cap}
function open(i){last=document.activeElement;show(i);lb.hidden=false;document.body.style.overflow='hidden';document.getElementById('lbx').focus()}
function close(){lb.hidden=true;document.body.style.overflow='';last&&last.focus()}
document.querySelectorAll('[data-i]').forEach(el=>{if(el.tagName==='BUTTON')el.onclick=()=>open(+el.dataset.i)});
document.getElementById('lbx').onclick=close;document.getElementById('lbp').onclick=()=>show(cur-1);document.getElementById('lbn').onclick=()=>show(cur+1);
lb.onclick=e=>{if(e.target===lb)close()};
addEventListener('keydown',e=>{if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
let sx=null;lb.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
lb.addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40)show(cur+(dx<0?1:-1));sx=null});
const figs=[...document.querySelectorAll('.gf')];
if(RM||!('IntersectionObserver' in window)){figs.forEach(f=>f.classList.add('in'));return}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
figs.forEach(f=>io.observe(f));
let tick=false;function par(){const h=innerHeight;figs.forEach((f,k)=>{const r=f.getBoundingClientRect();if(r.bottom<0||r.top>h)return;const p=(r.top+r.height/2-h/2)/h;f.querySelector('img').style.transform=`translateY(${(p*(k%2?-18:18)).toFixed(1)}px) scale(1.08)`});tick=false}
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(par)}},{passive:true});par();
})();
