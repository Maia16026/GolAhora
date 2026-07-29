const API_CLASES_PUBLICO = 'http://localhost:5000/api/clases';

// 1. COMPROBAR SI EL JUGADOR INICIÓ SESIÓN
function obtenerDniClienteLogueado() {
    // TRAMPA DE DESARROLLO: Mantiene tu DNI real para pruebas en vivo
    return "39321254"; 

    let dni = localStorage.getItem('dni') || localStorage.getItem('usuarioDni') || localStorage.getItem('dniUsuario');
    const navCliente = document.getElementById('nav-modo-cliente');
    if (navCliente && navCliente.style.display !== 'none' && navCliente.style.display !== '') {
        return dni || "39321254"; 
    }
    return null;
}

function protegerAccion() {
    const dniCliente = obtenerDniClienteLogueado();
    if (!dniCliente) {
        alert("Para realizar esta acción, primero debés iniciar sesión o registrarte.");
        document.getElementById('modal-login')?.showModal();
        return null;
    }
    return dniCliente;
}

// 2. CREAR E INYECTAR EL MODAL PÚBLICO DE CLASES DISPONIBLES
function asegurarModalPublicoClases() {
    if (document.getElementById('modal-clases-publico')) return;

    const modal = document.createElement('dialog');
    modal.id = 'modal-clases-publico';
    modal.className = 'glass-panel modal-centrado';
    modal.style.cssText = 'max-width: 900px; width: 90%; max-height: 85vh; overflow-y: auto; color: white; padding: 25px;';
    
    modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
            <h2 style="margin:0; color: white; letter-spacing: 1px; text-transform: uppercase;">Clases Disponibles</h2>
            <button onclick="document.getElementById('modal-clases-publico').close()" style="background: transparent; border: none; color: #ff3838; font-size: 2rem; cursor: pointer;">×</button>
        </div>
        <div id="grid-clases-publico"></div>
    `;
    document.body.appendChild(modal);
}

// 3. MOSTRAR TODAS LAS CLASES DEL COMPLEJO
async function abrirModalClasesPublico() {
    asegurarModalPublicoClases();
    const grid = document.getElementById('grid-clases-publico');
    grid.innerHTML = '<p style="color: white; text-align: center;">Cargando grilla de entrenamientos...</p>';
    
    document.getElementById('modal-clases-publico').showModal();

    try {
        const respuesta = await fetch(API_CLASES_PUBLICO);
        const clases = await respuesta.json();

        if (clases.length === 0) {
            grid.innerHTML = '<p style="color: #ccc; text-align: center;">No hay clases programadas.</p>';
            return;
        }

        grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 25px; margin-top: 10px;';

        let html = '';
        clases.forEach(clase => {
            const inscriptos = clase.alumnosInscriptos ? clase.alumnosInscriptos.length : 0;
            const id = clase.idActividad || clase.id;

            html += `
                <div class="card-clase" style="width: 100%; min-height: 220px; padding: 3px; border-radius: 1rem; background: linear-gradient(to left, #bc13fe 0%, #7e00b8 100%); display: flex;">
                    <div style="background: #181818; color: white; width: 100%; height: 100%; border-radius: .8rem; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <h4 style="color: #bc13fe; margin: 0 0 12px 0; font-size: 1.2rem; letter-spacing: 1px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">${clase.nombreActividad.toUpperCase()}</h4>
                            <p style="margin: 8px 0; font-size: 0.9rem; display: flex; align-items: center; gap: 8px;"><svg viewBox="0 0 24 24" fill="none" stroke="#bc13fe" stroke-width="2" style="width: 16px; height: 16px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg><span>${clase.dias}</span></p>
                            <p style="margin: 8px 0; font-size: 0.9rem; display: flex; align-items: center; gap: 8px;"><svg viewBox="0 0 24 24" fill="none" stroke="#bc13fe" stroke-width="2" style="width: 16px; height: 16px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg><span>${clase.horario}</span></p>
                            <p style="margin: 8px 0; font-size: 0.9rem; display: flex; align-items: center; gap: 8px;"><svg viewBox="0 0 24 24" fill="none" stroke="#bc13fe" stroke-width="2" style="width: 16px; height: 16px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg><span><strong>Cupo:</strong> ${inscriptos} / ${clase.cupoMaximo}</span></p>
                        </div>
                        <button class="btn-neon-violeta" style="width: 100%; padding: 10px 0; font-weight: bold; color: white; text-transform: uppercase; letter-spacing: 1px; margin-top: 15px; border-radius: 6px; cursor: pointer;" onclick="anotarseAClaseDesdeLanding(${id})">Anotarme</button>
                    </div>
                </div>
            `;
        });
        grid.innerHTML = html;
    } catch (e) {
        grid.innerHTML = '<p style="color: #ff3838; text-align: center;">Error al conectar con el servidor.</p>';
    }
}

// ==========================================
// 🚀 NUEVA FUNCIÓN: MODAL "MIS CLASES" (AGENDA DEL CLIENTE)
// ==========================================
function asegurarModalMisClases() {
    if (document.getElementById('modal-mis-clases-cliente')) return;

    const modal = document.createElement('dialog');
    modal.id = 'modal-mis-clases-cliente';
    modal.className = 'glass-panel modal-centrado';
    modal.style.cssText = 'max-width: 900px; width: 90%; max-height: 85vh; overflow-y: auto; color: white; padding: 25px;';
    
    modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">
            <h2 style="margin:0; color: #00e676; letter-spacing: 1px; text-transform: uppercase;">Mis Clases Inscriptas</h2>
            <button onclick="document.getElementById('modal-mis-clases-cliente').close()" style="background: transparent; border: none; color: #ff3838; font-size: 2rem; cursor: pointer;">×</button>
        </div>
        <div id="grid-mis-clases"></div>
    `;
    document.body.appendChild(modal);
}

