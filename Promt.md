Actúa como un Desarrollador de Software Senior especializado en JavaScript vanilla, arquitectura frontend y diseño UX/UI profesional. Vas a construir en este workspace el código completo de un Sistema de Gestión de Inventario web para una empresa, y publicarlo en un repositorio de GitHub siguiendo buenas prácticas de control de versiones.

CONTEXTO DEL PROYECTO
Aplicación web (multi-página simple) que permite controlar productos, movimientos de stock y reportes, con persistencia local mediante localStorage. No requiere backend ni base de datos.

STACK TÉCNICO OBLIGATORIO
- HTML5 semántico
- Tailwind CSS vía CDN (no uses build tools ni Node a menos que lo indique explícitamente)
- JavaScript Vanilla ES6+ con Programación Orientada a Objetos (usa clases para Producto, Usuario, Movimiento, Categoria, Inventario, etc.)
- localStorage como única capa de persistencia (estructura los datos en JSON)
- Git y GitHub para control de versiones
- Prohibido usar frameworks JS (React, Vue, Angular) o librerías externas de lógica de negocio

ARQUITECTURA Y ESTRUCTURA DE CARPETAS
Crea y respeta esta arquitectura modular dentro del workspace actual:

/css
  styles.css
/js
  /models         -> Producto.js, Usuario.js, Movimiento.js, Categoria.js
  /services        -> InventarioService.js, AuthService.js, StorageService.js
  /controllers      -> lógica de cada vista (dashboard, productos, movimientos, login)
  /utils          -> validaciones.js, helpers.js, formateadores.js
  app.js          -> punto de entrada
/pages
  login.html
  dashboard.html
  productos.html
  movimientos.html
  reportes.html
index.html (redirige a login o dashboard según sesión activa)
.gitignore
README.md (explica la arquitectura, cómo correr el proyecto y usuarios de prueba)

ROLES Y PERMISOS (RBAC)

Administrador:
- CRUD completo de productos (crear, editar, eliminar)
- Definir y gestionar categorías
- Ver inventario completo
- Ver historial completo de movimientos de todos los usuarios
- Acceder a panel de estadísticas: stock bajo, productos más movidos, valor total del inventario

Empleado:
- Registrar entradas de productos (compras)
- Registrar salidas (ventas/pérdidas), validando que no exceda el stock disponible
- Consultar inventario disponible (solo lectura)
- Sin acceso para eliminar productos ni ver panel de estadísticas administrativas

AUTENTICACIÓN Y AUTORIZACIÓN
- Login con usuario/contraseña validado contra datos en localStorage
- Sesión activa gestionada en localStorage o sessionStorage
- Protección de vistas: si un Empleado intenta acceder a una vista de Administrador, debe ser redirigido con un mensaje de acceso denegado
- Logout funcional que limpia la sesión
- Seed data precargada al iniciar por primera vez: al menos 1 usuario admin y 1 usuario empleado, con credenciales visibles en el README para pruebas

FUNCIONALIDADES OBLIGATORIAS
1. CRUD completo de productos (nombre, categoría, precio, stock actual, stock mínimo, descripción)
2. Control de stock automático: cada movimiento (entrada/salida) actualiza el stock del producto en tiempo real
3. Historial de movimientos: fecha, tipo (entrada/salida), producto, cantidad, usuario que lo registró
4. Alertas visuales de stock bajo (comparando stock actual con stock mínimo)
5. Persistencia total en localStorage (los datos deben sobrevivir al recargar la página)
6. Validaciones de formularios: campos requeridos, cantidades numéricas positivas, no permitir salidas mayores al stock disponible, no permitir productos duplicados

DISEÑO Y UX
- Paleta de colores profesional: define 2-3 colores principales + neutros con sus códigos hex y úsalos de forma consistente en todo el proyecto (colores sugeridos: azul corporativo #1E3A8A, gris neutro #64748B, blanco #F8FAFC, acentos de alerta en rojo/ámbar)
- Diseño responsive (mobile-first, adaptable a tablet y desktop)
- Sidebar o navbar con navegación distinta según el rol autenticado
- Dashboard con tarjetas de métricas clave (total productos, stock bajo, movimientos del día)
- Tablas con búsqueda y filtrado por categoría/nombre
- Estados visuales claros: loading, vacío, error, éxito, y modal de confirmación antes de eliminar

CONTROL DE VERSIONES CON GIT Y GITHUB
- Inicializa el repositorio con git init si no existe
- Crea un archivo .gitignore adecuado (excluye node_modules si aplica, archivos de sistema como .DS_Store, carpetas de configuración del editor, etc.)
- Realiza commits atómicos y descriptivos por cada módulo completado, siguiendo Conventional Commits, por ejemplo:
  - feat: estructura inicial de carpetas y archivos
  - feat: modelos de Producto, Usuario, Movimiento y Categoria
  - feat: servicios de autenticación y almacenamiento
  - feat: lógica de inventario y control de stock
  - feat: vistas HTML con Tailwind
  - feat: seed data de usuarios y productos de prueba
  - docs: README con instrucciones de uso
- No hagas un único commit gigante con todo el proyecto
- Usa la rama main como rama principal
- Antes de subir a GitHub, pregúntame el nombre que debe tener el repositorio y si debe ser público o privado
- Crea el repositorio en GitHub (usando GitHub CLI si está disponible, o indicándome los pasos si no lo está) y conecta el remoto origin
- Sube los commits con git push, verificando que no queden cambios sin subir al finalizar
- Al terminar, confírmame la URL del repositorio en GitHub

REGLAS DE TRABAJO PARA EL AGENTE
- Antes de escribir código, crea primero toda la estructura de carpetas y archivos vacíos, y haz el primer commit
- Implementa un módulo a la vez, en este orden: modelos -> servicios -> autenticación -> controladores -> vistas HTML -> seed data, haciendo commit después de cada módulo funcional
- No agregues funcionalidades, páginas ni librerías que no estén pedidas aquí (evita scope creep)
- Comenta el código solo en las partes clave de la lógica de negocio, sin exceso
- Al terminar, verifica que no haya rutas ni imports rotos entre archivos
- El resultado final debe ser funcional al abrir index.html directamente en el navegador, sin necesidad de servidor ni instalación adicional

