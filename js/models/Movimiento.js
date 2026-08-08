// Modelo Movimiento
export default class Movimiento {
  constructor({id, productoId, tipo, cantidad, usuarioId, fecha, nota} = {}){
    this.id = id || String(Date.now());
    this.productoId = productoId || null;
    this.tipo = tipo || 'entrada'; // 'entrada' | 'salida'
    this.cantidad = Number(cantidad) || 0;
    this.usuarioId = usuarioId || null;
    this.fecha = fecha || new Date().toISOString();
    this.nota = nota || '';
  }

  validate(){
    if (!this.productoId) throw new Error('productoId requerido');
    if (!['entrada','salida'].includes(this.tipo)) throw new Error('Tipo inválido');
    if (!Number.isFinite(this.cantidad) || this.cantidad <= 0) throw new Error('Cantidad inválida');
    if (!this.usuarioId) throw new Error('usuarioId requerido');
    return true;
  }

  toJSON(){
    return {
      id: this.id,
      productoId: this.productoId,
      tipo: this.tipo,
      cantidad: this.cantidad,
      usuarioId: this.usuarioId,
      fecha: this.fecha,
      nota: this.nota
    };
  }
}
