// ==========================================================================
// ELEMENTOS DEL DOM GLOBALES (Ordenados para evitar errores de carga)
// ==========================================================================

// Navegación
const menuPegajoso = document.getElementById('menu-pegajoso');

// Secciones Principales
const sitioPublico = document.getElementById('sitio-publico');
const panelControl = document.getElementById('panel-control');
const rolTitulo = document.getElementById('rol-titulo');
const dashboardAcciones = document.getElementById('dashboard-acciones');

// Botones Header
const btnIngresar = document.getElementById('btn-ingresar');
const btnRegistrar = document.getElementById('btn-registrar');
const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');

// Modales y Formularios
const modalLogin = document.getElementById('modal-login');
const btnCloseModal = document.getElementById('btn-close-modal');
const formLogin = document.getElementById('form-login-sistema');
const mensajeError = document.getElementById('mensaje-error');

const modalRegistrar = document.getElementById('modal-registrar');
const btnCloseRegistrar = document.getElementById('btn-close-registrar');
const formRegistro = document.getElementById('form-registro-sistema');
const mensajeErrorRegistro = document.getElementById('mensaje-error-registro');
const btnWsp = document.getElementById('btn-wsp-flotante');


const API_URL = 'http://localhost:5000/api';
const URL_ADMIN = `${API_URL}/admin`;