async function abrirMisClases() {
    const dniCliente = protegerAccion();
    if (!dniCliente) return;

    asegurarModalMisClases();
    const grid = document.getElementById('grid-mis-clases');
    grid.innerHTML = '<p style="color: white; text-align: center;">Buscando tus inscripciones...</p>';
    
    document.getElementById('modal-mis-clases-cliente').showModal();

    try {
        const respuesta = await fetch(API_CLASES_PUBLICO);
        const clases = await respuesta.json();

        // 🚀 EL TESTIGO: Ponemos el console.log acá, justo después de recibir "clases"
        console.log("Datos crudos de las clases desde el backend:", clases);

        // Filtramos las clases donde el alumno esté adentro de la lista alumnosInscriptos
        const misClasesFiltradas = clases.filter(clase => {
            return clase.alumnosInscriptos && clase.alumnosInscriptos.some(alumno => {
                if (typeof alumno === 'object' && alumno !== null) {
                    return String(alumno.dni) === String(dniCliente);
                }
                return String(alumno) === String(dniCliente);
            });
        });

        if (misClasesFiltradas.length === 0) {
            grid.innerHTML = `
                <div style="text-align: center; padding: 30px; color: #ccc;">
                    <p style="font-size: 1.1rem; margin-bottom: 15px;">Todavía no estás inscripto en ninguna actividad deportiva.</p>
                    <button class="btn-neon-violeta" style="padding: 10px 20px; font-weight: bold; color: white; border-radius: 6px;" onclick="document.getElementById('modal-mis-clases-cliente').close(); abrirModalClasesPublico();">VER CLASES DISPONIBLES</button>
                </div>`;
            return;
        }

        grid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 25px; margin-top: 10px;';

        let html = '';
        misClasesFiltradas.forEach(clase => {
            html += `
                <div class="card-clase" style="width: 100%; min-height: 180px; padding: 3px; border-radius: 1rem; background: linear-gradient(to left, #00e676 0%, #00b0ff 100%); display: flex;">
                    <div style="background: #181818; color: white; width: 100%; height: 100%; border-radius: .8rem; padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <span style="background: rgba(0, 230, 118, 0.1); color: #00e676; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">✔ INSCRIPTO</span>
                            <h4 style="color: white; margin: 15px 0 12px 0; font-size: 1.2rem; letter-spacing: 1px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">${clase.nombreActividad.toUpperCase()}</h4>
                            <p style="margin: 8px 0; font-size: 0.9rem; display: flex; align-items: center; gap: 8px;"><svg viewBox="0 0 24 24" fill="none" stroke="#00b0ff" stroke-width="2" style="width: 16px; height: 16px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg><span>${clase.dias}</span></p>
                            <p style="margin: 8px 0; font-size: 0.9rem; display: flex; align-items: center; gap: 8px;"><svg viewBox="0 0 24 24" fill="none" stroke="#00b0ff" stroke-width="2" style="width: 16px; height: 16px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg><span>${clase.horario}</span></p>
                        </div>
                        <div style="color: #888; font-size: 0.8rem; text-align: right; margin-top: 15px; font-style: italic;">Complejo Gol Ahora</div>
                    </div>
                </div>
            `;
        });
        grid.innerHTML = html;
    } catch (e) {
        grid.innerHTML = '<p style="color: #ff3838; text-align: center;">Error al procesar tu agenda de clases.</p>';
    }
}

