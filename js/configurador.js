/* Configurador · Luísa é nome próprio (protótipo) */
// ⚠️ PLACEHOLDER: preços por definir com a Pim. Enquanto PRICES for null, mostra "preço em breve".
// Exemplo do formato esperado (NÃO são preços reais):
// const PRICES = { base:{A5:0,A4:0,A3:0}, premium:{A5:0,A4:0,A3:0}, personalizada:0 };
const PRICES = null; // TODO: preços da Pim

const LEAD = { normal: 'até 1 mês', premium: '3 a 4 meses' };
/* SIZES e sizePaperLabel / sizeOuterLabel vêm de js/sizes.js */
const PAPER = { 'Branco':'tex-branco.jpg','Kraft':'tex-kraft.jpg','Ocre (kraft mate)':'tex-ocre.jpg' };
const q = new URLSearchParams(location.search);
const S = {
  size: (typeof SIZE_ORDER!=='undefined' && SIZE_ORDER.includes(q.get('t'))) ? q.get('t') : 'A5',
  col: +(q.get('c') ?? 0) % 6,
  mold: q.get('m') === 'premium' ? 'premium' : 'normal',
  ftype: q.get('ft') === 'pers' ? 'pers' : 'cat',
  f: +(q.get('f') ?? 1) % 5,
  txt: q.get('txt') || ''
};
const $ = s => document.querySelector(s);
function price(){
  if(!PRICES) return 'preço em breve';
  let v = PRICES[S.mold==='premium'?'premium':'base'][S.size] + (S.ftype==='pers'?PRICES.personalizada:0);
  return v.toLocaleString('pt-PT',{style:'currency',currency:'EUR'});
}
function render(){
  document.querySelectorAll('#o-size .opt').forEach(o=>o.classList.toggle('on',o.dataset.v===S.size));
  document.querySelectorAll('.size-diag .sd').forEach(el=>el.classList.toggle('on',el.dataset.s===S.size));
  document.querySelectorAll('#o-col .sw').forEach(o=>o.classList.toggle('on',+o.dataset.c===S.col));
  document.querySelectorAll('#o-mold .opt').forEach(o=>o.classList.toggle('on',o.dataset.v===S.mold));
  document.querySelectorAll('#o-ftype .opt').forEach(o=>o.classList.toggle('on',o.dataset.v===S.ftype));
  document.querySelectorAll('#o-phr .opt').forEach(o=>o.classList.toggle('on',+o.dataset.i===S.f));
  $('#o-phr').style.display = S.ftype==='cat' ? '' : 'none';
  $('#custom').classList.toggle('show', S.ftype==='pers');
  // preview
  const sz = SIZES[S.size], z = sz.preview, c = COLS[S.col], fr = $('#fr'), ppr = $('#ppr');
  const k = innerWidth < 700 ? .7 : 1;
  fr.style.setProperty('--fc', c.h);
  fr.querySelector('.mat').style.setProperty('--mat', (z.mat*k)+'px');
  fr.classList.toggle('premium', S.mold==='premium');
  const real=$('#real'); if(real) real.hidden = S.mold!=='premium';
  ppr.style.setProperty('--pw', (z.w*k)+'px'); ppr.style.setProperty('--ph', (z.h*k)+'px');
  $('#pv').style.setProperty('--wall', c.n==='Branco' ? '#D8C9B6' : '#EAD7CE');
  const ink = $('#ink'), typed = $('#typed');
  if(S.ftype==='cat'){
    const p = PIECES[S.f];
    ink.className = 'hw '+p.m; ink.hidden = false; typed.hidden = true; typed.classList.remove('multi');
    ppr.style.backgroundImage = `url(assets/${PAPER[p.paper]})`;
  } else {
    ink.hidden = true; typed.hidden = false;
    typed.textContent = '';
    typed.style.fontSize = '';
    typed.classList.toggle('multi', !!(S.txt && S.txt.includes('\n')));
    if(S.txt && S.txt.includes('\n')){
      S.txt.split('\n').forEach(ln=>{
        const span=document.createElement('span');
        span.className='ln';
        span.textContent=ln;
        typed.appendChild(span);
      });
    } else {
      typed.textContent = '“'+(S.txt || 'a tua frase')+'”';
    }
    const sm=document.createElement('small'); sm.textContent='pré-visualização tipográfica · a Luísa escreve-a à mão'; typed.appendChild(sm);
    ppr.style.backgroundImage = 'url(assets/tex-branco.jpg)';
  }
  $('#pv-sz').textContent = 'Pré-visualização · '+sz.id+' · moldura '+sizePaperLabel(sz);
  $('#pv-pm').textContent = S.mold==='premium' ? 'Premium · papel feito à mão' : 'Normal · metal';
  // summary
  $('#s-size').textContent = sz.id + ' · ' + sizePaperLabel(sz);
  $('#s-col').innerHTML = `<span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${c.h};vertical-align:-2px;margin-right:8px;border:1px solid rgba(0,0,0,.2)"></span>${c.n}`;
  $('#s-mold').textContent = S.mold==='premium' ? 'Premium · moldura em papel, feita à mão' : 'Normal · metal';
  $('#s-fr').textContent = S.ftype==='cat' ? `Catálogo · “${PIECES[S.f].t}”` : `Personalizada · “${S.txt || '…'}”`;
  $('#s-lead').textContent = LEAD[S.mold];
  $('#s-price').textContent = price();
  const mini=$('#mini'); if(mini){mini.style.setProperty('--fc',c.h);mini.classList.toggle('premium',S.mold==='premium');
  $('#mb-lead').textContent='Prazo: '+LEAD[S.mold];$('#mb-txt').textContent=sz.id+' · moldura '+sizePaperLabel(sz)+' · '+c.n+' · '+(S.mold==='premium'?'Premium':'Normal')+' · '+price();}
}
document.querySelectorAll('#o-size .opt').forEach(o=>o.onclick=e=>{e.preventDefault();S.size=o.dataset.v;render()});
document.querySelectorAll('#o-col .sw').forEach(o=>o.onclick=e=>{e.preventDefault();S.col=+o.dataset.c;render()});
document.querySelectorAll('#o-mold .opt').forEach(o=>o.onclick=e=>{if(e.target.closest('a.see'))return;e.preventDefault();S.mold=o.dataset.v;render()});
document.querySelectorAll('#o-ftype .opt').forEach(o=>o.onclick=e=>{e.preventDefault();S.ftype=o.dataset.v;render()});
document.querySelectorAll('#o-phr .opt').forEach(o=>o.onclick=e=>{e.preventDefault();S.f=+o.dataset.i;render()});
$('#txt').value = S.txt;
$('#txt').oninput = e=>{S.txt=e.target.value;render()};
document.querySelectorAll('.ideas button').forEach(b=>b.onclick=()=>{S.txt=b.dataset.fill||b.textContent;$('#txt').value=S.txt;render()});
$('#go').onclick=()=>{const t=$('#toast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3500)};
addEventListener('resize',render);
render();
