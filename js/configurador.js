/* Configurador · Luísa é nome próprio (protótipo) */
// ⚠️ PLACEHOLDER: preços por definir com a Pim. Enquanto PRICES for null, mostra "preço em breve".
// Exemplo do formato esperado (NÃO são preços reais):
// const PRICES = { base:{A5:0,A4:0,A3:0}, premium:{A5:0,A4:0,A3:0}, personalizada:0 };
const PRICES = null; // TODO: preços da Pim

const LEAD = { normal: 'até 1 mês', premium: '3 a 4 meses' };
/* SIZES e sizePaperLabel / sizeOuterLabel vêm de js/sizes.js */
/* CATALOG, PAPERS e COLS vêm do HTML gerado */

const q = new URLSearchParams(location.search);

function paperIds(){
  return (typeof PAPERS !== 'undefined' ? PAPERS : []).map(p => p.id);
}
function paperById(id){
  const list = typeof PAPERS !== 'undefined' ? PAPERS : [];
  return list.find(p => p.id === id) || { id: 'luisa', n: 'A Luísa pode escolher', file: '' };
}
function paperTex(id){
  const p = paperById(id);
  return 'assets/' + (p.file || 'tex-branco.jpg');
}
function pickSize(){
  const raw = q.get('t') || q.get('size');
  return (typeof SIZE_ORDER !== 'undefined' && SIZE_ORDER.includes(raw)) ? raw : 'A5';
}
function pickPaper(){
  const raw = q.get('p') || q.get('paper');
  return paperIds().includes(raw) ? raw : 'luisa';
}
function pickCat(){
  const raw = q.get('cid') || q.get('f');
  const list = typeof CATALOG !== 'undefined' ? CATALOG : [];
  if(raw == null || raw === '') return list.length > 1 ? 1 : 0;
  const byId = list.findIndex(c => c.id === raw);
  if(byId >= 0) return byId;
  const n = +raw;
  if(Number.isInteger(n) && n >= 0 && n < list.length) return n;
  return list.length > 1 ? 1 : 0;
}
function pickFtype(){
  if(q.get('ft') === 'pers') return 'pers';
  if(q.get('ft') === 'cat') return 'cat';
  if(q.get('txt')) return 'pers';
  return 'cat';
}

const S = {
  size: pickSize(),
  paper: pickPaper(),
  col: +(q.get('c') ?? 0) % 6,
  mold: q.get('m') === 'premium' ? 'premium' : 'normal',
  ftype: pickFtype(),
  f: pickCat(),
  txt: q.get('txt') || '',
  nasc: { nome: '', peso: '', data: '', hora: '' }
};

function catItem(){
  const list = typeof CATALOG !== 'undefined' ? CATALOG : [];
  return list[S.f] || list[0] || { id: '', title: '', fill: '', kind: 'text', m: '', g: '' };
}
function nascLines(){
  return [
    S.nasc.nome || 'nome',
    S.nasc.peso || 'peso',
    S.nasc.data || 'data de nascimento',
    S.nasc.hora || 'hora'
  ];
}

