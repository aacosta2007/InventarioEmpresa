// Modelo Usuario
export default class Usuario {
  constructor({id, username, password, nombre, role} = {}) {
    this.id = id || String(Date.now());
    this.username = (username || '').trim();
    this.password = password || ''; // en este proyecto se mantiene en claro para pruebas (localStorage)
    this.nombre = nombre || '';
    this.role = role || 'empleado'; // 'admin' | 'empleado'
  }

  validate(){
    if (!this.username) throw new Error('Username requerido');
    if (!this.password) throw new Error('Password requerido');
    if (!['admin','empleado'].includes(this.role)) throw new Error('Role inválido');
    return true;
  }

  toJSON(){
    return {
      id: this.id,
      username: this.username,
      password: this.password,
      nombre: this.nombre,
      role: this.role
    };
  }
}
