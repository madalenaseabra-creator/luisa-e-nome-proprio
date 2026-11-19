/* Medidas dos quadros · Luísa é nome próprio
 *
 * Papel: formato ISO 216 (A6, A5, A4).
 * A medida exterior (com moldura) depende da largura da moldura
 * e do passe-partout — ainda a confirmar com a Pim e o moldureiro.
 *
 * TODO (Pim / moldureiro): quando houver números, preencher
 *   outer: {w: …, h: …}  em centímetros.
 * O site (configurador, resumo, loja e diagrama) actualiza-se sozinho.
 */
const SIZES = {
  A6: { id: 'A6', paper: {w: 10.5, h: 14.8}, outer: null, preview: {w: 112, h: 158, mat: 18} },
  A5: { id: 'A5', paper: {w: 14.8, h: 21}, outer: null, preview: {w: 158, h: 224, mat: 24} },
  A4: { id: 'A4', paper: {w: 21, h: 29.7}, outer: null, preview: {w: 200, h: 283, mat: 30} }
};
const SIZE_ORDER = ['A6', 'A5', 'A4'];

function cmPt(n){
  return String(n).replace('.', ',');
}
function sizePaperLabel(s){
  return cmPt(s.paper.w) + ' × ' + cmPt(s.paper.h) + ' cm';
}
function sizeOuterLabel(s){
  return s.outer ? (cmPt(s.outer.w) + ' × ' + cmPt(s.outer.h) + ' cm') : 'a confirmar';
}
