import AuthService from '../services/AuthService.js';

const ICONS = {
  dashboard: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>',
  productos: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>',
  movimientos: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>',
  reportes: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>',
  logout: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>',
  box: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25M21 7.5v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>'
};

const NAV_ITEMS = [
  { href: './dashboard.html', match: 'dashboard', label: 'Dashboard', icon: ICONS.dashboard },
  { href: './productos.html', match: 'productos', label: 'Productos', icon: ICONS.productos },
  { href: './movimientos.html', match: 'movimientos', label: 'Movimientos', icon: ICONS.movimientos },
  { href: './reportes.html', match: 'reportes', label: 'Reportes', icon: ICONS.reportes, adminOnly: true }
];

export function initNavbar() {
  const root = document.getElementById('app-navbar');
  if (!root) return;
  const session = AuthService.getSession();
  const isAdmin = !!session && session.role === 'admin';
  const current = (window.location.pathname.split('/').pop() || '').replace('.html', '');

  const items = NAV_ITEMS.filter(item => !item.adminOnly || isAdmin);

  root.innerHTML = `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <span class="sidebar-brand-icon">${ICONS.box}</span>
        <span>Inventario</span>
      </div>
      <nav class="sidebar-nav">
        ${items.map(item => `
          <a href="${item.href}" class="sidebar-link ${current === item.match ? 'active' : ''}">
            ${item.icon}<span>${item.label}</span>
          </a>
        `).join('')}
      </nav>
      <div class="sidebar-footer">
        ${session ? `
          <div class="sidebar-user">
            <div class="sidebar-user-avatar">${session.username.charAt(0).toUpperCase()}</div>
            <div class="sidebar-user-info">
              <div class="sidebar-user-name">${session.username}</div>
              <div class="sidebar-user-role">${session.role === 'admin' ? 'Administrador' : 'Empleado'}</div>
            </div>
          </div>
          <button id="logout-btn-top" class="sidebar-logout" type="button">${ICONS.logout}<span>Salir</span></button>
        ` : `<a href="./login.html" class="sidebar-logout">${ICONS.logout}<span>Ingresar</span></a>`}
      </div>
    </aside>
  `;

  const btn = document.getElementById('logout-btn-top');
  if (btn) {
    btn.addEventListener('click', () => {
      AuthService.logout();
      window.location.href = './login.html';
    });
  }
}
