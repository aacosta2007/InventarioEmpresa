// Modelo Producto (con validaciones y utilidades)
export default class Producto {
  constructor({id, nombre, categoriaId, precio, stock, stockMinimo, descripcion} = {}) {
    this.id = id || String(Date.now());
    this.nombre = (nombre || '').trim();
    this.categoriaId = categoriaId || null;
    this.precio = Number(precio) || 0;
    this.stock = Number(stock) || 0;
    this.stockMinimo = Number(stockMinimo) || 0;
    this.descripcion = descripcion || '';
  }

  validate(){
    if (!this.nombre) throw new Error('El nombre es requerido');
    if (!Number.isFinite(this.precio) || this.precio < 0) throw new Error('Precio inválido');
    if (!Number.isFinite(this.stock) || this.stock < 0) throw new Error('Stock inválido');
    if (!Number.isFinite(this.stockMinimo) || this.stockMinimo < 0) throw new Error('Stock mínimo inválido');
    return true;
  }

  isLowStock(){
    return this.stock <= this.stockMinimo;
  }

  adjustStock(delta){
    const n = Number(delta);
    if (!Number.isFinite(n)) throw new Error('Cantidad inválida');
    const newStock = this.stock + n;
    if (newStock < 0) throw new Error('Stock resultante no puede ser negativo');
    this.stock = newStock;
  }

  toJSON(){
    return {
      id: this.id,
      nombre: this.nombre,
      categoriaId: this.categoriaId,
      precio: this.precio,
      stock: this.stock,
      stockMinimo: this.stockMinimo,
      descripcion: this.descripcion
    };
  }
}
