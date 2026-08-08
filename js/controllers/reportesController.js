import InventarioService from '../services/InventarioService.js';
import AuthService from '../services/AuthService.js';

export function initReportes(){
  const check = AuthService.requireRole('admin');
  if (!check.ok){
    alert('Acceso denegado. Sólo administradores.');
    window.location.href = './dashboard.html';
    return;
  }

  const productos = InventarioService.getAll();
  const movimientos = InventarioService.getMovimientos();

  // Total valor inventario
  const totalValor = productos.reduce((s,p)=>s + (Number(p.precio || 0) * Number(p.stock || 0)),0);
  document.getElementById('total-valor').textContent = totalValor.toFixed(2);

  // Productos con stock bajo
  const low = productos.filter(p => Number(p.stock) <= Number(p.stockMinimo));
  const lowList = document.getElementById('stock-bajo-list');
  lowList.innerHTML = low.map(p=>`<li class="py-1">${p.nombre} — ${p.stock} (mín ${p.stockMinimo})</li>`).join('') || '<li class="py-1 text-neutral-400">— No hay productos con stock bajo —</li>';

  // Productos más movidos (por cantidad total movida)
  const moveMap = {};
  movimientos.forEach(m=>{ moveMap[m.productoId] = (moveMap[m.productoId]||0) + Number(m.cantidad); });
  const sorted = Object.entries(moveMap).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const topList = document.getElementById('top-movidos');
  topList.innerHTML = sorted.map(([id,cnt])=>{
    const p = productos.find(x=>x.id===id) || {nombre:'(eliminado)'};
    return `<li class="py-1">${p.nombre} — ${cnt}</li>`;
  }).join('') || '<li class="py-1 text-neutral-400">— Sin movimientos —</li>';

  // Productos por categoría (simple)
  const cats = InventarioService.getCategorias();
  const byCat = {};
  productos.forEach(p=>{ const key = p.categoriaId || 'Sin categoría'; byCat[key] = (byCat[key]||0) + 1; });
  const catList = document.getElementById('por-categoria');
  catList.innerHTML = Object.entries(byCat).map(([cid,count])=>{
    const label = cid === 'Sin categoría' ? 'Sin categoría' : (cats.find(c=>c.id===cid)?.nombre || '(eliminada)');
    return `<li class="py-1">${label} — ${count}</li>`;
  }).join('');
}
