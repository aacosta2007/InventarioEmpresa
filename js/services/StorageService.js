// Servicio responsable de persistencia en localStorage
export default class StorageService {
  static KEY = 'inventario_app_v1';

  static read(){
    const raw = localStorage.getItem(this.KEY);
    return raw ? JSON.parse(raw) : null;
  }

  static write(data){
    localStorage.setItem(this.KEY, JSON.stringify(data));
  }

  // Asegura que la estructura mínima exista, si no, escribe seed por defecto
  static ensureInit(seed){
    let data = this.read();
    if (!data) {
      data = seed;
      this.write(data);
    }
    return data;
  }

  // Inicializa datos por defecto (usuarios, categorias y un producto de ejemplo)
  static initDefaultData(){
    const existing = this.read();
    if (existing) return existing;

    const nowId = () => String(Date.now() + Math.floor(Math.random()*1000));
    const seed = {
      usuarios: [
        { id: nowId(), username: 'admin', password: 'admin123', nombre: 'Administrador', role: 'admin' },
        { id: nowId(), username: 'empleado', password: 'empleado123', nombre: 'Empleado', role: 'empleado' }
      ],
      categorias: [
        { id: nowId(), nombre: 'General', descripcion: 'Categoría por defecto' }
      ],
      productos: [
        { id: nowId(), nombre: 'Tornillo M4', categoriaId: null, precio: 0.5, stock: 100, stockMinimo: 10, descripcion: 'Tornillo de cabeza plana' }
      ],
      movimientos: []
    };

    this.write(seed);
    return seed;
  }

  // Operaciones convenientes
  static getData(){
    const data = this.read();
    if (!data) return this.initDefaultData();
    return data;
  }

  static setData(data){
    this.write(data);
  }
}
