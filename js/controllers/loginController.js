import AuthService from '../services/AuthService.js';

export function initLogin(){
  const form = document.getElementById('login-form');
  const msg = document.getElementById('login-msg');
  if (!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const username = form.username.value.trim();
    const password = form.password.value.trim();
    const session = AuthService.login(username,password);
    if (session){
      window.location.href = './dashboard.html';
    } else {
      msg.textContent = 'Usuario o contraseña incorrectos';
      msg.classList.remove('hidden');
    }
  });
}

export function setupLogout(){
  const bindLogout = (btn) => {
    if (!btn) return;
    btn.addEventListener('click', ()=>{
      AuthService.logout();
      window.location.href = './login.html';
    });
  };
  bindLogout(document.getElementById('logout-btn'));
  bindLogout(document.getElementById('logout-btn-top'));
}
