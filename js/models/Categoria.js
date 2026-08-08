// Modelo Categoria
export default class Categoria {
  constructor({id, nombre, descripcion} = {}){
    this.id = id || String(Date.now());
    this.nombre = (nombre || '').trim();
    this.descripcion = descripcion || '';
  }

  validate(){
    if (!this.nombre) throw new Error('Nombre de categoría requerido');
    return true;
  }

  toJSON(){
    return {id: this.id, nombre: this.nombre, descripcion: this.descripcion};
  }
}