// 5. PROCESAR LA INSCRIPCIÓN DIRECTA
async function anotarseAClaseDesdeLanding(idClase) {
    const dniCliente = protegerAccion();
    if (!dniCliente) return;

    try {
        const respuesta = await fetch(`${API_CLASES_PUBLICO}/${idClase}/inscribir/${dniCliente}`, {
            method: 'POST'
        });
        const resultado = await respuesta.json();
        
        if (!respuesta.ok) {
            alert(`Error del backend: ${resultado.mensaje || "Clase o cliente no encontrados."}\n\n(DNI enviado: ${dniCliente})`);
            return;
        }

        alert(resultado.mensaje);
        abrirModalClasesPublico();
        if (typeof cargarClases === 'function') cargarClases();
    } catch (error) {
        console.error("Error:", error);
        alert("Ocurrió un error al procesar tu inscripción.");
    }
}

// 6. ASIGNAR EVENTOS A LOS BOTONES DE LA LANDING
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-landing-clases')?.addEventListener('click', () => {
        if (protegerAccion()) abrirModalClasesPublico();
    });

    document.getElementById('btn-landing-horarios')?.addEventListener('click', () => {
        if (protegerAccion()) abrirModalClasesPublico();
    });

    document.getElementById('btn-landing-torneos')?.addEventListener('click', () => {
        if (protegerAccion()) {
            alert("¡Módulo de Competencias próximamente!\nTu usuario ha sido añadido a la lista de espera para la Liga Clausura 2026.");
        }
    });

    document.getElementById('btn-landing-relampago')?.addEventListener('click', () => {
        if (protegerAccion()) {
            alert("No hay torneos relámpago programados para esta semana. Te notificaremos por mail las próximas aperturas.");
        }
    });
});

// =======================================================================
// 🔮 MENÚ DESPLEGABLE MÓVIL INTELIGENTE (Para pantallas chicas / Consola abierta)
// =======================================================================
window.toggleMiMenu = function() {
    console.log("Interceptando toggleMiMenu() para abrir el menú desplegable móvil...");
    
    // 1. Buscamos si la caja del menú flotante ya existe en la pantalla
    let menuFlotante = document.getElementById('menu-flotante-responsivo');
    
    if (menuFlotante) {
        // Si ya existe, lo mostramos o lo escondemos (Toggle)
        menuFlotante.style.display = menuFlotante.style.display === 'block' ? 'none' : 'block';
        return;
    }
    
    // 2. Si no existe, lo creamos dinámicamente con estilos Cyberpunk/Neón
    menuFlotante = document.createElement('div');
    menuFlotante.id = 'menu-flotante-responsivo';
    
    menuFlotante.style.cssText = `
        position: absolute;
        top: 75px;
        right: 20px;
        background: #161616;
        border: 2px solid #bc13fe;
        border-radius: 10px;
        padding: 8px;
        display: block;
        z-index: 999999;
        box-shadow: 0 0 15px rgba(188, 19, 254, 0.5);
        min-width: 180px;
    `;
    
    // 3. Le inyectamos los tres botones reales conectados a las funciones del sistema
    menuFlotante.innerHTML = `
        <button onclick="document.getElementById('menu-flotante-responsivo').style.display='none'; if(typeof abrirMisReservas === 'function') abrirMisReservas();" 
                style="width: 100%; background: transparent; border: none; color: #00e676; padding: 12px 10px; text-align: left; font-weight: bold; font-family: 'Montserrat', sans-serif; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.85rem;">
            ⚽ MIS RESERVAS
        </button>
        <button onclick="document.getElementById('menu-flotante-responsivo').style.display='none'; if(typeof abrirMisClases === 'function') abrirMisClases();" 
                style="width: 100%; background: transparent; border: none; color: #bc13fe; padding: 12px 10px; text-align: left; font-weight: bold; font-family: 'Montserrat', sans-serif; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.85rem;">
            🔮 MIS CLASES
        </button>
        <button onclick="document.getElementById('menu-flotante-responsivo').style.display='none'; document.getElementById('btn-logout-cliente')?.click();" 
                style="width: 100%; background: transparent; border: none; color: #ff3838; padding: 12px 10px; text-align: left; font-weight: bold; font-family: 'Montserrat', sans-serif; cursor: pointer; font-size: 0.85rem;">
            ❌ CERRAR SESIÓN
        </button>
    `;
    
    // 4. Lo colgamos adentro de la barra de navegación superior
    const header = document.getElementById('menu-pegajoso') || document.body;
    header.appendChild(menuFlotante);
};