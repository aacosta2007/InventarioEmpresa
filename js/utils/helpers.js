export function formatCurrency(v){
  return Number(v).toLocaleString('es-CO',{style:'currency',currency:'COP'});
}

export function q(sel){return document.querySelector(sel);}
export function qAll(sel){return Array.from(document.querySelectorAll(sel));}
