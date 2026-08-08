import InventarioService from '../services/InventarioService.js';
import AuthService from '../services/AuthService.js';

export function initDashboard(){
  // protección básica
  const check = AuthService.requireRole(['admin','empleado']);
  if (!check.ok){
    alert('Acceso denegado');
    window.location.href = './login.html';
    return;
  }
  const productos = InventarioService.getAll();
  const movimientos = InventarioService.getMovimientos();
  document.getElementById('total-productos').textContent = productos.length;
  const stockBajo = productos.filter(p => p.stock <= p.stockMinimo).length;
  document.getElementById('stock-bajo').textContent = stockBajo;
  const hoy = new Date().toISOString().slice(0,10);
  const movHoy = movimientos.filter(m => m.fecha.slice(0,10) === hoy).length;
  document.getElementById('movimientos-hoy').textContent = movHoy;
}