const $ = s => document.querySelector(s);
function price(){
  if(!PRICES) return 'preço em breve';
  let v = PRICES[S.mold==='premium'?'premium':'base'][S.size] + (S.ftype==='pers'?PRICES.personalizada:0);
  return v.toLocaleString('pt-PT',{style:'currency',currency:'EUR'});
}
function setTyped(el, lines, quoted){
  el.textContent = '';
  el.classList.toggle('multi', lines.length > 1);
  if(lines.length > 1){
    lines.forEach(ln => {
      const span = document.createElement('span');
      span.className = 'ln';
      span.textContent = ln;
      el.appendChild(span);
    });
  } else {
    const t = lines[0] || 'a tua frase';
    el.textContent = quoted ? '“' + t + '”' : t;
  }
  const sm = document.createElement('small');
  sm.textContent = 'pré-visualização tipográfica · a Luísa escreve-a à mão';
  el.appendChild(sm);
}
function render(){
  document.querySelectorAll('#o-size .opt').forEach(o => o.classList.toggle('on', o.dataset.v === S.size));
  document.querySelectorAll('.size-diag .sd').forEach(el => el.classList.toggle('on', el.dataset.s === S.size));
  document.querySelectorAll('#o-paper .opt').forEach(o => o.classList.toggle('on', o.dataset.v === S.paper));
  document.querySelectorAll('#o-col .sw').forEach(o => o.classList.toggle('on', +o.dataset.c === S.col));
  document.querySelectorAll('#o-mold .opt').forEach(o => o.classList.toggle('on', o.dataset.v === S.mold));
  document.querySelectorAll('#o-ftype .opt').forEach(o => o.classList.toggle('on', o.dataset.v === S.ftype));
  document.querySelectorAll('#o-phr .opt').forEach(o => o.classList.toggle('on', +o.dataset.i === S.f));

  const item = catItem();
  const isNasc = S.ftype === 'cat' && item.kind === 'nasc';
  const phr = $('#o-phr');
  if(phr) phr.style.display = S.ftype === 'cat' ? '' : 'none';
  const custom = $('#custom');
  if(custom) custom.classList.toggle('show', S.ftype === 'pers');
  const nasc = $('#nasc');
  if(nasc) nasc.classList.toggle('show', isNasc);

  const sz = SIZES[S.size], z = sz.preview, c = COLS[S.col], fr = $('#fr'), ppr = $('#ppr');
  const k = innerWidth < 700 ? .7 : 1;
  fr.style.setProperty('--fc', c.h);
  fr.querySelector('.mat').style.setProperty('--mat', (z.mat * k) + 'px');
  fr.classList.toggle('premium', S.mold === 'premium');
  const real = $('#real'); if(real) real.hidden = S.mold !== 'premium';
  ppr.style.setProperty('--pw', (z.w * k) + 'px'); ppr.style.setProperty('--ph', (z.h * k) + 'px');
  $('#pv').style.setProperty('--wall', c.n === 'Branco' ? '#D8C9B6' : '#EAD7CE');

  const ink = $('#ink'), typed = $('#typed');
  ppr.style.backgroundImage = `url(${paperTex(S.paper)})`;

  if(S.ftype === 'cat' && item.kind === 'hw'){
    ink.className = 'hw ' + item.m;
    ink.hidden = false;
    typed.hidden = true;
    typed.classList.remove('multi');
  } else {
    ink.hidden = true;
    typed.hidden = false;
    if(isNasc){
      setTyped(typed, nascLines(), false);
    } else if(S.ftype === 'cat'){
      setTyped(typed, [item.fill || item.title], true);
    } else {
      const raw = S.txt || '';
      if(raw.includes('\n')) setTyped(typed, raw.split('\n'), false);
      else setTyped(typed, [raw || 'a tua frase'], true);
    }
  }

  const pap = paperById(S.paper);
  const surprise = S.paper === 'luisa';
  const pvpp = $('#pv-pp');
  if(pvpp) pvpp.hidden = !surprise;
  $('#pv-sz').textContent = 'Pré-visualização · ' + sz.id + ' · moldura ' + sizePaperLabel(sz);
  $('#pv-pm').textContent = S.mold === 'premium' ? 'Premium · papel feito à mão' : 'Normal · metal';

  $('#s-size').textContent = sz.id + ' · ' + sizePaperLabel(sz);
  $('#s-paper').textContent = pap.n + (surprise ? ' · surpresa' : '');
  $('#s-col').innerHTML = `<span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${c.h};vertical-align:-2px;margin-right:8px;border:1px solid rgba(0,0,0,.2)"></span>${c.n}`;
  $('#s-mold').textContent = S.mold === 'premium' ? 'Premium · moldura em papel, feita à mão' : 'Normal · metal';
  if(S.ftype === 'cat'){
    if(isNasc){
      const nome = S.nasc.nome;
      $('#s-fr').textContent = 'Catálogo · nascimento' + (nome ? ' · ' + nome : '');
    } else {
      $('#s-fr').textContent = 'Catálogo · “' + item.title + '”';
    }
  } else {
    const short = (S.txt || '…').split('\n')[0];
    $('#s-fr').textContent = 'Personalizada · “' + short + '”';
  }
  $('#s-lead').textContent = LEAD[S.mold];
  $('#s-price').textContent = price();
  const mini = $('#mini');
  if(mini){
    mini.style.setProperty('--fc', c.h);
    mini.classList.toggle('premium', S.mold === 'premium');
    $('#mb-lead').textContent = 'Prazo: ' + LEAD[S.mold];
    $('#mb-txt').textContent = sz.id + ' · ' + pap.n + ' · ' + c.n + ' · ' + (S.mold === 'premium' ? 'Premium' : 'Normal') + ' · ' + price();
  }
}

document.querySelectorAll('#o-size .opt').forEach(o => o.onclick = e => { e.preventDefault(); S.size = o.dataset.v; render(); });
document.querySelectorAll('#o-paper .opt').forEach(o => o.onclick = e => { e.preventDefault(); S.paper = o.dataset.v; render(); });
document.querySelectorAll('#o-col .sw').forEach(o => o.onclick = e => { e.preventDefault(); S.col = +o.dataset.c; render(); });
document.querySelectorAll('#o-mold .opt').forEach(o => o.onclick = e => { if(e.target.closest('a.see')) return; e.preventDefault(); S.mold = o.dataset.v; render(); });
document.querySelectorAll('#o-ftype .opt').forEach(o => o.onclick = e => { e.preventDefault(); S.ftype = o.dataset.v; render(); });
document.querySelectorAll('#o-phr .opt').forEach(o => o.onclick = e => { e.preventDefault(); S.f = +o.dataset.i; render(); });

const txt = $('#txt');
if(txt){
  txt.value = S.txt;
  txt.oninput = e => { S.txt = e.target.value; render(); };
}
['nome','peso','data','hora'].forEach(k => {
  const el = $('#n-' + k);
  if(!el) return;
  el.value = S.nasc[k];
  el.oninput = e => { S.nasc[k] = e.target.value; render(); };
});
document.querySelectorAll('#ideas button').forEach(b => b.onclick = () => {
  const kind = b.dataset.k;
  const i = +b.dataset.i;
  if(kind === 'nasc'){
    S.ftype = 'cat';
    S.f = i;
    render();
    const box = $('#nasc');
    if(box) box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  const item = (typeof CATALOG !== 'undefined' && CATALOG[i]) || null;
  S.ftype = 'pers';
  S.txt = (item && item.fill) || b.dataset.fill || b.textContent;
  if(txt) txt.value = S.txt;
  render();
});
const go = $('#go');
if(go) go.onclick = () => { const t = $('#toast'); t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 3500); };
function syncNavOffset(){
  const nav = document.querySelector('nav.top');
  const inner = document.querySelector('.side .inner');
  if(!nav || !inner || innerWidth < 700) return;
  const h = Math.round(nav.getBoundingClientRect().height);
  if(h > 0) inner.style.setProperty('--nav-offset', h + 'px');
}
addEventListener('resize', () => { syncNavOffset(); render(); });
syncNavOffset();
render();

