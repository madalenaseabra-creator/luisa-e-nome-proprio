(()=>{const b=document.getElementById('menuBtn'),m=document.getElementById('mnav');if(!b||!m)return;
b.onclick=()=>{const o=m.hidden;m.hidden=!o;b.setAttribute('aria-expanded',o);b.textContent=o?'Fechar':'Menu';document.body.classList.toggle('menu-open',o)};
m.querySelectorAll('a').forEach(a=>a.onclick=()=>{m.hidden=true;b.textContent='Menu';document.body.classList.remove('menu-open')})})();
