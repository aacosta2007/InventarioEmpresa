// Punto de entrada: inicializa datos por defecto y exporta utilidades globales
import StorageService from './services/StorageService.js';

// Inicializar seed de datos si es la primera vez
StorageService.initDefaultData();

console.log('App inicializado y seed asegurado');
export default {};
