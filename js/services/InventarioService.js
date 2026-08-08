import StorageService from './StorageService.js';
import Producto from '../models/Producto.js';
import Movimiento from '../models/Movimiento.js';

export default class InventarioService {
  static dataKey = StorageService.KEY;

  // Productos
  static getAll(){
    const data = StorageService.getData();
    return data.productos || [];
  }

  static saveAll(productos){
    const data = StorageService.getData();
    data.productos = productos;
    StorageService.setData(data);
  }

  static addProducto(payload){
    const productos = this.getAll();
    // evitar duplicados por nombre (case-insensitive)
    if (productos.some(p => p.nombre.trim().toLowerCase() === payload.nombre.trim().toLowerCase())){
      throw new Error('Producto duplicado');
    }
    const p = new Producto(payload);
    p.validate();
    productos.push(p.toJSON());
    this.saveAll(productos);
    return p;
  }

  static updateProducto(id, patch){
    const productos = this.getAll();
    const idx = productos.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Producto no encontrado');
    const updated = {...productos[idx], ...patch};
    const prod = new Producto(updated);
    prod.validate();
    productos[idx] = prod.toJSON();
    this.saveAll(productos);
    return productos[idx];
  }

  static deleteProducto(id){
    let productos = this.getAll();
    productos = productos.filter(p => p.id !== id);
    this.saveAll(productos);
  }

  static getById(id){
    return this.getAll().find(p => p.id === id) || null;
  }

  // Categorias
  static getCategorias(){
    const data = StorageService.getData();
    return data.categorias || [];
  }

  static addCategoria(payload){
    const categorias = this.getCategorias();
    if (categorias.some(c => c.nombre.trim().toLowerCase() === payload.nombre.trim().toLowerCase())){
      throw new Error('Categoría duplicada');
    }
    const nueva = { id: String(Date.now()), nombre: (payload.nombre||'').trim(), descripcion: payload.descripcion || '' };
    categorias.push(nueva);
    const data = StorageService.getData();
    data.categorias = categorias;
    StorageService.setData(data);
    return nueva;
  }

  static updateCategoria(id, patch){
    const categorias = this.getCategorias();
    const idx = categorias.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Categoría no encontrada');
    categorias[idx] = {...categorias[idx], ...patch};
    const data = StorageService.getData();
    data.categorias = categorias;
    StorageService.setData(data);
    return categorias[idx];
  }

  static deleteCategoria(id){
    let categorias = this.getCategorias();
    categorias = categorias.filter(c => c.id !== id);
    const data = StorageService.getData();
    data.categorias = categorias;
    // además, limpiar referencias en productos (setear a null)
    data.productos = (data.productos || []).map(p => p.categoriaId === id ? {...p, categoriaId: null} : p);
    StorageService.setData(data);
  }

  static getCategoriaById(id){
    return this.getCategorias().find(c => c.id === id) || null;
  }

  // Movimientos
  static getMovimientos(){
    const data = StorageService.getData();
    return data.movimientos || [];
  }

  static addMovimiento({productoId, tipo, cantidad, usuarioId, nota}){
    const data = StorageService.getData();
    if (!data) throw new Error('Datos no inicializados');
    const producto = data.productos.find(p => p.id === productoId);
    if (!producto) throw new Error('Producto no encontrado');
    cantidad = Number(cantidad);
    if (!Number.isFinite(cantidad) || cantidad <= 0) throw new Error('Cantidad inválida');
    if (tipo === 'salida' && cantidad > producto.stock) throw new Error('Stock insuficiente');
    // ajustar stock
    producto.stock = tipo === 'entrada' ? producto.stock + cantidad : producto.stock - cantidad;
    const mov = new Movimiento({productoId, tipo, cantidad, usuarioId, nota});
    data.movimientos = data.movimientos || [];
    data.movimientos.push(mov.toJSON ? mov.toJSON() : mov);
    StorageService.setData(data);
    return mov;
  }
}
