import StorageService from './StorageService.js';

export default class AuthService {
  static sessionKey = 'session';

  static login(username, password){
    const data = StorageService.getData();
    if (!data) return null;
    const user = (data.usuarios || []).find(u => u.username === username && u.password === password);
    if (user) {
      const session = {userId: user.id, username: user.username, role: user.role};
      localStorage.setItem(this.sessionKey, JSON.stringify(session));
      return session;
    }
    return null;
  }

  static logout(){
    localStorage.removeItem(this.sessionKey);
  }

  static getSession(){
    const s = localStorage.getItem(this.sessionKey);
    return s ? JSON.parse(s) : null;
  }

  static requireRole(requiredRoles){
    const session = this.getSession();
    if (!session) return {ok:false, reason:'not-authenticated'};
    if (!Array.isArray(requiredRoles)) requiredRoles = [requiredRoles];
    if (!requiredRoles.includes(session.role)) return {ok:false, reason:'forbidden', session};
    return {ok:true, session};
  }

  // Helpers para usuarios
  static getUsers(){
    const data = StorageService.getData();
    return data.usuarios || [];
  }

  static findUserByUsername(username){
    return this.getUsers().find(u => u.username === username) || null;
  }

  static register({username, password, nombre, role='empleado'}){
    const data = StorageService.getData();
    if (this.findUserByUsername(username)) throw new Error('Usuario ya existe');
    const u = { id: String(Date.now()), username, password, nombre: nombre||'', role };
    data.usuarios = data.usuarios || [];
    data.usuarios.push(u);
    StorageService.setData(data);
    return u;
  }
}
