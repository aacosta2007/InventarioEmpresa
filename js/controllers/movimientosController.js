import InventarioService from '../services/InventarioService.js';
import AuthService from '../services/AuthService.js';

export function initMovimientos(){
  const check = AuthService.requireRole(['admin','empleado']);
  if (!check.ok){
    alert('Acceso denegado');
    window.location.href = './login.html';
    return;
  }
  const session = AuthService.getSession();
  const listEl = document.getElementById('movimientos-tbody');
  const form = document.getElementById('movimiento-form');
  const msg = document.getElementById('movimiento-msg');

  function render(){
    listEl.innerHTML = '';
    const movimientos = InventarioService.getMovimientos();
    const productos = InventarioService.getAll();

    if (!movimientos.length){
      listEl.innerHTML = '<tr class="table-empty-row"><td colspan="6">Aún no hay movimientos registrados.</td></tr>';
      return;
    }

    movimientos.slice().reverse().forEach(m=>{
      const tr = document.createElement('tr');
      const prod = productos.find(p=>p.id===m.productoId) || {nombre:'(eliminado)'};
      const tipoBadge = m.tipo === 'entrada'
        ? '<span class="badge badge-ok">Entrada</span>'
        : '<span class="badge badge-warn">Salida</span>';
      tr.innerHTML = `
        <td>${new Date(m.fecha).toLocaleString()}</td>
        <td>${tipoBadge}</td>
        <td>${prod.nombre}</td>
        <td>${m.cantidad}</td>
        <td>${m.usuarioId}</td>
        <td>${m.nota||''}</td>
      `;
      listEl.appendChild(tr);
    });
  }

  function showMsg(text){
    if (!msg) return alert(text);
    msg.textContent = text;
    msg.classList.remove('hidden');
    setTimeout(()=>{ msg.classList.add('hidden'); }, 4000);
  }

  if (form){
    const select = form.productoId;
    const productos = InventarioService.getAll();
    productos.forEach(p=>{
      const opt = document.createElement('option');
      opt.value = p.id; opt.textContent = `${p.nombre} (stock: ${p.stock})`;
      select.appendChild(opt);
    });
    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      try{
        InventarioService.addMovimiento({
          productoId: form.productoId.value,
          tipo: form.tipo.value,
          cantidad: Number(form.cantidad.value),
          usuarioId: session.username,
          nota: form.nota.value
        });
        form.reset();
        render();
      }catch(err){
        showMsg(err.message);
      }
    });
  }

  render();
}
