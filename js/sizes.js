/* Medidas dos quadros · Luísa é nome próprio
 *
 * Medidas da moldura: A5, A4, A3 (formato A).
 * O campo "paper" guarda a medida da moldura (nome mantido por compatibilidade).
 */
const SIZES = {
  A5: { id: 'A5', paper: {w: 14.8, h: 21}, outer: null, preview: {w: 112, h: 158, mat: 18} },
  A4: { id: 'A4', paper: {w: 21, h: 29.7}, outer: null, preview: {w: 158, h: 224, mat: 24} },
  A3: { id: 'A3', paper: {w: 29.7, h: 42}, outer: null, preview: {w: 200, h: 283, mat: 30} }
};
const SIZE_ORDER = ['A5', 'A4', 'A3'];

function cmPt(n){
  return String(n).replace('.', ',');
}
function sizePaperLabel(s){
  return cmPt(s.paper.w) + ' × ' + cmPt(s.paper.h) + ' cm';
}
function sizeOuterLabel(s){
  return sizePaperLabel(s);
}
