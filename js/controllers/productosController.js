import InventarioService from '../services/InventarioService.js';
import AuthService from '../services/AuthService.js';

export function initProductos(){
  const check = AuthService.requireRole(['admin','empleado']);
  if (!check.ok){
    alert('Acceso denegado');
    window.location.href = './login.html';
    return;
  }
  const session = AuthService.getSession();
  const table = document.getElementById('productos-tbody');
  const form = document.getElementById('producto-form');
  const selectCat = form?.categoriaId;
  const btnAddCat = document.getElementById('btn-add-categoria');
  const inputCatName = document.getElementById('categoria-nombre');

  function renderCategories(){
    const cats = InventarioService.getCategorias();
    if (!selectCat) return;
    selectCat.innerHTML = '<option value="">-- Categoría --</option>' + cats.map(c=>`<option value="${c.id}">${c.nombre}</option>`).join('');
  }

  function render(filteredList){
    table.innerHTML = '';
    const list = Array.isArray(filteredList) ? filteredList : InventarioService.getAll();

    if (!list.length){
      table.innerHTML = '<tr class="table-empty-row"><td colspan="7">No se encontraron productos.</td></tr>';
      return;
    }

    list.forEach(p=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-medium text-slate-800">${p.nombre}</td>
        <td>$${Number(p.precio).toFixed(2)}</td>
        <td>${p.stock}</td>
        <td>${p.stockMinimo}</td>
        <td class="text-slate-500">${p.descripcion || '—'}</td>
        <td>${p.stock <= p.stockMinimo ? '<span class="stock-low">Bajo</span>' : '<span class="badge badge-ok">OK</span>'}</td>
        <td>
          ${session.role==='admin' ? `<button data-id="${p.id}" class="edit-btn link-action">Editar</button>` : '<span class="text-slate-400">—</span>'}
          ${session.role==='admin' ? `<button data-id="${p.id}" class="delete-btn link-action link-action-danger">Eliminar</button>` : ''}
        </td>
      `;
      table.appendChild(tr);
    });
    // attach handlers
    table.querySelectorAll('.delete-btn').forEach(b=>{
      b.addEventListener('click', (e)=>{
        const id = e.target.dataset.id;
        // show modal confirmation
        showDeleteModal(id, ()=>{ InventarioService.deleteProducto(id); render(); });
      });
    });

    table.querySelectorAll('.edit-btn').forEach(b=>{
      b.addEventListener('click', (e)=>{
        const id = e.target.dataset.id;
        openEditModal(id);
      });
    });
  }

  // Modal helpers
  const modal = document.getElementById('modal-edit');
  const editForm = document.getElementById('edit-form');
  let editingId = null;

  function openEditModal(id){
    const prod = InventarioService.getById(id);
    if (!prod) return alert('Producto no encontrado');
    editingId = id;
    // fill form
    editForm.nombre.value = prod.nombre;
    editForm.precio.value = prod.precio;
    editForm.stock.value = prod.stock;
    editForm.stockMinimo.value = prod.stockMinimo;
    editForm.categoriaId.value = prod.categoriaId || '';
    editForm.descripcion.value = prod.descripcion || '';
    // fill categorias select in modal
    const sel = editForm.categoriaId;
    const cats = InventarioService.getCategorias();
    sel.innerHTML = '<option value="">-- Categoría --</option>' + cats.map(c=>`<option value="${c.id}">${c.nombre}</option>`).join('');
    if (prod.categoriaId) sel.value = prod.categoriaId;
    modal.classList.remove('hidden');
  }

  function closeEditModal(){
    editingId = null;
    modal.classList.add('hidden');
  }

  document.getElementById('edit-cancel')?.addEventListener('click', ()=>closeEditModal());

  if (editForm){
    editForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      if (!editingId) return;
      const patch = {
        nombre: editForm.nombre.value,
        precio: Number(editForm.precio.value),
        stock: Number(editForm.stock.value),
        stockMinimo: Number(editForm.stockMinimo.value),
        categoriaId: editForm.categoriaId.value || null,
        descripcion: editForm.descripcion.value
      };
      try{
        InventarioService.updateProducto(editingId, patch);
        closeEditModal();
        render();
      }catch(err){
        alert(err.message);
      }
    });
  }

  function showDeleteModal(id, onConfirm){
    // simple confirm using modal dialog (reuse browser confirm if modal UI not implemented)
    if (!document.getElementById('confirm-delete-modal')){
      if (confirm('Confirmar eliminación?')){ onConfirm(); }
      return;
    }
    const md = document.getElementById('confirm-delete-modal');
    md.classList.remove('hidden');
    const yes = md.querySelector('.confirm-yes');
    const no = md.querySelector('.confirm-no');
    const cleanup = ()=>{ md.classList.add('hidden'); yes.removeEventListener('click', onYes); no.removeEventListener('click', onNo); };
    const onYes = ()=>{ onConfirm(); cleanup(); };
    const onNo = ()=>{ cleanup(); };
    yes.addEventListener('click', onYes);
    no.addEventListener('click', onNo);
  }

  if (btnAddCat){
    btnAddCat.addEventListener('click', ()=>{
      const name = inputCatName.value.trim();
      if (!name) return alert('Nombre de categoría requerido');
      try{
        InventarioService.addCategoria({nombre: name});
        inputCatName.value = '';
        renderCategories();
      }catch(err){ alert(err.message); }
    });
  }

  // search and filter
  const searchInput = document.getElementById('search-nombre');
  const filterCat = document.getElementById('filter-categoria');
  function applyFilters(){
    const q = searchInput?.value.trim().toLowerCase() || '';
    const cat = filterCat?.value || '';
    let list = InventarioService.getAll();
    if (q) list = list.filter(p=>p.nombre.toLowerCase().includes(q));
    if (cat) list = list.filter(p=>p.categoriaId === cat);
    render(list);
  }
  searchInput?.addEventListener('input', applyFilters);
  filterCat?.addEventListener('change', applyFilters);

  if (form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const data = {
        nombre: form.nombre.value,
        categoriaId: form.categoriaId.value || null,
        precio: Number(form.precio.value),
        stock: Number(form.stock.value),
        stockMinimo: Number(form.stockMinimo.value),
        descripcion: form.descripcion.value
      };
      try{
        InventarioService.addProducto(data);
        form.reset();
        render();
        renderCategories();
      }catch(err){
        const msg = document.getElementById('producto-msg');
        if (msg){ msg.textContent = err.message; msg.classList.remove('hidden'); setTimeout(()=>{msg.classList.add('hidden');},4000); }
      }
    });
  }

  // populate filter categories
  function renderCategoriesFilter(){
    const cats = InventarioService.getCategorias();
    const filter = document.getElementById('filter-categoria');
    if (filter) filter.innerHTML = '<option value="">Todas las categorías</option>' + cats.map(c=>`<option value="${c.id}">${c.nombre}</option>`).join('');
    if (selectCat) selectCat.innerHTML = '<option value="">-- Categoría --</option>' + cats.map(c=>`<option value="${c.id}">${c.nombre}</option>`).join('');
  }

  renderCategories();
  renderCategoriesFilter();
  render();
}
