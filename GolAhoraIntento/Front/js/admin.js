
// ==========================================================================
// 7. MOTOR DE PESTAÑAS (TABS) DEL DASHBOARD
// ==========================================================================
const tabButtons = document.querySelectorAll('.tab-btn');
const cabeceraAcciones = document.getElementById('header-acciones'); // Atrapamos el div vacío

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tabSeleccionada = btn.getAttribute('data-tab');
        renderizarModulo(tabSeleccionada);
    });
});

function renderizarModulo(modulo) {
    const titulo = document.getElementById('titulo-seccion');
    const panel = document.getElementById('dashboard-acciones');
    const cabeceraAcciones = document.getElementById('header-acciones');

    // ====================================================================
    // INYECCIÓN GLOBAL DEL BOTÓN REFRESH
    // ====================================================================
    let btnGlobalRefresh = document.getElementById('btn-global-refresh');
    if (!btnGlobalRefresh) {
        const contenedorTitulo = document.createElement('div');
        contenedorTitulo.style.display = 'flex';
        contenedorTitulo.style.justifyContent = 'space-between';
        contenedorTitulo.style.alignItems = 'flex-start'; 
        
        titulo.parentNode.insertBefore(contenedorTitulo, titulo);
        contenedorTitulo.appendChild(titulo); 

        btnGlobalRefresh = document.createElement('button');
        btnGlobalRefresh.id = 'btn-global-refresh';
        btnGlobalRefresh.className = 'btn-refresh';
        btnGlobalRefresh.title = 'Refrescar datos';
        btnGlobalRefresh.style.marginTop = '2px'; 

        btnGlobalRefresh.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"></path>
                <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"></path>
            </svg>
        `;
        contenedorTitulo.appendChild(btnGlobalRefresh);

        // 👇 LÓGICA NUEVA: REFRESCO INTELIGENTE DE DATOS 👇
        btnGlobalRefresh.addEventListener('click', function() {
            const svg = this.querySelector('svg');
            svg.classList.remove('spin-anim');
            void svg.offsetWidth; 
            svg.classList.add('spin-anim');
            setTimeout(() => svg.classList.remove('spin-anim'), 500);

            const moduloActual = document.querySelector('.tab-btn.active')?.getAttribute('data-tab') || 'usuarios';

            // En vez de redibujar el HTML, disparamos la recarga de datos específica
            switch(moduloActual) {
                case 'usuarios':
                    usuariosCacheados = []; // Vaciamos la memoria
                    filtrarUsuariosCacheados(); // Lee cómo está el <select> y busca en DB
                    break;
                case 'canchas':
                    if (typeof cargarCanchasAdmin === 'function') cargarCanchasAdmin();
                    break;
                case 'reservas':
                    if (typeof cargarReservasAdmin === 'function') cargarReservasAdmin();
                    break;
                case 'finanzas':
                    if (typeof cargarPagosAdmin === 'function') cargarPagosAdmin();
                    break;
                case 'torneos':
                    if (typeof cargarCompeticionesAdmin === 'function') cargarCompeticionesAdmin('Liga');
                    break;
            }
        });
    }
    // ====================================================================

    switch (modulo) {
        case 'usuarios':
            titulo.innerText = 'Gestión de Usuarios';
            cabeceraAcciones.innerHTML = `
                <div class="header-actions-bar" style="display: flex; justify-content: space-between; width: 100%;">
                    <div class="search-container">
                        <input type="number" id="input-buscar-dni" placeholder="Buscar DNI..." onkeypress="if(event.key === 'Enter') buscarUsuarioPorDni()">
                        <button class="btn-icon" onclick="buscarUsuarioPorDni()">
                            <svg class="lupa-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                                <path fill="#33c416" d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="action-buttons" style="display: flex; align-items: center; gap: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="color: #ccc; font-size: 0.85rem; font-weight: bold; text-transform: uppercase;">Filtrar:</span>
                            <select id="filtro-rol" class="select-saas" onchange="filtrarUsuariosCacheados()">
                                <option value="default" disabled selected>--Selecciona Rol--</option>
                                <option value="todos">Todos los Roles</option>
                                <option value="cliente">Clientes</option>
                                <option value="profesor">Profesores</option>
                                <option value="entrenador">Entrenadores</option>
                                <option value="administrador">Administradores</option>
                            </select>
                        </div>
                        
                        <div style="display: flex; flex-direction: column; gap: 8px; width: 170px;">
                            <button class="btn-sm" style="background: #ff9800; color: black; font-size: 0.75rem; padding: 8px 0; width: 100%; text-align: center;" onclick="abrirModalAscenso()">+ NUEVO INSTRUCTOR</button>
                            <button class="btn-sm outline-green" style="font-size: 0.75rem; padding: 8px 0; width: 100%; text-align: center;" onclick="modalRegistrar.showModal()">+ NUEVO USUARIO</button>
                        </div>
                        
                    </div>
                </div>
            `;
            panel.innerHTML = `<div id="grid-usuarios" class="cards-grid"></div>`;
            mostrarPlaceholderUsuarios(); 
            break;
            
        case 'canchas':
            titulo.innerText = 'Gestión de Canchas';
            cabeceraAcciones.innerHTML = `
                <div style="display: flex; justify-content: flex-end; width: 100%;">
                    <button class="btn-reserve outline-green" style="width: auto; padding: 10px 20px;" onclick="abrirModalNuevaCancha()">+ NUEVA CANCHA</button>
                </div>
            `;
            panel.innerHTML = `<div id="grid-canchas" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(420px, 1fr)); gap: 20px;"><p style="color: #aaa;">Cargando canchas...</p></div>`;
            if (typeof cargarCanchasAdmin === 'function') cargarCanchasAdmin();
            break;

        case 'reservas':
            titulo.innerText = 'Parrilla de Reservas';

            cabeceraAcciones.innerHTML = `
                <div class="header-actions-bar" style="display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 15px; flex-wrap: wrap;">
                    
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span id="label-fecha-admin" style="color: #ccc; font-size: 0.85rem; font-weight: bold;">FECHA:</span>
                            <div class="date-selector-container" style="max-width: 350px; margin: 0 !important; display: flex; align-items: center;">
                                <button class="btn-date-arrow" id="btn-prev-admin-res" style="font-size: 1.2rem; padding: 5px 15px;">❮</button>
                                <input type="text" id="filtro-reserva-fecha" class="input-neon" placeholder="Seleccioná..." readonly="readonly" style="margin: 0; flex: 1; text-align: center; border: none; font-size: 1.1rem; font-weight: bold; padding: 10px; background: rgba(0,0,0,0.4); color: white;">
                                <button class="btn-date-arrow" id="btn-next-admin-res" style="font-size: 1.2rem; padding: 5px 15px;">❯</button>
                            </div>
                        </div>

                        <div style="display: flex; background: rgba(255,255,255,0.03); padding: 4px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); align-items: center;">
                            <button id="btn-vista-dia" class="btn-filtro-estado active" onclick="cambiarModoVistaReservas('dia')" style="padding: 6px 12px; font-size: 0.75rem;">1 DÍA</button>
                            <button id="btn-vista-semana" class="btn-filtro-estado" onclick="cambiarModoVistaReservas('semana')" style="padding: 6px 12px; font-size: 0.75rem;">7 DÍAS</button>
                            <button id="btn-vista-mes" class="btn-filtro-estado" onclick="cambiarModoVistaReservas('mes')" style="padding: 6px 12px; font-size: 0.75rem;">1 MES</button>
                        </div>
                    </div>

                    <div style="display: flex; align-items: center; gap: 20px;">
                        <div style="display: flex; gap: 8px; background: rgba(255,255,255,0.03); padding: 4px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                            <button class="btn-filtro-estado active" data-estado="todas" onclick="cambiarFiltroEstadoReserva(this)">TODAS</button>
                            <button class="btn-filtro-estado" data-estado="pendiente" onclick="cambiarFiltroEstadoReserva(this)" style="color: #ff9800;">PENDIENTES</button>
                            <button class="btn-filtro-estado" data-estado="confirmada" onclick="cambiarFiltroEstadoReserva(this)" style="color: #39FF14;">CONFIRMADAS</button>
                            <button class="btn-filtro-estado" data-estado="cancelada" onclick="cambiarFiltroEstadoReserva(this)" style="color: #ff3838;">CANCELADAS</button>
                        </div>

                        <button class="btn-reserve outline-green" style="width: auto; padding: 10px 20px; margin: 0;" onclick="iniciarReservaReal()">+ NUEVA RESERVA</button>
                    </div>
                </div>
            `;
            
            // 👇 Contenedor vacío (sin texto hardcodeado) 👇
            panel.innerHTML = `<div id="parrilla-canchas-container" style="display: flex; flex-direction: column; gap: 30px; width: 100%;"></div>`;
            
            setTimeout(() => {
                const fpAdmin = flatpickr("#filtro-reserva-fecha", {
                    locale: "es",
                    dateFormat: "Y-m-d", 
                    altInput: true,
                    altFormat: "l, j \\d\\e F", 
                    defaultDate: "today",
                    onChange: function() {
                        cargarReservasAdmin();
                    }
                });

                document.getElementById('btn-prev-admin-res').addEventListener('click', () => {
                    let actual = fpAdmin.selectedDates[0] || new Date();
                    actual.setDate(actual.getDate() - 1);
                    fpAdmin.setDate(actual, true); 
                });

                document.getElementById('btn-next-admin-res').addEventListener('click', () => {
                    let actual = fpAdmin.selectedDates[0] || new Date();
                    actual.setDate(actual.getDate() + 1);
                    fpAdmin.setDate(actual, true);
                });
            }, 100);

            if (typeof cargarReservasAdmin === 'function') cargarReservasAdmin();
            break;

        case 'finanzas':
            titulo.innerText = 'Gestión de Cobros y Recibos';
            
            cabeceraAcciones.innerHTML = `
                <div class="header-actions-bar" style="display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 15px; flex-wrap: wrap;">
                    
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span id="label-fecha-finanzas" style="color: #ccc; font-size: 0.85rem; font-weight: bold;">FECHA:</span>
                            <div class="date-selector-container" style="max-width: 350px; margin: 0 !important; display: flex; align-items: center;">
                                <button class="btn-date-arrow" id="btn-prev-finanzas" style="font-size: 1.2rem; padding: 5px 15px;">❮</button>
                                <input type="text" id="filtro-finanzas-fecha" class="input-neon" placeholder="Seleccioná..." readonly="readonly" style="margin: 0; flex: 1; text-align: center; border: none; font-size: 1.1rem; font-weight: bold; padding: 10px; background: rgba(0,0,0,0.4); color: white;">
                                <button class="btn-date-arrow" id="btn-next-finanzas" style="font-size: 1.2rem; padding: 5px 15px;">❯</button>
                            </div>
                        </div>

                        <div style="display: flex; background: rgba(255,255,255,0.03); padding: 4px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); align-items: center;">
                            <button id="btn-vf-dia" class="btn-filtro-estado active" onclick="cambiarModoVistaFinanzas('dia')" style="padding: 6px 12px; font-size: 0.75rem;">1 DÍA</button>
                            <button id="btn-vf-semana" class="btn-filtro-estado" onclick="cambiarModoVistaFinanzas('semana')" style="padding: 6px 12px; font-size: 0.75rem;">7 DÍAS</button>
                            <button id="btn-vf-mes" class="btn-filtro-estado" onclick="cambiarModoVistaFinanzas('mes')" style="padding: 6px 12px; font-size: 0.75rem;">1 MES</button>
                        </div>
                    </div>

                    <div style="display: flex; align-items: center; gap: 20px;">
                        <div style="display: flex; gap: 8px; background: rgba(255,255,255,0.03); padding: 4px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                            <button class="btn-filtro-estado active" data-estado="todas" onclick="cambiarFiltroEstadoFinanzas(this)">TODOS</button>
                            <button class="btn-filtro-estado" data-estado="pendiente" onclick="cambiarFiltroEstadoFinanzas(this)" style="color: #ff9800;">PENDIENTES</button>
                            <button class="btn-filtro-estado" data-estado="pagado" onclick="cambiarFiltroEstadoFinanzas(this)" style="color: #39FF14;">PAGADOS</button>
                        </div>
                    </div>
                </div>
            `;

            panel.innerHTML = `<div id="parrilla-finanzas-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; width: 100%; margin-top: 20px;"></div>`;
            
            setTimeout(() => {
                const fpFinanzas = flatpickr("#filtro-finanzas-fecha", {
                    locale: "es",
                    dateFormat: "Y-m-d", 
                    altInput: true,
                    altFormat: "l, j \\d\\e F", 
                    defaultDate: "today",
                    onChange: () => cargarFinanzasAdmin()
                });

                document.getElementById('btn-prev-finanzas').addEventListener('click', () => {
                    let actual = fpFinanzas.selectedDates[0] || new Date();
                    actual.setDate(actual.getDate() - 1);
                    fpFinanzas.setDate(actual, true); 
                });

                document.getElementById('btn-next-finanzas').addEventListener('click', () => {
                    let actual = fpFinanzas.selectedDates[0] || new Date();
                    actual.setDate(actual.getDate() + 1);
                    fpFinanzas.setDate(actual, true);
                });
            }, 100);

            if (typeof cargarFinanzasAdmin === 'function') cargarFinanzasAdmin();
            break;

        case 'torneos':
            titulo.innerText = 'Ligas, Torneos y Equipos';
            
            cabeceraAcciones.innerHTML = `
                <div class="header-actions-bar" style="display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 15px; flex-wrap: wrap;">
                    
                    <div style="display: flex; background: rgba(255,255,255,0.03); padding: 4px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); align-items: center;">
                        <button id="btn-vista-ligas" class="btn-filtro-estado active" onclick="cambiarVistaCompeticion('Liga')" style="padding: 8px 20px; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; border-radius: 6px;">LIGAS</button>
                        <button id="btn-vista-torneos" class="btn-filtro-estado" onclick="cambiarVistaCompeticion('Torneo')" style="padding: 8px 20px; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; border-radius: 6px;">TORNEOS</button>
                        <button id="btn-vista-equipos" class="btn-filtro-estado" onclick="cambiarVistaCompeticion('Equipo')" style="padding: 8px 20px; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; border-radius: 6px; border-left: 1px solid rgba(255,255,255,0.1); margin-left: 5px;">EQUIPOS</button>
                    </div>

                    <button id="btn-nueva-competicion" class="btn-reserve outline-green" style="width: auto; padding: 10px 25px; margin: 0; box-shadow: 0 4px 15px rgba(57, 255, 20, 0.2);" onclick="abrirModalNuevaCompeticion('Liga')">+ NUEVA LIGA</button>
                </div>
            `;
            
            panel.innerHTML = `<div id="grid-competiciones" class="data-grid"><p style="color: #aaa; text-align: center; grid-column: 1/-1; margin-top: 40px;">Sincronizando datos deportivos...</p></div>`;
            
            if (typeof cargarCompeticionesAdmin === 'function') cargarCompeticionesAdmin('Liga');
            break;

       case 'clases': 
    document.getElementById('titulo-seccion').textContent = 'Clases y Entrenamientos';
    
    // Header vacío (borramos el código que inyectaba el botón verde fantasma)
    document.getElementById('header-acciones').innerHTML = '';

    // Cuerpo: Mantenemos el botón de nueva clase y el contenedor
    document.getElementById('dashboard-acciones').innerHTML = `
        <div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
            <button class="btn-reserve" style="background: #bc13fe; border: 1px solid #bc13fe; color: white; width: auto; padding: 10px 20px;" 
            onclick="document.getElementById('modal-nueva-clase').showModal()">
                + NUEVA CLASE
            </button>
        </div>
        <div id="contenedor-clases">
            <p style="color: white; text-align: center;">Cargando clases...</p>
        </div>
    `;

    cargarClases();
    // NOTA: Si querés que el botón de refrescar (el de arriba a la derecha) 
    // funcione, asegúrate de que el id sea 'btnRefrescar' en tu HTML original.
    break;

        case 'reportes':
            titulo.innerText = 'Reportes y Estadísticas';
            cabeceraAcciones.innerHTML = `
                <div style="display: flex; justify-content: flex-end; width: 100%;">
                    <button class="btn-reserve outline-green" style="width:auto; padding:10px 20px;">EXPORTAR A EXCEL</button>
                </div>
            `;
            panel.innerHTML = `<p style="color:#aaa;">Módulo de Reportes en construcción...</p>`;
            break;

        default:
            panel.innerHTML = `<p style="color: red;">Módulo no encontrado.</p>`;
            break;
    }
}

// ==========================================================================
// 8. CONEXIÓN CON SWAGGER: CRUD DE USUARIOS
// ==========================================================================

// Variable global (caché) para no pedirle a C# los 1000 usuarios todo el tiempo
let usuariosCacheados = []; 

// FUNCION PARA DIBUJAR EL FONDO (Con o sin error)
function mostrarPlaceholderUsuarios(mensajeError = '') {
    const panel = document.getElementById('dashboard-acciones');
    
    // Si hay error, armamos un cartelito rojo. Si no, queda vacío.
    let cartelError = '';
    if (mensajeError) {
        cartelError = `
            <div style="background: rgba(255,56,56,0.1); border: 1px solid rgba(255,56,56,0.3); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="color:#ff3838; font-weight:bold; margin: 0;"> ${mensajeError}</p>
            </div>
        `;
    }

    panel.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 60vh; color: #aaa; text-align: center;">
            ${cartelError} <svg style="width: 80px; height: 80px; fill: rgba(255,255,255,0.1); margin-bottom: 20px;" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512h-137.8c5.4-9.4 8.6-20.3 8.6-32v-144c0-22.1 17.9-40 40-40s40 17.9 40 40v109.3c0 17.7 14.3 32 32 32s32-14.3 32-32V304c0-53-43-96-96-96s-96 43-96 96v144c0 11.7 3.2 22.6 8.6 32H30.7C14.3 512 1 498.7 1 482.3C1 383.8 80.8 304 179.3 304h91.4c21.8 0 42.4 3.9 61.2 10.9c-15.5 16.5-27.4 36.5-34.1 58.7c-9.1-3.6-19.1-5.6-29.5-5.6h-91.4c-60.8 0-111.4 43.1-124 100.2h399.6z"/>
            </svg>
            <h3 style="color: white; margin-bottom: 10px;">Panel de Usuarios</h3>
            <p>Utilizá el buscador para encontrar a alguien por su DNI<br>o hacé clic en "Listar" para cargar la base de datos.</p>
        </div>
    `;
}

// A. LISTAR TODOS LOS USUARIOS (GET)
// NUEVO: FUNCIÓN TODO EN UNO (Descarga y Filtra)
async function filtrarUsuariosCacheados() {
    const selectElement = document.getElementById('filtro-rol');
    const selectFiltro = selectElement.value;

    // 1. Si el usuario vuelve a la opción por defecto, mostramos el fondo
    if (selectFiltro === 'default') {
        mostrarPlaceholderUsuarios();
        return;
    }

    // 2. Si es la primera vez que busca y no hay caché, le pedimos los datos a C#
    if (usuariosCacheados.length === 0) {
        const panel = document.getElementById('dashboard-acciones');
        panel.innerHTML = '<p style="color: var(--color-primario); font-weight:bold; text-align:center; margin-top:50px;">Sincronizando con base de datos...</p>';

        try {
            const token = localStorage.getItem('tokenGolAhora');
            const respuesta = await fetch(`${URL_ADMIN}/listar-usuarios`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!respuesta.ok) throw new Error('Error de conexión');
            usuariosCacheados = await respuesta.json();

            // Si la base de datos de C# está vacía
            if (usuariosCacheados.length === 0) {
                mostrarPlaceholderUsuarios("La base de datos se encuentra completamente vacía.");
                selectElement.value = 'default'; // Reseteamos el selector
                return;
            }
        } catch (error) {
            mostrarPlaceholderUsuarios("No se pudo conectar con la base de datos.");
            selectElement.value = 'default';
            return;
        }
    }

    // 3. Filtramos la lista según lo que eligió
    let listaFiltrada = usuariosCacheados;

    if (selectFiltro !== 'todos') {
        listaFiltrada = usuariosCacheados.filter(u => {
            let rol = u.rol || u.Rol || u.role || u.Role || '';
            if (Array.isArray(rol)) rol = rol[0]; 
            return String(rol).toLowerCase().includes(selectFiltro);
        });
    }

    // 4. Si después de filtrar no queda nadie (ej: no hay entrenadores)
    if (listaFiltrada.length === 0) {
        const nombreRol = selectFiltro === 'todos' ? 'usuario' : selectFiltro;
        mostrarPlaceholderUsuarios(`No se encontró ningún ${nombreRol} registrado en el sistema.`);
        return;
    }

    // 5. Si todo sale bien, dibujamos las tarjetas
    renderizarTarjetasUsuarios(listaFiltrada);
}

// B. BUSCAR UN USUARIO POR DNI (GET)
async function buscarUsuarioPorDni() {
    const dniBuscado = document.getElementById('input-buscar-dni').value.trim();
    if (!dniBuscado) {
        mostrarPlaceholderUsuarios(); // Vuelve al default si está vacío
        return; 
    }
    
    try {
        const token = localStorage.getItem('tokenGolAhora');
        const respuesta = await fetch(`${URL_ADMIN}/buscar/${dniBuscado}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!respuesta.ok) throw new Error('Usuario no encontrado');
        const usuarioEncontrado = await respuesta.json();

        // Limpiamos el filtro a "Todos" para evitar confusiones visuales
        document.getElementById('filtro-rol').value = 'todos';
        renderizarTarjetasUsuarios([usuarioEncontrado]);

    } catch (error) {
        // Acá está la magia: llamamos a la función inyectándole el mensaje rojo
        mostrarPlaceholderUsuarios(`No se encontró ningún usuario con el DNI: ${dniBuscado}`);
    }
}

// C. DIBUJAR LAS TARJETAS CON LOS BOTONES DE ACCIÓN
function renderizarTarjetasUsuarios(usuarios) {
    const panel = document.getElementById('dashboard-acciones');
    let html = '<div class="data-grid">';
    
    usuarios.forEach(u => {
        const nombreStr = u.nombre || u.Nombre || 'Sin Nombre';
        const apellidoStr = u.apellido || u.Apellido || '';
        const dniNum = u.dni || u.Dni || u.DNI || '00000000';
        const mailStr = u.mail || u.Mail || 'Sin correo';
        const telNum = u.telefono || u.Telefono || 'Sin teléfono'; 
        
        // CAPTURAMOS EL ROL (A prueba de fallos y arrays de C#)
        let rolCrudo = u.rol || u.Rol || u.role || u.Role || 'Cliente';
        if (Array.isArray(rolCrudo)) rolCrudo = rolCrudo[0]; // Si C# lo manda como lista
        
        // Lo pasamos a mayúsculas y guardamos una versión en minúsculas para el CSS
        const rolVisual = String(rolCrudo).toUpperCase();
        const rolClaseCSS = String(rolCrudo).toLowerCase();
        
        html += `
            <div class="data-card">
                <div class="card-header">
                    <div class="card-title">
                        <strong>${nombreStr} ${apellidoStr}</strong>
                        <span>DNI: ${dniNum}</span>
                    </div>
                    <span class="status-badge rol-${rolClaseCSS}">${rolVisual}</span>
                </div>
                
                <div class="card-body" style="margin-bottom: 15px; font-size: 0.85rem; color: #ccc;">
                    <p class="card-contact-item">
                        <svg class="card-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#33c416" d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.457L0 24zm6.59-4.846c1.66.986 3.288 1.48 4.888 1.481 5.421 0 9.832-4.326 9.836-9.641.002-2.575-1.002-5-2.827-6.83-1.825-1.83-4.254-2.836-6.836-2.837-5.43 0-9.84 4.331-9.843 9.643-.001 1.672.454 3.301 1.32 4.747l-.991 3.616 3.753-.962zM17.43 14.86c-.307-.154-1.817-.893-2.098-.995-.281-.102-.485-.154-.688.154-.203.308-.785.995-.96 1.199-.177.205-.353.23-.66.077-.307-.155-1.298-.478-2.472-1.522-.913-.811-1.53-1.812-1.71-2.119-.18-.306-.018-.471.135-.624.139-.138.307-.359.462-.538.154-.179.206-.307.307-.512.103-.205.051-.384-.025-.538-.077-.154-.688-1.663-.943-2.278-.248-.598-.501-.517-.688-.527-.178-.008-.383-.01-.587-.01s-.537.077-.817.384c-.281.308-1.073 1.05-1.073 2.56 0 1.51 1.1 2.969 1.253 3.174.154.204 2.165 3.303 5.244 4.631.733.316 1.304.505 1.75.647.736.233 1.407.2 1.937.12.59-.089 1.817-.742 2.072-1.429.254-.688.254-1.278.177-1.393-.075-.12-.28-.19-.588-.344z"/>
                        </svg>
                        ${telNum}
                    </p>
                    <p class="card-contact-item">
                        <svg class="card-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path fill="#33c416" d="M112 128C85.5 128 64 149.5 64 176C64 191.1 71.1 205.3 83.2 214.4L291.2 370.4C308.3 383.2 331.7 383.2 348.8 370.4L556.8 214.4C568.9 205.3 576 191.1 576 176C576 149.5 554.5 128 528 128L112 128zM64 260L64 448C64 483.3 92.7 512 128 512L512 512C547.3 512 576 483.3 576 448L576 260L377.6 408.8C343.5 434.4 296.5 434.4 262.4 408.8L64 260z"/>
                        </svg>
                        ${mailStr}
                    </p>
                </div>
                
                <div class="card-actions">
                    <button class="btn-xs outline-green" onclick="abrirEdicion(${dniNum})">EDITAR</button>
                    <button class="btn-xs" style="color: #00bcd4; border-color: rgba(0,188,212,0.4);" onclick="imprimirUsuario(${dniNum})">IMPRIMIR</button>
                    <button class="btn-xs" style="color: #ff3838; border-color: rgba(255,56,56,0.3);" onclick="eliminarUsuario(${dniNum})">ELIMINAR</button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    panel.innerHTML = html;
}


function renderDashboardAdmin() {
    // 1. Le marcamos al usuario que está en el módulo de Usuarios
    document.getElementById('titulo-seccion').innerText = 'Gestión de Usuarios';
    
    // 2. Pintamos la pestaña lateral de verde
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    const tabUsuarios = document.querySelector('.tab-btn[data-tab="usuarios"]');
    if(tabUsuarios) tabUsuarios.classList.add('active');
    
    // 3. ¡LA CLAVE! Dibujamos el panel directamente sin simular clics
    renderizarModulo('usuarios');
}

// ==========================================================================
// LÓGICA DE EDICIÓN DE USUARIOS (PUT)
// ==========================================================================

// 1. Abrir modal y cargar datos (Reemplaza a la función vieja)
function abrirEdicion(dniBuscado) {
    const usuario = usuariosCacheados.find(u => 
        (u.dni == dniBuscado) || (u.Dni == dniBuscado) || (u.DNI == dniBuscado)
    );

    if (!usuario) {
        alert("Error: No se encontraron los datos en memoria.");
        return;
    }

    console.log("👀 USUARIO QUE LLEGÓ DE C#:", usuario);

    // Datos del usuario
    document.getElementById('edit-dni-original').value = dniBuscado;
    document.getElementById('edit-dni').value = dniBuscado;
    document.getElementById('edit-nombre').value = usuario.nombre || usuario.Nombre || '';
    document.getElementById('edit-apellido').value = usuario.apellido || usuario.Apellido || '';
    document.getElementById('edit-mail').value = usuario.mail || usuario.Mail || '';
    document.getElementById('edit-telefono').value = usuario.telefono || usuario.Telefono || '';

    // Dirección COMPLETA
    const dir = usuario.direccion_ || usuario.Direccion_ || usuario.direccion || usuario.Direccion || {};

    console.log("📍 DIRECCIÓN ATRAPADA:", dir);
    
    // Atrapamos el ID de la dirección (muy importante para Entity Framework)
    document.getElementById('edit-direccion-id').value = dir.id || dir.Id || 0;
    
    document.getElementById('edit-calle').value = dir.calle || dir.Calle || '';
    document.getElementById('edit-numero').value = dir.numero || dir.Numero || '';
    document.getElementById('edit-localidad').value = dir.localidad || dir.Localidad || '';
    document.getElementById('edit-barrio').value = dir.barrio || dir.Barrio || '';
    
    // Atajamos variaciones comunes del código postal
    document.getElementById('edit-cp').value = dir.codigoPostal || dir.CodigoPostal || dir.codigo_postal || '';

    // Abrimos el popup
    document.getElementById('modal-editar-usuario').showModal();
}

// 2. Interceptar el formulario para enviar el paquete completo a C#
document.getElementById('form-editar-usuario').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const dniParaUrl = document.getElementById('edit-dni-original').value;
    const token = localStorage.getItem('tokenGolAhora');

    // 👇 NUEVO: Buscamos en la memoria el rol que ya tenía este usuario
    const usuarioCache = usuariosCacheados.find(u => u.dni == dniParaUrl || u.Dni == dniParaUrl || u.DNI == dniParaUrl);
    let rolOriginal = 'Cliente'; // Default por las dudas
    if (usuarioCache) {
        rolOriginal = usuarioCache.rol || usuarioCache.Rol || usuarioCache.role || 'Cliente';
        if (Array.isArray(rolOriginal)) rolOriginal = rolOriginal[0];
    }

    // Construimos el DTO con la dirección al 100% Y EL ROL
    const usuarioModificado = {
        nombre: document.getElementById('edit-nombre').value.trim(),
        apellido: document.getElementById('edit-apellido').value.trim(),
        dni: parseInt(dniParaUrl),
        mail: document.getElementById('edit-mail').value.trim(),
        telefono: parseInt(document.getElementById('edit-telefono').value) || 0,
        rol: rolOriginal, // 👇 ACÁ LE MANDAMOS EL ROL PARA QUE C# NO SE QUEJE 👇
        direccion_: {
            id: parseInt(document.getElementById('edit-direccion-id').value) || 0,
            calle: document.getElementById('edit-calle').value.trim(),
            numero: parseInt(document.getElementById('edit-numero').value) || 0,
            localidad: document.getElementById('edit-localidad').value.trim(),
            barrio: document.getElementById('edit-barrio').value.trim(),
            codigoPostal: document.getElementById('edit-cp').value.trim() 
        }
    };

    try {
        const respuesta = await fetch(`${URL_ADMIN}/modificar-usuario/${dniParaUrl}`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioModificado)
        });

        if (!respuesta.ok) {
            const errorDetails = await respuesta.text();
            console.error("Detalles del rechazo de C#:", errorDetails);
            throw new Error('El backend rechazó la actualización.');
        }

        // 1. Cerramos el modal
        document.getElementById('modal-editar-usuario').close();
        
        // 2. Vaciamos la memoria obligando a JS a olvidarse de los datos viejos
        usuariosCacheados = []; 
        
        // 3. Forzamos la descarga automática y el refresco visual
        await filtrarUsuariosCacheados(); 
        
        alert(`¡Los datos de ${usuarioModificado.nombre} fueron actualizados correctamente!`);

    } catch (error) {
        console.error("Error al modificar:", error);
        alert(error.message);
    } 
});


// ==========================================================================
// LÓGICA DE ASCENSO A INSTRUCTOR (Flujo Controlado y Autocompletado)
// ==========================================================================

function abrirModalAscenso() {
    document.getElementById('form-ascenso-instructor').reset();
    document.getElementById('form-crear-certificado').reset();
    
    // Bloqueamos absolutamente todo hasta que busquen un DNI válido
    document.getElementById('info-usuario-ascenso').style.display = 'none';
    document.getElementById('seccion-btn-certificado').style.display = 'none';
    document.getElementById('seccion-certificado-ok').style.display = 'none';
    document.getElementById('inst-id-certificado').value = '';
    
    const seccionPaso2 = document.getElementById('seccion-datos-instructor');
    seccionPaso2.style.opacity = '0.3';
    seccionPaso2.style.pointerEvents = 'none';
    document.getElementById('btn-submit-ascenso').disabled = true;

    document.getElementById('modal-ascenso-instructor').showModal();
}

// Si el usuario modifica el DNI después de haber buscado, volvemos a bloquear todo
document.getElementById('ascenso-dni').addEventListener('input', () => {
    document.getElementById('info-usuario-ascenso').style.display = 'none';
    document.getElementById('seccion-btn-certificado').style.display = 'none';
    document.getElementById('seccion-certificado-ok').style.display = 'none';
    document.getElementById('seccion-datos-instructor').style.opacity = '0.3';
    document.getElementById('seccion-datos-instructor').style.pointerEvents = 'none';
    document.getElementById('btn-submit-ascenso').disabled = true;

    const btnSubmit = document.getElementById('btn-submit-ascenso');
    btnSubmit.disabled = true;
    btnSubmit.innerText = 'CONFIRMAR ASCENSO';
});

// Verifica el DNI en la base de datos y autocompleta perfiles existentes
async function verificarDniAscenso() {
    const dni = document.getElementById('ascenso-dni').value.trim();
    const infoMsg = document.getElementById('info-usuario-ascenso');
    const seccionCert = document.getElementById('seccion-btn-certificado');
    const seccionOk = document.getElementById('seccion-certificado-ok');
    const seccionDatos = document.getElementById('seccion-datos-instructor');
    const inputCertId = document.getElementById('inst-id-certificado');
    const btnSubmit = document.getElementById('btn-submit-ascenso');

    if (!dni) {
        infoMsg.innerText = '❌ Ingresá un DNI primero.';
        infoMsg.style.color = '#ff3838';
        infoMsg.style.display = 'block';
        return;
    }

    infoMsg.innerText = '⏳ Buscando usuario en la base de datos...';
    infoMsg.style.color = '#ff9800';
    infoMsg.style.display = 'block';

    try {
        const token = localStorage.getItem('tokenGolAhora');
        const respuesta = await fetch(`${URL_ADMIN}/buscar/${dni}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!respuesta.ok) throw new Error('Usuario no encontrado en el sistema.');
        const usuario = await respuesta.json();

        console.log("🕵️‍♂️ DATOS QUE LLEGARON DE C#:", usuario);

        // Limpiamos y normalizamos el rol recibido de la API
        let rol = usuario.rol || usuario.Rol || usuario.role || 'Cliente';
        if (Array.isArray(rol)) rol = rol[0];
        rol = String(rol).toLowerCase().trim();

        const nombreComp = `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim();

        // ESCENARIO 1: Es Administrador
        if (rol === 'administrador' || rol === 'admin') {
            infoMsg.innerText = `${nombreComp} es Administrador. No podés modificar su rol por acá.`;
            infoMsg.style.color = '#ff3838';
            return;
        }

        // Extraemos el objeto anidado del instructor (por si C# lo manda agrupado)
        const inst = usuario.instructor_ || usuario.Instructor_ || usuario.instructor || usuario.Instructor || {};

        // ESCENARIO 2: Es Cliente (Requiere cargar un certificado nuevo)
        if (rol === 'cliente') {
            infoMsg.innerText = `Cliente encontrado: ${nombreComp}. Por favor, cargá su certificado.`;
            infoMsg.style.color = 'var(--color-primario)';
            
            seccionCert.style.display = 'block'; 
            seccionOk.style.display = 'none';
            inputCertId.value = ''; 
            
            document.getElementById('inst-especialidad').value = '';
            document.getElementById('inst-antiguedad').value = '0';
            document.getElementById('inst-tipo').selectedIndex = 0;

            btnSubmit.innerText = 'CONFIRMAR ASCENSO';
            return;
        }

        // ESCENARIO 3: Ya es Instructor (Trae datos actuales y preserva el certificado original)
        if (rol === 'profesor' || rol === 'entrenador' || rol === 'profe') {
            infoMsg.innerText = `${nombreComp} ya es ${rol.toUpperCase()}. Podés actualizar su perfil y especialidad.`;
            infoMsg.style.color = '#ff9800';
            
            seccionCert.style.display = 'none';
            seccionOk.style.display = 'block';
            seccionOk.innerHTML = `<span style="color: var(--color-primario); font-weight: bold;">Certificado Existente</span>`;
            
            // 👇 SOLUCIÓN: Búsqueda expansiva (busca en el objeto anidado o en la raíz si es un DTO) 👇
            const especialidadReal = inst.especialidad || inst.Especialidad || usuario.especialidad || usuario.Especialidad || '';
            const antiguedadReal = inst.antiguedad || inst.Antiguedad || usuario.antiguedad || usuario.Antiguedad || 0;
            const idCertExistente = inst.idCertificado || inst.IdCertificado || usuario.idCertificado || usuario.IdCertificado || 0;

            // Rellenamos los campos con la data encontrada
            document.getElementById('inst-especialidad').value = especialidadReal;
            document.getElementById('inst-antiguedad').value = antiguedadReal;
            inputCertId.value = idCertExistente;
            
            // Desbloqueamos el paso 2 directamente
            seccionDatos.style.opacity = '1';
            seccionDatos.style.pointerEvents = 'auto';
            btnSubmit.disabled = false;

            btnSubmit.innerText = 'ACTUALIZAR DATOS';

            //Autocompletado del select según la palabra clave del rol 
            const selectTipo = document.getElementById('inst-tipo');
            if (rol.includes('profe')) {
                selectTipo.value = 'Profesor';
            } else if (rol.includes('entrena')) {
                selectTipo.value = 'Entrenador';
            } else {
                selectTipo.selectedIndex = 0; // Fallback
            }
        }

    } catch(error) {
        infoMsg.innerText = `${error.message}`;
        infoMsg.style.color = '#ff3838';
    }
}

// --- PASO 2: Confirmar el Ascenso Final ---
document.getElementById('form-ascenso-instructor').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('tokenGolAhora');
    const dni = document.getElementById('ascenso-dni').value.trim();
    const btnSubmit = document.getElementById('btn-submit-ascenso'); // Selector directo e inequívoco
    document.getElementById('modal-ascenso-instructor').showModal();

    const certIdRaw = document.getElementById('inst-id-certificado').value;
    const idCertificadoFinal = certIdRaw ? parseInt(certIdRaw) : 0;

    const paqueteAscenso = {
        idCertificado: idCertificadoFinal,
        especialidad: document.getElementById('inst-especialidad').value.trim(),
        antiguedad: parseInt(document.getElementById('inst-antiguedad').value) || 0,
        tipoInstructor: document.getElementById('inst-tipo').value
    };

    const textoOriginal = btnSubmit.innerText;
    btnSubmit.innerText = 'PROCESANDO...';
    btnSubmit.disabled = true;

    try {
        const respuesta = await fetch(`${URL_ADMIN}/${dni}/ascender-instructor`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(paqueteAscenso)
        });

        if (!respuesta.ok) {
            const errorData = await respuesta.json().catch(() => ({}));
            throw new Error(errorData.mensaje || 'Hubo un error en el servidor al procesar el ascenso.');
        }

        // Cierre limpio del modal e información de éxito
        const modalAscenso = document.getElementById('modal-ascenso-instructor');
        if (modalAscenso) modalAscenso.close();
        
        alert('¡El perfil de Instructor fue actualizado con éxito!');
        
        // Limpiamos la caché para forzar la recarga visual de las tarjetas
        usuariosCacheados = []; 
        await filtrarUsuariosCacheados(); 

    } catch (error) {
        console.error("Error en el envío del formulario:", error);
        alert(`No se pudo completar el ascenso: ${error.message}`);
    } finally {
        // Restauramos el botón pase lo que pase
        btnSubmit.innerText = textoOriginal;
        btnSubmit.disabled = false;
    }
});

async function imprimirUsuario(dni) {
    try {
        const token = localStorage.getItem('tokenGolAhora');
        // Llamada a tu ruta: /api/admin/{dni}/imprimir
        const respuesta = await fetch(`${URL_ADMIN}/${dni}/imprimir`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!respuesta.ok) throw new Error('Error al generar impresión');
        
        alert(`¡Petición de impresión para el DNI ${dni} enviada con éxito al backend!`);
        // Si el backend te devuelve un PDF, acá usaríamos un window.open() o un blob para descargarlo.
    } catch (error) {
        console.error("Fallo la impresión:", error);
    }
}

// ==========================================================================
// FUNCIÓN PARA ELIMINAR USUARIO (DELETE)
// ==========================================================================
async function eliminarUsuario(dni) {
    // 1. Pedimos confirmación al usuario
    const confirmacion = confirm(`¿Estás seguro de que querés eliminar al usuario con DNI: ${dni}? Esta acción no se puede deshacer.`);
    
    if (!confirmacion) return; // Si cancela, no hacemos nada

    try {
        const token = localStorage.getItem('tokenGolAhora');
        
        // 2. Llamada al endpoint DELETE de tu controlador
        const respuesta = await fetch(`${URL_ADMIN}/${dni}/eliminar`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) {
            const error = await respuesta.json();
            throw new Error(error.mensaje || 'Error al intentar eliminar');
        }

        // 3. Si fue exitoso:
        alert("Usuario eliminado correctamente.");
        
        // 4. Refrescamos la lista automáticamente
        // Volvemos a ejecutar la función de filtrado para que la tarjeta desaparezca
        usuariosCacheados = usuariosCacheados.filter(u => u.dni != dni && u.Dni != dni && u.DNI != dni);
        filtrarUsuariosCacheados(); 

    } catch (error) {
        console.error("Error en eliminación:", error);
        alert(error.message);
    }
}


// =====================================================================================
// --- FASE 2: MÓDULOS DE GESTIÓN (Canchas, Reservas, Pagos, Ligas y Equipos) ---
// =====================================================================================

// -------------------------------------------------------------------------------------
// 1. GESTIÓN DE CANCHAS
// -------------------------------------------------------------------------------------
async function abrirModalNuevaCancha() {
    const modalPrevio = document.getElementById('modal-nueva-cancha');
    if (modalPrevio) modalPrevio.remove();

    const modalCanchaHTML = `
        <div id="modal-nueva-cancha" class="modal-overlay mostrar" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px);">
            <div class="glass-panel modal-box">
                <button onclick="document.getElementById('modal-nueva-cancha').remove()" class="btn-close-x">×</button>
                <h2 style="margin-bottom: 25px; font-size: 1.6rem; border-bottom: 2px solid rgba(57, 255, 20, 0.3); padding-bottom: 5px;">NUEVA CANCHA</h2>
                <form onsubmit="guardarNuevaCanchaAdmin(event)">
                    
                    <div class="input-group">
                        <label style="display:flex; justify-content:space-between; align-items:center;">
                            TIPO DE CANCHA
                            <button type="button" class="btn-xs" style="padding: 2px 8px; font-size: 0.7rem;" onclick="abrirModalNuevoTipoCancha()">+ CREAR TIPO</button>
                        </label>
                        <select id="nueva-cancha-tipo" class="input-saas" required>
                            <option value="">Cargando tipos...</option>
                        </select>
                    </div>

                    <div class="input-group">
                        <label>DÍAS HÁBILES</label>
                        <input type="text" id="nueva-cancha-dias" class="input-saas" placeholder="Ej: Lunes a Sabado" required>
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <div class="input-group" style="flex: 1;">
                            <label>HORA INICIO</label>
                            <input type="time" id="nueva-cancha-inicio" class="input-saas" required>
                        </div>
                        <div class="input-group" style="flex: 1;">
                            <label>HORA FIN</label>
                            <input type="time" id="nueva-cancha-fin" class="input-saas" required>
                        </div>
                    </div>
                    
                    <div class="input-group">
                        <label>DURACIÓN DEL TURNO (Minutos)</label>
                        <input type="number" id="nueva-cancha-duracion" class="input-saas" placeholder="Ej: 60" required>
                    </div>
                    
                    <button type="submit" class="btn-reserve" style="margin-top: 15px;">GUARDAR CANCHA</button>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalCanchaHTML);
    
    // Disparamos la carga de tipos apenas se abre el modal
    await cargarTiposDeCanchaEnSelect();
}

// 2. RELLENAR EL SELECT DINÁMICAMENTE
async function cargarTiposDeCanchaEnSelect(idAutoSelect = null) {
    const select = document.getElementById('nueva-cancha-tipo');
    if (!select) return;

    try {
        const response = await fetch(API_URL+ '/TipoCanchas', { headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }});
        const tipos = await response.json();
        
        select.innerHTML = '<option value="" disabled selected>-- Seleccione un tipo --</option>';
        tipos.forEach(t => {
            select.innerHTML += `<option value="${t.idTipoCancha}">${t.nombre} (${t.superficie}) - Cap: ${t.capacidad}</option>`;
        });

        // Si venimos de crear uno nuevo, lo autoseleccionamos
        if (idAutoSelect) select.value = idAutoSelect;

    } catch (error) {
        select.innerHTML = '<option value="">Error al cargar</option>';
    }
}

// 3. SUB-MODAL: CREAR NUEVO TIPO DE CANCHA
function abrirModalNuevoTipoCancha() {
    const modalHTML = `
        <div id="modal-nuevo-tipo" class="modal-overlay mostrar" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.9); z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div class="glass-panel modal-box" style="border-color: #00bcd4; box-shadow: 0 15px 35px rgba(0, 188, 212, 0.2);">
                <button onclick="document.getElementById('modal-nuevo-tipo').remove()" class="btn-close-x">×</button>
                <h2 style="border-bottom-color: #00bcd4;">NUEVO TIPO</h2>
                <form onsubmit="guardarNuevoTipoCancha(event)">
                    <div class="input-group">
                        <label style="color: #00bcd4;">NOMBRE</label>
                        <input type="text" id="nuevo-tipo-nombre" placeholder="Ej: Fútbol 5 Premium" required>
                    </div>
                    <div class="input-group">
                        <label style="color: #00bcd4;">SUPERFICIE</label>
                        <select id="nuevo-tipo-superficie" required>
                            <option value="Sintético">Sintético</option>
                            <option value="Césped Natural">Césped Natural</option>
                            <option value="Cemento">Cemento</option>
                        </select>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <div class="input-group" style="flex: 1;">
                            <label style="color: #00bcd4;">CAPACIDAD</label>
                            <input type="number" id="nuevo-tipo-capacidad" required>
                        </div>
                        <div class="input-group" style="flex: 1;">
                            <label style="color: #00bcd4;">PRECIO BASE</label>
                            <input type="number" step="0.01" id="nuevo-tipo-precio" required>
                        </div>
                    </div>
                    <button type="submit" class="btn-reserve" style="background: #00bcd4; margin-top: 15px;">GUARDAR TIPO</button>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

async function guardarNuevoTipoCancha(event) {
    event.preventDefault();
    const nuevoTipo = {
        Nombre: document.getElementById('nuevo-tipo-nombre').value,
        Superficie: document.getElementById('nuevo-tipo-superficie').value,
        Capacidad: parseInt(document.getElementById('nuevo-tipo-capacidad').value),
        Precio: parseFloat(document.getElementById('nuevo-tipo-precio').value)
    };

    try {
        const response = await fetch(API_URL+'/TipoCanchas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` },
            body: JSON.stringify(nuevoTipo)
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('modal-nuevo-tipo').remove(); 
            // Recargamos el select del modal principal y seleccionamos el que acabamos de crear
            await cargarTiposDeCanchaEnSelect(data.id); 
        } else {
            alert('Error al crear el tipo de cancha.');
        }
    } catch (error) { alert('Error de conexión.'); }
}

async function guardarNuevaCanchaAdmin(event) {
    event.preventDefault();
    
    try {
        // Armamos el objeto SOLO con los datos físicos de la cancha (la normalización que hicimos)
        const nuevaCancha = {
            IdTipoCancha: parseInt(document.getElementById('nueva-cancha-tipo').value),
            DiasHabiles: document.getElementById('nueva-cancha-dias').value,
            HoraInicio: document.getElementById('nueva-cancha-inicio').value + ":00",
            HoraFin: document.getElementById('nueva-cancha-fin').value + ":00",
            DuracionMaxima: parseInt(document.getElementById('nueva-cancha-duracion').value),
            Disponible: true
        };

        const response = await fetch(API_URL+'/Canchas', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` 
            },
            body: JSON.stringify(nuevaCancha)
        });

        if (response.ok) {
            alert('¡Cancha registrada con éxito!');
            document.getElementById('modal-nueva-cancha').remove(); 
            cargarCanchasAdmin();
        } else {
            const data = await response.json(); 
            alert(data.mensaje || 'Error al guardar la cancha.');
        }
    } catch (error) { 
        console.error("Error capturado:", error);
        alert('Error de conexión al guardar.'); 
    }
}


async function cargarCanchasAdmin() {
    const grid = document.getElementById('grid-canchas');
    try {
        const response = await fetch(API_URL+'/Canchas', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }
        });
        
        if (!response.ok) throw new Error("No se pudo cargar las canchas");
        const canchas = await response.json();
        
        let html = '';
        if(canchas.length === 0) {
            grid.innerHTML = "<p style='color:white'>No hay canchas registradas en el sistema.</p>";
            return;
        }

        canchas.forEach(c => {
            let estadoTexto = c.disponible ? "LIBRE" : "MANTENIMIENTO";
            let colorEstado = c.disponible ? '#39FF14' : '#ff9800'; 
            let textoBotonEstado = c.disponible ? "MANTENIMIENTO" : "HABILITAR";
            
            let nombresTipos = { 1: "Fútbol 5", 2: "Fútbol 7", 3: "Fútbol 11" };
            let nombreCancha = c.tipoDeCancha ? c.tipoDeCancha.nombre : (nombresTipos[c.idTipoCancha] || "Cancha");

            let horaInicioFormateada = c.horaInicio.substring(0,5);
            let horaFinFormateada = c.horaFin.substring(0,5);

            
            html += `
                <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 25px; text-align: left; position: relative;">
                    <span style="position: absolute; top: 20px; right: 20px; color: ${colorEstado}; font-size: 0.7rem; font-weight: bold; padding: 3px 8px; border: 1px solid ${colorEstado}; border-radius: 4px;">${estadoTexto}</span>
                    
                    <h3 style="font-size: 1.2rem; margin-bottom: 5px;">Cancha N° ${c.idCancha}</h3>
                    <p style="color: #888; font-size: 0.8rem; margin-bottom: 15px;">Tipo: ${nombreCancha}</p>
                    
                    <p style="font-size: 0.9rem; margin-bottom: 5px;">Días: ${c.diasHabiles}</p>
                    <p style="font-size: 0.9rem; margin-bottom: 25px;">Horario: ${horaInicioFormateada} a ${horaFinFormateada}</p>
                    
                    <div style="display: flex; gap: 10px;">
                        <button class="btn-xs" style="background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); flex: 1;" onclick="editarCancha(${c.idCancha})">EDITAR</button>
                        <button class="btn-xs btn-print" style="flex: 1;" onclick="imprimirCancha(${c.idCancha})">IMPRIMIR</button>
                    </div>
                    <button class="btn-xs" style="background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.2); color: ${colorEstado}; margin-top: 10px; width: 100%;" onclick="toggleMantenimientoCancha(${c.idCancha})">${textoBotonEstado}</button>
                    <button class="btn-xs" style="background: rgba(255, 56, 56, 0.1); border-color: rgba(255, 56, 56, 0.3); color: #ff3838; margin-top: 10px; width: 100%;" onclick="eliminarCancha(${c.idCancha})">ELIMINAR</button>
                </div>
            `;
        });
        grid.innerHTML = html;
    } catch (error) {
        grid.innerHTML = `<p style="color: red;">Error al procesar los datos de las canchas.</p>`;
    }
}

async function editarCancha(id) {
    try {
        const response = await fetch(API_URL+`/Canchas/${id}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }});
        if (!response.ok) throw new Error();
        const c = await response.json();

        let horaInicioCorta = c.horaInicio.substring(0, 5);
        let horaFinCorta = c.horaFin.substring(0, 5);

        const modalPrevio = document.getElementById('modal-editar-cancha');
        if (modalPrevio) modalPrevio.remove();

        // 1. Traemos los tipos de cancha para armar el select dinámico
        const resTipos = await fetch(API_URL+'/TipoCanchas', { headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }});
        const tipos = await resTipos.json();
        
        let opcionesTipos = '';
        tipos.forEach(t => {
            const seleccionado = c.idTipoCancha === t.idTipoCancha ? 'selected' : '';
            opcionesTipos += `<option value="${t.idTipoCancha}" ${seleccionado}>${t.nombre} (${t.superficie}) - Cap: ${t.capacidad}</option>`;
        });

        // 2. Armamos el modal limpio sin superficie ni capacidad
        const modalEditHTML = `
            <div id="modal-editar-cancha" class="modal-overlay mostrar" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px);">
                <div class="glass-panel modal-box">
                    <button onclick="document.getElementById('modal-editar-cancha').remove()" class="btn-close-x">×</button>
                    <h2 style="margin-bottom: 25px; font-size: 1.6rem; border-bottom: 2px solid rgba(57, 255, 20, 0.3); padding-bottom: 5px;">EDITAR CANCHA N° ${id}</h2>
                    <form onsubmit="guardarEdicionCancha(event, ${id}, ${c.disponible})">
                        <div class="input-group">
                            <label>TIPO DE CANCHA</label>
                            <select id="edit-cancha-tipo" class="input-saas" required>
                                ${opcionesTipos}
                            </select>
                        </div>
                        <div class="input-group">
                            <label>DÍAS HÁBILES</label>
                            <input type="text" id="edit-cancha-dias" class="input-saas" value="${c.diasHabiles}" required>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <div class="input-group" style="flex: 1;">
                                <label>HORA INICIO</label>
                                <input type="time" id="edit-cancha-inicio" class="input-saas" value="${horaInicioCorta}" required>
                            </div>
                            <div class="input-group" style="flex: 1;">
                                <label>HORA FIN</label>
                                <input type="time" id="edit-cancha-fin" class="input-saas" value="${horaFinCorta}" required>
                            </div>
                        </div>
                        <div class="input-group">
                            <label>DURACIÓN (Min)</label>
                            <input type="number" id="edit-cancha-duracion" class="input-saas" value="${c.duracionMaxima}" required>
                        </div>
                        <button type="submit" class="btn-reserve" style="margin-top: 15px;">GUARDAR CAMBIOS</button>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalEditHTML);
    } catch (error) { alert('Error al cargar los datos de la cancha.'); }
}

async function guardarEdicionCancha(event, id, estadoDisponible) {
    event.preventDefault();
    
    const canchaEditada = {
        IdTipoCancha: parseInt(document.getElementById('edit-cancha-tipo').value),
        DiasHabiles: document.getElementById('edit-cancha-dias').value,
        HoraInicio: document.getElementById('edit-cancha-inicio').value.length === 5 ? document.getElementById('edit-cancha-inicio').value + ":00" : document.getElementById('edit-cancha-inicio').value,
        HoraFin: document.getElementById('edit-cancha-fin').value.length === 5 ? document.getElementById('edit-cancha-fin').value + ":00" : document.getElementById('edit-cancha-fin').value,
        DuracionMaxima: parseInt(document.getElementById('edit-cancha-duracion').value),
        Disponible: estadoDisponible
    };

    try {
        const response = await fetch(API_URL+`/Canchas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` },
            body: JSON.stringify(canchaEditada)
        });

        if (response.ok) {
            alert('Cancha modificada correctamente.');
            document.getElementById('modal-editar-cancha').remove(); 
            cargarCanchasAdmin();
        } else { 
            const data = await response.json();
            alert('Error: ' + (data.mensaje || 'No se pudo guardar.'));
        }
    } catch (error) { alert('Error de conexión.'); }
}

async function eliminarCancha(id) {
    if (!confirm(`¿Estás seguro de que querés eliminar la Cancha N° ${id}?`)) return;
    try {
        const response = await fetch(API_URL+`/Canchas/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }});
        if (response.ok) { cargarCanchasAdmin(); } 
        else { const data = await response.json(); alert(data.mensaje || 'Error al eliminar.'); }
    } catch (error) { alert('Error de conexión.'); }
}

async function toggleMantenimientoCancha(id) {
    try {
        const resGet = await fetch(API_URL+`/Canchas/${id}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }});
        const c = await resGet.json();

        c.disponible = !c.disponible;

        const resPut = await fetch(API_URL+`/Canchas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` },
            body: JSON.stringify(c)
        });

        if(resPut.ok) { cargarCanchasAdmin(); } else { alert("No se pudo cambiar el estado."); }
    } catch (error) { alert("Error de red al cambiar estado."); }
}

async function imprimirCancha(id) {
    try {
        const res = await fetch(API_URL+`/Canchas/${id}`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }});
        if (res.ok) {
            const c = await res.json();
            let estado = c.disponible ? "Habilitada y Libre" : "En Mantenimiento";
            const v = window.open('', '_blank', 'width=800,height=600');
            v.document.write(`<html><head><title>Ficha Cancha N° ${c.idCancha}</title><style>body{font-family:Arial; padding:40px;}</style></head><body><h2>Cancha N° ${c.idCancha}</h2><hr><p><strong>Tipo:</strong> ${c.tipoDeCancha ? c.tipoDeCancha.nombre : 'Fútbol'}</p><p><strong>Días:</strong> ${c.diasHabiles}</p><p><strong>Horarios:</strong> ${c.horaInicio} a ${c.horaFin}</p><p><strong>Estado:</strong> ${estado}</p><button onclick="window.print()" style="margin-top:30px; padding:10px;">IMPRIMIR</button></body></html>`);
        }
    } catch (e) { alert("Error."); }
}

// -------------------------------------------------------------------------------------
// 2. GESTIÓN DE RESERVAS Y PAGOS
// -------------------------------------------------------------------------------------

function cambiarFiltroEstadoReserva(boton) {
    document.querySelectorAll('.btn-filtro-estado').forEach(b => b.classList.remove('active'));
    boton.classList.add('active');
    filtroEstadoActual = boton.getAttribute('data-estado');
    cargarReservasAdmin();
}

async function cargarReservasAdmin() {
    const contenedorParrilla = document.getElementById('parrilla-canchas-container');
    const inputFecha = document.getElementById('filtro-reserva-fecha');
    if (!contenedorParrilla || !inputFecha) return;

    const fechaSeleccionada = inputFecha.value; 
    if (!fechaSeleccionada) return;

    // Dibujamos el estado de carga que desaparecerá cuando lleguen los datos
    contenedorParrilla.innerHTML = '<p style="color: #aaa; text-align: center; margin-top: 40px;">⏳ Sincronizando programación del día...</p>';

    const [year, month, day] = fechaSeleccionada.split('-');
    const fechaFormatoBackend = `${day}/${month}/${year}`;

    try {
        const response = await fetch(API_URL+'/Reserva/Todas', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }
        });
        
        if (!response.ok) throw new Error();
        const todasLasReservas = await response.json();

        // 1. Filtrar por Fecha
        let reservasFiltradas = todasLasReservas.filter(r => r.fecha === fechaFormatoBackend);

        // 2. Filtrar por Estado (Botonera)
        if (filtroEstadoActual !== 'todas') {
            reservasFiltradas = reservasFiltradas.filter(r => {
                const est = r.estadoReserva.toLowerCase();
                if (filtroEstadoActual === 'pendiente') return est === 'pendiente' || est === 'en revisión';
                if (filtroEstadoActual === 'confirmada') return est === 'confirmada';
                if (filtroEstadoActual === 'cancelada') return est === 'cancelada';
                return true;
            });
        }

        if (reservasFiltradas.length === 0) {
            contenedorParrilla.innerHTML = `<p style="color: #aaa; text-align: center; margin-top: 40px;">No hay turnos registrados para esta fecha con los filtros aplicados.</p>`;
            return;
        }

        // Agrupar por cancha
        const reservasPorCancha = {};
        reservasFiltradas.forEach(r => {
            if (!reservasPorCancha[r.cancha]) reservasPorCancha[r.cancha] = [];
            reservasPorCancha[r.cancha].push(r);
        });

        const ahora = new Date(); // El reloj exacto de la computadora ahora mismo
        let htmlParrilla = '';

        for (const nombreCancha in reservasPorCancha) {
            htmlParrilla += `
                <div class="seccion-cancha-parrilla" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 20px;">
                    <h3 style="color: #39FF14; font-size: 1.3rem; margin-bottom: 20px; border-bottom: 1px dashed rgba(57, 255, 20, 0.2); padding-bottom: 10px; display: flex; align-items: center; gap: 10px;">
                        🏟️ ${nombreCancha} 
                        <span style="font-size: 0.8rem; color: #888; font-weight: normal;">(${reservasPorCancha[nombreCancha].length} turnos)</span>
                    </h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px;">
            `;

            reservasPorCancha[nombreCancha].sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

            reservasPorCancha[nombreCancha].forEach(r => {
                // 👇 CÁLCULO ESTRICTO DE TIEMPO 👇
                const partesFecha = r.fecha.split('/'); 
                const [h, m] = r.horaInicio.split(':').map(Number);
                // Armamos un Date exacto: Año, Mes (0-indexado), Día, Hora, Minutos
                const fechaTurno = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0], h, m);
                
                const turnoYaPaso = fechaTurno <= ahora; // True si el reloj ya pasó esa hora

                let colorEstado = r.estadoReserva === 'Pendiente' ? '#ff9800' : 
                                  r.estadoReserva === 'En Revisión' ? '#00bcd4' : 
                                  r.estadoReserva === 'Confirmada' ? '#39FF14' : '#ff3838';

                let estadoVisual = r.estadoReserva;
                let cssConcretada = '';

                // Si ya se jugó y estaba pagada, es Concretada y la apagamos
                if (turnoYaPaso && r.estadoReserva === 'Confirmada') {
                    estadoVisual = 'Concretada';
                    colorEstado = '#888'; 
                    cssConcretada = 'opacity: 0.65; background: rgba(0,0,0,0.7);';
                }

                htmlParrilla += `
                    <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; border-left: 5px solid ${colorEstado}; position: relative; ${cssConcretada}">
                        
                        <span style="position: absolute; top: 15px; right: 15px; color: ${colorEstado}; font-size: 0.7rem; font-weight: bold; padding: 3px 8px; border: 1px solid ${colorEstado}; border-radius: 4px; text-transform: uppercase;">
                            ${estadoVisual}
                        </span>

                        <div style="margin-bottom: 15px; margin-top: 5px;">
                            <h3 style="font-size: 1.1rem; margin-bottom: 5px; color: white;">ID #${r.idReserva}</h3>
                            
                            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 15px; background: rgba(255,255,255,0.02); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                                <div>
                                    <span style="color: #777; display: block; font-size: 0.65rem; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Cliente</span>
                                    <span style="color: white; font-size: 0.9rem; font-weight: 500;">${r.cliente}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <div>
                                        <span style="color: #777; display: block; font-size: 0.65rem; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Inicio</span>
                                        <span style="color: white; font-size: 0.9rem; font-weight: bold;">${r.horaInicio} hs</span>
                                    </div>
                                    <div style="text-align: right;">
                                        <span style="color: #777; display: block; font-size: 0.65rem; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Fin</span>
                                        <span style="color: white; font-size: 0.9rem; font-weight: 500;">${r.horaFin} hs</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            ${r.estadoReserva === 'En Revisión' ? `
                                <button class="btn-xs" style="background: rgba(0, 188, 212, 0.1); border-color: rgba(0, 188, 212, 0.3); color: #00bcd4; width: 100%; margin-bottom: 8px;" onclick="window.open(API_URL+'/Reserva/Comprobante/${r.comprobantePath}', '_blank')">VER COMPROBANTE</button>
                            ` : ''}

                            ${(r.estadoReserva === 'Pendiente' || r.estadoReserva === 'En Revisión') && !turnoYaPaso ? `
                                <button class="btn-xs" style="background: rgba(57, 255, 20, 0.1); border-color: rgba(57, 255, 20, 0.3); color: #39FF14; width: 100%; margin-bottom: 8px;" onclick="confirmarReservaAdmin(${r.idReserva})">APROBAR PAGO</button>
                            ` : ''}

                            ${r.estadoReserva === 'Cancelada' ? `
                                <div style="background: rgba(255,56,56,0.05); border: 1px dashed rgba(255,56,56,0.2); padding: 8px; border-radius: 6px; font-size: 0.75rem; color: #ff8888; text-align: center;">
                                    Reembolso procesado.
                                </div>
                            ` : ''}
                            
                            ${/* MAGIA: Si NO está cancelada Y NO PASÓ la hora, se puede cancelar. Si ya pasó, no se dibuja el botón */ ''}
                            ${(r.estadoReserva !== 'Cancelada' && !turnoYaPaso) ? `
                                <button class="btn-xs" style="background: rgba(255, 56, 56, 0.05); border-color: rgba(255, 56, 56, 0.15); color: #ff3838; width: 100%; margin-top: 5px;" onclick="cancelarReservaGlobal(${r.idReserva})">CANCELAR RESERVA</button>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
            htmlParrilla += `</div></div>`;
        }
        contenedorParrilla.innerHTML = htmlParrilla;
    } catch (error) {
        contenedorParrilla.innerHTML = `<p style="color: red; text-align: center; margin-top: 40px;">Error al conectar con la API de reservas.</p>`;
    }
}

async function cargarPagosAdmin() {
    const grid = document.getElementById('grid-pagos');
    if(!grid) return;
    try {
        const response = await fetch(API_URL+'/Reserva/Todas', { headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }});
        const reservas = await response.json();
        const pagos = reservas.filter(r => r.estadoReserva === 'Confirmada');
        
        if(pagos.length === 0) { grid.innerHTML = "<p style='color:white'>No hay pagos registrados aún.</p>"; return; }

        let html = '';
        pagos.forEach(p => {
            html += `
                <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(57, 255, 20, 0.3); border-left: 5px solid #39FF14; border-radius: 12px; padding: 20px;">
                    <h3 style="color: #39FF14; margin-bottom: 10px;">Recibo #000${p.idReserva}</h3>
                    <p style="color: #ddd;">👤 Cliente: ${p.cliente}</p>
                    <p style="color: #ddd; margin-bottom: 15px;">📅 Turno: ${p.fecha} - ${p.horaInicio}</p>
                    <button class="btn-xs" style="width:100%; border-color:#39FF14; color:#39FF14; background: rgba(57, 255, 20, 0.1);" onclick="imprimirRecibo(${p.idReserva}, '${p.cliente}', '${p.cancha}', '${p.fecha}', '${p.horaInicio}')">🖨️ EMITIR COMPROBANTE</button>
                </div>
            `;
        });
        grid.innerHTML = html;
    } catch (e) { grid.innerHTML = "<p style='color:red;'>Error al cargar historial.</p>"; }
}

async function confirmarReservaAdmin(id) {
    if (!confirm(`¿Confirmar pago y habilitar Reserva N° ${id}?`)) return;
    try {
        const response = await fetch(API_URL+`/Reserva/Confirmar/${id}`, { 
            method: 'PUT', headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }
        });
        if (response.ok) { cargarReservasAdmin(); } else { alert('Error al confirmar.'); }
    } catch (error) { alert('Error de conexión.'); }
}

async function cancelarReservaGlobal(id) {
    if (!confirm(`¿Estás seguro de cancelar la Reserva N° ${id}?`)) return;
    try {
        const response = await fetch(API_URL+`/Reserva/Cancelar/${id}`, {
            method: 'PUT', headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }
        });
        if (response.ok) { cargarReservasAdmin(); } else { alert("Error al cancelar."); }
    } catch (error) { alert('Error de conexión.'); }
}

function imprimirRecibo(id, cliente, cancha, fecha, horario) {
    const v = window.open('', '_blank', 'width=600,height=530');
    v.document.write(`<html><body style="font-family: Arial; padding: 20px;"><h2>RECIBO GOL AHORA</h2><hr><p>Recibo N°: 000${id}</p><p>Cliente: ${cliente}</p><p>Cancha: ${cancha}</p><p>Día: ${fecha} - ${horario}</p><p><strong>ESTADO: PAGADO</strong></p><button onclick="window.print()" style="margin-top:20px; padding:10px;">IMPRIMIR</button></body></html>`);
    v.document.close();
}


// -------------------------------------------------------------------------------------
// 3. LIGAS, TORNEOS Y EQUIPOS
// -------------------------------------------------------------------------------------
async function cargarCompeticionesAdmin(tipo) {
    const grid = document.getElementById('grid-competiciones');
    if(!grid) return;
    grid.innerHTML = `<p style='color:#ff9800;'>Cargando ${tipo.toLowerCase()}s desde el servidor...</p>`;
    
    const endpoint = tipo === 'Liga' ? API_URL+'/Ligas' : API_URL+'/Torneos';

    try {
        const response = await fetch(endpoint, { headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }});
        if (!response.ok) throw new Error();
        const competiciones = await response.json();

        if (competiciones.length === 0) {
            grid.innerHTML = `<div style="background: rgba(0, 0, 0, 0.4); border: 1px dashed rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 40px; text-align: center;"><h3 style="color: #aaa;">No hay ${tipo.toLowerCase()}s registradas.</h3></div>`;
            return;
        }

        let html = '';
        competiciones.forEach(c => {
            const cantEquipos = c.equipos ? c.equipos.length : 0;
            html += `
                <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(57, 255, 20, 0.3); border-radius: 12px; padding: 25px; text-align: left;">
                    <h3 style="font-size: 1.4rem; margin-bottom: 5px; color: #39FF14;">${c.nombreActividad}</h3>
                    <p style="color: #aaa; font-size: 0.9rem; margin-bottom: 15px;">Equipos inscriptos: <strong>${cantEquipos} / ${c.cupoMaximo}</strong></p>

                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <button class="btn-xs" style="background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.3); color: white;" onclick="gestionarEquipos(${c.idActividad}, '${tipo}')">GESTIONAR EQUIPOS</button>
                        <button class="btn-xs" style="background: rgba(255, 255, 0, 0.1); border-color: rgba(255, 255, 0, 0.3); color: #ffff00;" onclick="abrirModalEditarCompeticion(${c.idActividad}, '${c.nombreActividad}', ${c.cupoMaximo}, '${tipo}', ${cantEquipos})">EDITAR INFO</button>
                        <button class="btn-xs" style="background: rgba(57, 255, 20, 0.1); border-color: rgba(57, 255, 20, 0.3); color: #39FF14;" onclick="iniciarCompeticion(${c.idActividad}, '${tipo}')">GENERAR FIXTURE</button>
                        <button class="btn-xs" style="background: rgba(0, 188, 212, 0.1); border-color: rgba(0, 188, 212, 0.3); color: #00bcd4;" onclick="verFixture(${c.idActividad}, '${tipo}')">VER FIXTURE</button>
                        <button class="btn-xs" style="background: rgba(255, 56, 56, 0.1); border-color: rgba(255, 56, 56, 0.3); color: #ff3838;" onclick="eliminarCompeticion(${c.idActividad}, '${tipo}')">ELIMINAR</button>
                    </div>
                </div>
            `;
        });
        grid.innerHTML = html;
    } catch (error) { grid.innerHTML = `<p style="color: red;">Error de conexión.</p>`; }
}

function abrirModalNuevaCompeticion(tipo) {
    const articulo = tipo === 'Liga' ? 'LA' : 'EL';

    // 👇 1. CONDICIONAL PARA CANTIDAD DE EQUIPOS 👇
    let equiposHTML = '';
    if (tipo === 'Liga') {
        equiposHTML = `
            <div class="input-group" style="flex: 1;">
                <label>CANTIDAD DE EQUIPOS</label>
                <input type="number" id="comp-equipos" class="input-saas" min="2" max="32" placeholder="Ej: 20" required>
            </div>
        `;
    } else {
        // En torneos obligamos a elegir potencias de 2
        equiposHTML = `
            <div class="input-group" style="flex: 1;">
                <label>CANTIDAD DE EQUIPOS</label>
                <select id="comp-equipos" class="input-saas" required>
                    <option value="" disabled selected>Elegir cupo...</option>
                    <option value="4">4 Equipos (Semifinales)</option>
                    <option value="8">8 Equipos (Cuartos)</option>
                    <option value="16">16 Equipos (Octavos)</option>
                    <option value="32">32 Equipos (16avos)</option>
                </select>
            </div>
        `;
    }

    // Puntos o eliminacion
    let metricasHTML = '';
    if (tipo === 'Liga') {
        metricasHTML = `
            <h4 style="color: #39FF14; margin-top: 15px; margin-bottom: 10px; font-size: 0.9rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">MÉTRICAS DE PUNTUACIÓN</h4>
            <div style="display: flex; gap: 10px;">
                <div class="input-group"><label>PG</label><input type="number" id="comp-pts-victoria" class="input-saas" value="3" required></div>
                <div class="input-group"><label>PE</label><input type="number" id="comp-pts-empate" class="input-saas" value="1" required></div>
                <div class="input-group"><label>PP</label><input type="number" id="comp-pts-derrota" class="input-saas" value="0" required></div>
            </div>
        `;
    } else {
        // Ocultamos los inputs para que la función de C# no se rompa al buscar los valores
        metricasHTML = `
            <h4 style="color: #39FF14; margin-top: 15px; margin-bottom: 10px; font-size: 0.9rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px;">FORMATO DE ELIMINACIÓN</h4>
            <p style="color: #aaa; font-size: 0.8rem; margin-bottom: 15px;">Mata-Mata. Llaves de eliminación directa donde el ganador avanza a la siguiente ronda.</p>
            <input type="hidden" id="comp-pts-victoria" value="3">
            <input type="hidden" id="comp-pts-empate" value="1">
            <input type="hidden" id="comp-pts-derrota" value="0">
        `;
    }

    // 3. ARMADO FINAL DEL MODAL
    const modalHTML = `
        <div id="modal-nueva-competicion" class="modal-overlay mostrar" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px);">
            <div class="glass-panel modal-box">
                <button onclick="document.getElementById('modal-nueva-competicion').remove()" class="btn-close-x">×</button>
                <h2 style="margin-bottom: 25px; font-size: 1.6rem; border-bottom: 2px solid rgba(57, 255, 20, 0.3); padding-bottom: 5px;">NUEVO/A ${tipo.toUpperCase()}</h2>
                <form id="form-competicion" onsubmit="guardarCompeticion(event, '${tipo}')">
                    <div class="input-group">
                        <label>NOMBRE DE ${articulo} ${tipo.toUpperCase()}</label>
                        <input type="text" id="comp-nombre" class="input-saas" placeholder="Ej: Copa Gol Ahora 2026" required>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        ${equiposHTML}
                        <div class="input-group" style="flex: 1;">
                            <label>TIPO DE FÚTBOL</label>
                            <select id="comp-tipo-futbol" class="input-saas">
                                <option value="Fútbol 5">Fútbol 5</option>
                                <option value="Fútbol 7">Fútbol 7</option>
                                <option value="Fútbol 11">Fútbol 11</option>
                            </select>
                        </div>
                    </div>
                    ${metricasHTML}
                    <button type="submit" class="btn-reserve" style="margin-top: 15px;">CREAR E INICIAR INSCRIPCIONES</button>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

async function guardarCompeticion(event, tipo) {
    event.preventDefault();
    const btnSubmit = event.target.querySelector('button[type="submit"]');
    btnSubmit.disabled = true; btnSubmit.innerText = "GUARDANDO...";

    const nuevaCompeticion = {
        NombreActividad: document.getElementById('comp-nombre').value,
        CupoMaximo: parseInt(document.getElementById('comp-equipos').value),
        ReglamentoCompeticion: {
            TipoReglamento: document.getElementById('comp-tipo-futbol').value,
            PuntosPorVictoria: parseInt(document.getElementById('comp-pts-victoria').value),
            PuntosPorEmpate: parseInt(document.getElementById('comp-pts-empate').value),
            MaximaFaltasPorJugador: 5, CantidadCambios: 5
        }
    };

    const endpoint = tipo === 'Liga' ? API_URL+'/Ligas' : API_URL+'/Torneos';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` },
            body: JSON.stringify(nuevaCompeticion)
        });

        if (response.ok) {
            document.getElementById('modal-nueva-competicion').remove();
            cargarCompeticionesAdmin(tipo);
        } else {
            const data = await response.json(); alert(`Error: ${data.mensaje}`);
            btnSubmit.disabled = false; btnSubmit.innerText = "CREAR E INICIAR INSCRIPCIONES";
        }
    } catch (error) { alert("Error de conexión."); }
}

function abrirModalEditarCompeticion(id, nombreActual, cupoActual, tipo, cantEquipos = 0) {
    let inputCupoHTML = '';

    if (tipo === 'Liga') {
        // Ligas: Input numérico libre, pero con un mínimo dinámico
        inputCupoHTML = `
            <input type="number" id="edit-cupo-comp" class="input-saas" value="${cupoActual}" min="${cantEquipos}">
            <p style="color:#aaa; font-size:0.75rem; margin-top:5px;">Equipos inscriptos actualmente: ${cantEquipos}</p>
        `;
    } else {
        // Torneos: Select estricto de potencias de 2
        const opcionesTorneo = [4, 8, 16, 32, 64, 128];
        let optionsHTML = '';
        
        opcionesTorneo.forEach(op => {
            const disabled = op < cantEquipos ? 'disabled' : '';
            const extraText = op < cantEquipos ? ' (Bloqueado por inscriptos)' : '';
            const selected = op === cupoActual ? 'selected' : '';
            optionsHTML += `<option value="${op}" ${disabled} ${selected}>${op} Equipos ${extraText}</option>`;
        });

        inputCupoHTML = `
            <select id="edit-cupo-comp" class="input-saas">
                ${optionsHTML}
            </select>
            <p style="color:#aaa; font-size:0.75rem; margin-top:5px;">Equipos inscriptos actualmente: ${cantEquipos}</p>
        `;
    }

    const modalHTML = `
        <div id="modal-editar-competicion" class="modal-overlay mostrar" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px);">
            <div class="glass-panel modal-box" style="width: 400px; max-width: 90%;">
                <button onclick="document.getElementById('modal-editar-competicion').remove()" class="btn-close-x">×</button>
                <h2 style="margin-bottom: 25px; font-size: 1.6rem; border-bottom: 2px solid rgba(57, 255, 20, 0.3); padding-bottom: 5px;">EDITAR ${tipo.toUpperCase()}</h2>
                
                <div class="input-group">
                    <label>NOMBRE</label>
                    <input type="text" id="edit-nombre-comp" class="input-saas" value="${nombreActual}">
                </div>
                
                <div class="input-group">
                    <label>CUPO MÁXIMO</label>
                    ${inputCupoHTML}
                </div>
                
                <button class="btn-reserve outline-green" style="margin-top: 15px; width: 100%; border-color: #39FF14; color: #39FF14;" onclick="guardarEdicion(${id}, '${tipo}')">GUARDAR CAMBIOS</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

async function guardarEdicion(id, tipo) {
    const nuevoNombre = document.getElementById('edit-nombre-comp').value;
    const nuevoCupo = document.getElementById('edit-cupo-comp').value;
    const endpoint = tipo === 'Liga' ? API_URL+`/Ligas/${id}` : API_URL+`/Torneos/${id}`;

    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` },
            body: JSON.stringify({ NombreActividad: nuevoNombre, CupoMaximo: parseInt(nuevoCupo) })
        });

        if (response.ok) {
            document.getElementById('modal-editar-competicion').remove();
            cargarCompeticionesAdmin(tipo);
        } else { 
            const data = await response.json();
            // Esto atrapa nuestro BadRequest desde C# y se lo muestra al usuario
            alert(`Error: ${data.mensaje || 'No se pudo actualizar'}`); 
        }
    } catch (error) {
        alert("Error de conexión al servidor.");
    }
}

async function eliminarCompeticion(idCompeticion, tipo) {
    if (!confirm(`¿Eliminar este/a ${tipo}? Se borrarán equipos y el fixture.`)) return;
    const endpoint = tipo === 'Liga' ? API_URL+`/Ligas/${idCompeticion}` : API_URL+`/Torneos/${idCompeticion}`;

    try {
        const response = await fetch(endpoint, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }});
        if (response.ok) { cargarCompeticionesAdmin(tipo); } else { alert('Error al eliminar.'); }
    } catch (error) { alert('Error de red.'); }
}


// GESTIÓN DE INSCRIPCIONES 


async function gestionarEquipos(idCompeticion, tipo) {
    // Buscamos TODOS los equipos
    let opcionesEquipos = '<option value="" disabled selected>-- Seleccionar equipo --</option>';
    try {
        const token = localStorage.getItem('tokenGolAhora');
        const resEquipos = await fetch(API_URL+'/Equipos', { headers: { 'Authorization': `Bearer ${token}` }});
        if(resEquipos.ok) {
            const equipos = await resEquipos.json();
            equipos.forEach(eq => {
                opcionesEquipos += `<option value="${eq.idEquipo}">ID #${eq.idEquipo} - ${eq.nombre}</option>`;
            });
        }
    } catch(e) { console.error("Error cargando equipos", e); }

    // Armamos el Modal con paneles deslizables
    const modalHTML = `
        <div id="modal-gestionar-equipos" class="modal-overlay mostrar" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px);">
            <div class="glass-panel modal-box" style="width: 450px; height: 380px; position: relative; overflow: hidden;">
                <button onclick="document.getElementById('modal-gestionar-equipos').remove()" class="btn-close-x" style="z-index: 10;">×</button>
                
                <div id="panel-inscribir-existente" style="transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease; position: absolute; top: 35px; left: 35px; right: 35px;">
                    <h2 style="margin-bottom: 5px; font-size: 1.6rem; text-transform: uppercase; letter-spacing: 1px;">INSCRIPCIÓN</h2>
                    <p style="color:#aaa; font-size:0.85rem; margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">Seleccioná un equipo de la base de datos</p>
                    
                    <form onsubmit="inscribirEquipoExistente(event, ${idCompeticion}, '${tipo}')" style="display:flex; flex-direction:column; gap: 20px;">
                        <div class="input-group" style="margin:0;">
                            <label style="font-size:0.75rem; color:#888;">EQUIPO A INSCRIBIR</label>
                            <select id="select-equipo-inscribir" class="input-saas" required style="width:100%;">
                                ${opcionesEquipos}
                            </select>
                        </div>
                        
                        <button type="submit" class="btn-reserve" style="width: 100%; padding: 12px; box-shadow: none;">CONFIRMAR INSCRIPCIÓN</button>
                    </form>
                    
                    <div style="text-align: center; margin-top: 25px;">
                        <span style="color:#666; font-size: 0.85rem;">¿El equipo es nuevo?</span>
                        <button type="button" onclick="togglePanelesEquipos('nuevo')" style="background:transparent; border:none; color:var(--color-primario); font-weight:bold; cursor:pointer; font-size: 0.85rem; text-decoration:underline;">Crear equipo</button>
                    </div>
                </div>

                <div id="panel-crear-nuevo" style="transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease; position: absolute; top: 35px; left: 35px; right: 35px; transform: translateX(120%); opacity: 0; pointer-events: none;">
                    <h2 style="margin-bottom: 5px; font-size: 1.6rem; text-transform: uppercase; letter-spacing: 1px;">NUEVO EQUIPO</h2>
                    <p style="color:#aaa; font-size:0.85rem; margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">Registrar e inscribir directamente</p>
                    
                    <form onsubmit="crearEInscribirEquipo(event, ${idCompeticion}, '${tipo}')" style="display:flex; flex-direction:column; gap: 20px;">
                        <div class="input-group" style="margin:0;">
                            <label style="font-size:0.75rem; color:#888;">NOMBRE DEL EQUIPO</label>
                            <input type="text" id="input-nombre-equipo" class="input-saas" placeholder="Ej: Los Pibes FC" required style="width:100%;">
                        </div>
                        
                        <button type="submit" class="btn-reserve outline-green" style="width: 100%; padding: 12px; border-color:#00bcd4; color:#00bcd4; box-shadow: none;">CREAR E INSCRIBIR</button>
                    </form>
                    
                    <div style="text-align: center; margin-top: 25px;">
                        <span style="color:#666; font-size: 0.85rem;">¿Ya está registrado?</span>
                        <button type="button" onclick="togglePanelesEquipos('existente')" style="background:transparent; border:none; color:#00bcd4; font-weight:bold; cursor:pointer; font-size: 0.85rem; text-decoration:underline;">Buscar en la lista</button>
                    </div>
                </div>

            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}


// EFECTO VISUAL DE DESLIZAMIENTO

function togglePanelesEquipos(destino) {
    const panelExistente = document.getElementById('panel-inscribir-existente');
    const panelNuevo = document.getElementById('panel-crear-nuevo');
    
    if (destino === 'nuevo') {
        panelExistente.style.transform = 'translateX(-120%)';
        panelExistente.style.opacity = '0';
        panelExistente.style.pointerEvents = 'none';
        
        panelNuevo.style.transform = 'translateX(0)';
        panelNuevo.style.opacity = '1';
        panelNuevo.style.pointerEvents = 'auto';
    } else {
        panelNuevo.style.transform = 'translateX(120%)';
        panelNuevo.style.opacity = '0';
        panelNuevo.style.pointerEvents = 'none';
        
        panelExistente.style.transform = 'translateX(0)';
        panelExistente.style.opacity = '1';
        panelExistente.style.pointerEvents = 'auto';
    }
}


//INSCRIBIR EQUIPO DESDE EL SELECT

async function inscribirEquipoExistente(event, idCompeticion, tipo) {
    event.preventDefault();
    const idEquipo = document.getElementById('select-equipo-inscribir').value;
    if(!idEquipo) { alert("Seleccioná un equipo de la lista."); return; }
    
    const btnSubmit = event.target.querySelector('button[type="submit"]');
    btnSubmit.disabled = true; btnSubmit.innerText = "PROCESANDO...";

    const endpoint = tipo === 'Liga' ? API_URL+`/Ligas/${idCompeticion}/inscribir/${idEquipo}` : API_URL+`/Torneos/${idCompeticion}/inscribir/${idEquipo}`;

    try {
        const response = await fetch(endpoint, { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }});
        if(response.ok) {
            document.getElementById('modal-gestionar-equipos').remove();
            cargarCompeticionesAdmin(tipo);
        } else {
            const data = await response.json(); 
            alert(`Error: ${data.mensaje}`);
            btnSubmit.disabled = false; btnSubmit.innerText = "CONFIRMAR INSCRIPCIÓN";
        }
    } catch (error) { 
        alert('Error de conexión.'); 
        btnSubmit.disabled = false; btnSubmit.innerText = "CONFIRMAR INSCRIPCIÓN";
    }
}


// CREAR + INSCRIBIR AL MISMO TIEMPO)
async function crearEInscribirEquipo(event, idCompeticion, tipo) {
    event.preventDefault();
    const nombreEquipo = document.getElementById('input-nombre-equipo').value.trim();
    if (!nombreEquipo) return;

    const btnSubmit = event.target.querySelector('button[type="submit"]');
    btnSubmit.disabled = true; btnSubmit.innerText = "CREANDO...";

    try {
        // PASO 1: Crear el equipo de forma aislada
        const resCrear = await fetch(API_URL+'/Equipos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` },
            body: JSON.stringify({ Nombre: nombreEquipo })
        });

        if (!resCrear.ok) {
            alert('Error al intentar registrar el nombre del equipo.');
            btnSubmit.disabled = false; btnSubmit.innerText = "CREAR E INSCRIBIR";
            return;
        }

        const dataCrear = await resCrear.json();
        const idNuevoEquipo = dataCrear.equipo.idEquipo; // Extraemos el ID que nos devolvió MySQL

        // PASO 2: Inscribirlo instantáneamente
        btnSubmit.innerText = "INSCRIBIENDO...";
        const endpoint = tipo === 'Liga' ? API_URL+`/Ligas/${idCompeticion}/inscribir/${idNuevoEquipo}` : API_URL+`/Torneos/${idCompeticion}/inscribir/${idNuevoEquipo}`;

        const resInscribir = await fetch(endpoint, { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }});

        if (resInscribir.ok) {
            document.getElementById('modal-gestionar-equipos').remove();
            cargarCompeticionesAdmin(tipo); // Refrescamos la barra de progreso
        } else {
            const dataInsc = await resInscribir.json();
            alert(`Equipo creado con ID ${idNuevoEquipo}, pero no se pudo inscribir: ${dataInsc.mensaje}`);
            btnSubmit.disabled = false; btnSubmit.innerText = "CREAR E INSCRIBIR";
        }
    } catch (error) { 
        alert('Error de red durante el proceso.'); 
        btnSubmit.disabled = false; btnSubmit.innerText = "CREAR E INSCRIBIR";
    }
}

async function iniciarCompeticion(idCompeticion, tipo) {
    if (!confirm(`¿Generar fixture para este/a ${tipo}?`)) return;
    const endpoint = tipo === 'Liga' ? API_URL+`/Ligas/${idCompeticion}/iniciar` : API_URL+`/Torneos/${idCompeticion}/generar-fixture`;

    try {
        const response = await fetch(endpoint, { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }});
        if (response.ok) { alert(`Fixture generado.`); cargarCompeticionesAdmin(tipo); } 
        else { const data = await response.json(); alert(`Error: ${data.mensaje}`); }
    } catch (error) { alert('Error.'); }
}

async function verFixture(idCompeticion, tipo) {
    if (tipo !== 'Liga') return alert("Fixture de Torneos disponible pronto.");
    try {
        const response = await fetch(API_URL+`/Ligas/${idCompeticion}/fixture`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }});
        if (!response.ok) throw new Error();
        const fechas = await response.json();
        if (fechas.length === 0) return alert("Fixture no generado.");

        let modalHTML = `
            <div id="modal-ver-fixture" class="modal-overlay mostrar" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px);">
                <div class="glass-panel modal-box" style="max-width: 600px; max-height: 80vh; overflow-y: auto;">
                    <button onclick="document.getElementById('modal-ver-fixture').remove()" class="btn-close-x">×</button>
                    <h2 style="margin-bottom: 25px; font-size: 1.6rem; border-bottom: 2px solid rgba(57, 255, 20, 0.3); padding-bottom: 5px;">📅 FIXTURE</h2>
                    <div style="display: flex; flex-direction: column; gap: 20px;">
        `;
        fechas.forEach(fecha => {
            modalHTML += `<div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(57,255,20,0.3); border-radius: 8px; padding: 15px;"><h4 style="color: #39FF14; margin-bottom: 15px;">FECHA ${fecha.numeroFecha}</h4>`;
            if (fecha.partidos && fecha.partidos.length > 0) {
                fecha.partidos.forEach(partido => {
                    let loc = partido.local ? partido.local.nombre : "-";
                    let vis = partido.visitante ? partido.visitante.nombre : "-";
                    modalHTML += `
                        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed rgba(255,255,255,0.1); font-size: 0.9rem;">
                            <span style="flex: 1; text-align: right; font-weight: bold;">${loc}</span>
                            <span style="padding: 0 15px; color: #555;">vs</span>
                            <span style="flex: 1; text-align: left; font-weight: bold;">${vis}</span>
                        </div>
                    `;
                });
            }
            modalHTML += `</div>`;
        });
        modalHTML += `</div></div></div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    } catch (error) { alert("Error al cargar el fixture."); }
}


// Variable global para recordar el estado seleccionado sin perder el foco de la fecha
// Variables globales para recordar filtros
let filtroEstadoActual = 'todas';
let modoVistaReservas = 'dia'; // 'dia' o 'semana'

function cambiarFiltroEstadoReserva(boton) {
    document.querySelectorAll('.btn-filtro-estado[data-estado]').forEach(b => b.classList.remove('active'));
    boton.classList.add('active');
    filtroEstadoActual = boton.getAttribute('data-estado');
    cargarReservasAdmin();
}

function cambiarModoVistaReservas(modo) {
    modoVistaReservas = modo;
    document.getElementById('btn-vista-dia').classList.remove('active');
    document.getElementById('btn-vista-semana').classList.remove('active');
    
    // 👇 Agregado el limpiador del botón mes 👇
    const btnMes = document.getElementById('btn-vista-mes');
    if (btnMes) btnMes.classList.remove('active');
    
    document.getElementById(`btn-vista-${modo}`).classList.add('active');
    
    document.getElementById('label-fecha-admin').innerText = modo === 'dia' ? 'FECHA:' : 'DESDE:';
    cargarReservasAdmin();
}

async function cargarReservasAdmin() {
    const contenedorParrilla = document.getElementById('parrilla-canchas-container');
    const inputFecha = document.getElementById('filtro-reserva-fecha');
    if (!contenedorParrilla || !inputFecha) return;

    const fechaSeleccionada = inputFecha.value; 
    if (!fechaSeleccionada) return;

    contenedorParrilla.innerHTML = '<p style="color: #aaa; text-align: center; margin-top: 40px;">⏳ Sincronizando programación...</p>';

    const [year, month, day] = fechaSeleccionada.split('-');
    const fechaInicioDate = new Date(year, month - 1, day, 0, 0, 0);
    
    const fechaFinDate = new Date(year, month - 1, day, 23, 59, 59);
    
    // 👇 MAGIA DEL RADAR: Calculamos 7 o 30 días según el botón 👇
    if (modoVistaReservas === 'semana') {
        fechaFinDate.setDate(fechaFinDate.getDate() + 6); 
    } else if (modoVistaReservas === 'mes') {
        fechaFinDate.setDate(fechaFinDate.getDate() + 30); 
    }

    try {
        const response = await fetch(API_URL+'/Reserva/Todas', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }
        });
        
        if (!response.ok) throw new Error();
        const todasLasReservas = await response.json();

        let reservasFiltradas = todasLasReservas.filter(r => {
            const partesFecha = r.fecha.split('/'); 
            const fechaReservaTest = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0], 12, 0, 0); 
            return fechaReservaTest >= fechaInicioDate && fechaReservaTest <= fechaFinDate;
        });

        if (filtroEstadoActual !== 'todas') {
            reservasFiltradas = reservasFiltradas.filter(r => {
                const est = r.estadoReserva.toLowerCase();
                if (filtroEstadoActual === 'pendiente') return est === 'pendiente' || est === 'en revisión';
                if (filtroEstadoActual === 'confirmada') return est === 'confirmada';
                if (filtroEstadoActual === 'cancelada') return est === 'cancelada';
                return true;
            });
        }

        if (reservasFiltradas.length === 0) {
            contenedorParrilla.innerHTML = `<p style="color: #aaa; text-align: center; margin-top: 40px;">No hay turnos registrados en este período con los filtros aplicados.</p>`;
            return;
        }

        const reservasPorCancha = {};
        reservasFiltradas.forEach(r => {
            if (!reservasPorCancha[r.cancha]) reservasPorCancha[r.cancha] = [];
            reservasPorCancha[r.cancha].push(r);
        });

        const ahora = new Date(); 
        let htmlParrilla = '';

        for (const nombreCancha in reservasPorCancha) {
            htmlParrilla += `
                <div class="seccion-cancha-parrilla" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 20px;">
                    <h3 style="color: white; font-size: 1.3rem; margin-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
                        <span>Cancha: <span style="color: var(--color-primario);">${nombreCancha}</span></span>
                        <span style="font-size: 0.8rem; color: #888; font-weight: normal; background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 20px;">${reservasPorCancha[nombreCancha].length} turnos</span>
                    </h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px;">
            `;

            reservasPorCancha[nombreCancha].sort((a, b) => {
                const partsA = a.fecha.split('/');
                const partsB = b.fecha.split('/');
                const dateA = new Date(partsA[2], partsA[1] - 1, partsA[0], ...a.horaInicio.split(':').map(Number));
                const dateB = new Date(partsB[2], partsB[1] - 1, partsB[0], ...b.horaInicio.split(':').map(Number));
                return dateA - dateB;
            });

            reservasPorCancha[nombreCancha].forEach(r => {
                const partesFecha = r.fecha.split('/'); 
                const [h, m] = r.horaInicio.split(':').map(Number);
                const fechaTurno = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0], h, m);
                
                const turnoYaPaso = fechaTurno <= ahora;

                let colorEstado = r.estadoReserva === 'Pendiente' ? '#ff9800' : 
                                  r.estadoReserva === 'En Revisión' ? '#00bcd4' : 
                                  r.estadoReserva === 'Confirmada' ? '#39FF14' : '#ff3838';

                let estadoVisual = r.estadoReserva;
                let cssConcretada = '';

                if (turnoYaPaso && r.estadoReserva === 'Confirmada') {
                    estadoVisual = 'Concretada';
                    colorEstado = '#888'; 
                    cssConcretada = 'opacity: 0.65; background: rgba(0,0,0,0.7);';
                }

                const precioText = r.precio ? `$${r.precio.toLocaleString('es-AR')}` : 'A confirmar';

                htmlParrilla += `
                    <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; border-left: 5px solid ${colorEstado}; position: relative; ${cssConcretada}">
                        
                        <span style="position: absolute; top: 15px; right: 15px; color: ${colorEstado}; font-size: 0.7rem; font-weight: bold; padding: 3px 8px; border: 1px solid ${colorEstado}; border-radius: 4px; text-transform: uppercase;">
                            ${estadoVisual}
                        </span>

                        <div style="margin-bottom: 15px; margin-top: 5px;">
                            <h3 style="font-size: 1.1rem; margin-bottom: 5px; color: white;">ID #${r.idReserva}</h3>
                            
                            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 15px; background: rgba(255,255,255,0.02); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                                
                                ${(modoVistaReservas === 'semana' || modoVistaReservas === 'mes') ? `
                                    <div style="border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 8px; margin-bottom: 4px; text-align: center;">
                                        <span style="color: #39FF14; font-size: 0.9rem; font-weight: bold; letter-spacing: 1px;">📅 ${r.fecha}</span>
                                    </div>
                                ` : ''}

                                <div style="display: flex; justify-content: space-between;">
                                    <div>
                                        <span style="color: #777; display: block; font-size: 0.65rem; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Cliente</span>
                                        <span style="color: white; font-size: 0.9rem; font-weight: 500;">${r.cliente}</span>
                                    </div>
                                    <div style="text-align: right;">
                                        <span style="color: #777; display: block; font-size: 0.65rem; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Precio</span>
                                        <span style="color: #39FF14; font-size: 0.9rem; font-weight: bold;">${precioText}</span>
                                    </div>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <div>
                                        <span style="color: #777; display: block; font-size: 0.65rem; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Inicio</span>
                                        <span style="color: white; font-size: 0.9rem; font-weight: bold;">${r.horaInicio} hs</span>
                                    </div>
                                    <div style="text-align: right;">
                                        <span style="color: #777; display: block; font-size: 0.65rem; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Fin</span>
                                        <span style="color: white; font-size: 0.9rem; font-weight: 500;">${r.horaFin} hs</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            ${r.estadoReserva === 'En Revisión' ? `
                                <button class="btn-xs" style="background: rgba(0, 188, 212, 0.1); border-color: rgba(0, 188, 212, 0.3); color: #00bcd4; width: 100%; margin-bottom: 8px;" onclick="window.open(API_URL+'/Reserva/Comprobante/${r.comprobantePath}', '_blank')">VER COMPROBANTE</button>
                            ` : ''}

                            ${(r.estadoReserva === 'Pendiente' || r.estadoReserva === 'En Revisión') && !turnoYaPaso ? `
                                <button class="btn-xs" style="background: rgba(57, 255, 20, 0.1); border-color: rgba(57, 255, 20, 0.3); color: #39FF14; width: 100%; margin-bottom: 8px;" onclick="confirmarReservaAdmin(${r.idReserva})">APROBAR PAGO</button>
                            ` : ''}

                            ${r.estadoReserva === 'Cancelada' ? `
                                <div style="background: rgba(255,56,56,0.05); border: 1px dashed rgba(255,56,56,0.2); padding: 8px; border-radius: 6px; font-size: 0.75rem; color: #ff8888; text-align: center;">
                                    Reembolso procesado.
                                </div>
                            ` : ''}
                            
                            ${(r.estadoReserva !== 'Cancelada' && !turnoYaPaso) ? `
                                <button class="btn-cancel-red" onclick="cancelarReservaGlobal(${r.idReserva})">CANCELAR RESERVA</button>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
            htmlParrilla += `</div></div>`;
        }
        contenedorParrilla.innerHTML = htmlParrilla;
    } catch (error) {
        contenedorParrilla.innerHTML = `<p style="color: red; text-align: center; margin-top: 40px;">Error al conectar con la API de reservas.</p>`;
    }
}


// ==========================================================================
// MÓDULO DE FINANZAS Y COBROS (DISEÑO SAAS)
// ==========================================================================
let filtroEstadoFinanzas = 'todas';
let modoVistaFinanzas = 'dia';

function cambiarFiltroEstadoFinanzas(boton) {
    document.querySelectorAll('#header-acciones .btn-filtro-estado[data-estado]').forEach(b => b.classList.remove('active'));
    boton.classList.add('active');
    filtroEstadoFinanzas = boton.getAttribute('data-estado');
    cargarFinanzasAdmin();
}

function cambiarModoVistaFinanzas(modo) {
    modoVistaFinanzas = modo;
    ['dia', 'semana', 'mes'].forEach(m => document.getElementById(`btn-vf-${m}`).classList.remove('active'));
    document.getElementById(`btn-vf-${modo}`).classList.add('active');
    document.getElementById('label-fecha-finanzas').innerText = modo === 'dia' ? 'FECHA:' : 'DESDE:';
    cargarFinanzasAdmin();
}

async function cargarFinanzasAdmin() {
    const contenedorParrilla = document.getElementById('parrilla-finanzas-container');
    const inputFecha = document.getElementById('filtro-finanzas-fecha');
    if (!contenedorParrilla || !inputFecha) return;

    const fechaSeleccionada = inputFecha.value; 
    if (!fechaSeleccionada) return;

    contenedorParrilla.innerHTML = '<p style="color: #aaa; text-align: center; margin-top: 40px; grid-column: 1 / -1;">⏳ Calculando flujos financieros...</p>';

    const [year, month, day] = fechaSeleccionada.split('-');
    const fechaInicioDate = new Date(year, month - 1, day, 0, 0, 0);
    const fechaFinDate = new Date(year, month - 1, day, 23, 59, 59);
    
    if (modoVistaFinanzas === 'semana') fechaFinDate.setDate(fechaFinDate.getDate() + 6); 
    else if (modoVistaFinanzas === 'mes') fechaFinDate.setDate(fechaFinDate.getDate() + 30);

    try {
        // Asumimos que creaste el endpoint del PASO 1. Si aún no hay datos, veremos el cartel de vacío.
        const response = await fetch(API_URL+'/Pagos/Todos', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }
        });
        
        if (!response.ok) throw new Error();
        const todosLosCobros = await response.json();

        // 1. Filtrar por Fecha
        let cobrosFiltrados = todosLosCobros.filter(c => {
            const fechaCobro = new Date(c.fecha);
            return fechaCobro >= fechaInicioDate && fechaCobro <= fechaFinDate;
        });

        // 2. Filtrar por Estado
        if (filtroEstadoFinanzas !== 'todas') {
            cobrosFiltrados = cobrosFiltrados.filter(c => {
                const est = c.estado.toLowerCase();
                if (filtroEstadoFinanzas === 'pendiente') return est === 'pendiente';
                if (filtroEstadoFinanzas === 'pagado') return est === 'pagado' || est === 'confirmado';
                return true;
            });
        }

        if (cobrosFiltrados.length === 0) {
            contenedorParrilla.innerHTML = `<p style="color: #aaa; text-align: center; margin-top: 40px; grid-column: 1 / -1;">No hay movimientos financieros registrados en este período.</p>`;
            return;
        }

        let htmlParrilla = '';

        cobrosFiltrados.forEach(c => {
            // Formateo visual
            let colorEstado = c.estado === 'Pendiente' ? '#ff9800' : 
                              (c.estado === 'Pagado' || c.estado === 'Confirmado') ? '#39FF14' : '#ff3838';
            
            const precioBase = `$${c.montoBase.toLocaleString('es-AR')}`;
            const precioFinal = `$${c.montoFinal.toLocaleString('es-AR')}`;
            
            // Calculamos si hubo descuento
            const tieneDescuento = c.montoFinal < c.montoBase;
            const descuentoHtml = tieneDescuento ? `<span style="font-size: 0.7rem; color: #ff9800; text-decoration: line-through; margin-right: 8px;">${precioBase}</span>` : '';

            // Formatear la fecha para la tarjeta
            const fechaObj = new Date(c.fecha);
            const fechaString = fechaObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' });

            htmlParrilla += `
                <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; border-left: 5px solid ${colorEstado}; position: relative;">
                    
                    <span style="position: absolute; top: 15px; right: 15px; color: ${colorEstado}; font-size: 0.7rem; font-weight: bold; padding: 3px 8px; border: 1px solid ${colorEstado}; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                        ${c.estado}
                    </span>

                    <div style="margin-bottom: 20px; margin-top: 5px;">
                        <h3 style="font-size: 0.9rem; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Cobro #${c.idCobro}</h3>
                        <p style="color: white; font-size: 1.1rem; font-weight: bold; margin-bottom: 15px;">${c.concepto}</p>
                        
                        <div style="display: flex; flex-direction: column; gap: 10px; background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; border: 1px dashed rgba(255,255,255,0.1);">
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                                <span style="color: #777; font-size: 0.75rem; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Creación</span>
                                <span style="color: #ddd; font-size: 0.85rem; font-weight: 500;">${fechaString}</span>
                            </div>
                            
                            <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 5px;">
                                <span style="color: #777; font-size: 0.75rem; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Total Facturado</span>
                                <div style="text-align: right;">
                                    ${descuentoHtml}
                                    <span style="color: ${tieneDescuento ? '#39FF14' : 'white'}; font-size: 1.3rem; font-weight: 900;">${precioFinal}</span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div style="display: flex; gap: 10px;">
                        ${c.estado === 'Pendiente' ? `
                            <button class="btn-xs" style="background: rgba(57, 255, 20, 0.1); border-color: rgba(57, 255, 20, 0.3); color: #39FF14; flex: 1;">MARCAR PAGADO</button>
                        ` : ''}
                        
                        <button class="btn-xs" style="background: rgba(0, 188, 212, 0.1); border-color: rgba(0, 188, 212, 0.3); color: #00bcd4; flex: 1;" onclick="gestionarRecibo(${c.idCobro}, ${c.tieneRecibo}, ${c.montoFinal})">
                            ${c.tieneRecibo ? 'IMPRIMIR RECIBO' : 'EMITIR RECIBO'}
                        </button>
                    </div>
                </div>
            `;
        });
        contenedorParrilla.innerHTML = htmlParrilla;
    } catch (error) {
        contenedorParrilla.innerHTML = `<p style="color: red; text-align: center; margin-top: 40px; grid-column: 1 / -1;">Error al conectar con la API de Pagos.</p>`;
    }
}

// ==========================================================================
// GESTIÓN DE RECIBOS OFICIALES (Conexión con PagosController)
// ==========================================================================
async function gestionarRecibo(idCobro, tieneRecibo, monto) {
    const token = localStorage.getItem('tokenGolAhora');

    if (!tieneRecibo) {
        // 1. SI NO TIENE RECIBO: Llamamos al RF-63 para crearlo
        if (!confirm(`¿Emitir recibo oficial por $${monto.toLocaleString('es-AR')} para el Cobro #${idCobro}?`)) return;

        try {
            const response = await fetch(API_URL+'/Pagos/recibos', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ IdCobro: idCobro, Monto: monto })
            });

            if (response.ok) {
                alert("¡Recibo emitido y vinculado con éxito en la contabilidad!");
                cargarFinanzasAdmin(); // Refrescamos para que el botón cambie a "IMPRIMIR"
            } else {
                const data = await response.json();
                alert(`Error al emitir recibo: ${data.mensaje}`);
            }
        } catch (error) {
            alert("Error de red al intentar emitir el recibo.");
        }
    } else {
        // 2. SI YA TIENE RECIBO: Llamamos al RF-67 para imprimir el ticket
        try {
            // Buscamos los datos completos del cobro (RF-59) para extraer el ID del recibo
            const resCobro = await fetch(API_URL+`/Pagos/${idCobro}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const cobro = await resCobro.json();

            // Llamamos a imprimir el recibo exacto
            const resImpresion = await fetch(API_URL+`/Pagos/recibos/${cobro.idRecibo}/imprimir`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (resImpresion.ok) {
                const textoTicket = await resImpresion.text();
                
                // Abrimos una ventana con formato de ticket de impresora fiscal
                const ventanaPrint = window.open('', '_blank', 'width=400,height=500');
                ventanaPrint.document.write(`
                    <html>
                    <head>
                        <title>Ticket Recibo #${cobro.idRecibo}</title>
                        <style>
                            body { font-family: 'Courier New', Courier, monospace; background: #fff; color: #000; padding: 20px; font-size: 14px; text-align: center; }
                            pre { white-space: pre-wrap; word-wrap: break-word; text-align: left; }
                            button { margin-top: 20px; padding: 10px 20px; cursor: pointer; border: 1px solid #000; background: #fff; font-weight: bold; }
                            @media print { button { display: none; } }
                        </style>
                    </head>
                    <body>
                        <pre>${textoTicket}</pre>
                        <button onclick="window.print()">IMPRIMIR TICKET</button>
                    </body>
                    </html>
                `);
                ventanaPrint.document.close();
            } else {
                alert("No se pudo generar el ticket de impresión.");
            }
        } catch (error) {
            alert("Error al intentar conectar con la impresora virtual.");
        }
    }
}

// ==========================================================================
// MÓDULO DE LIGAS Y TORNEOS (REDISEÑO PRO)
// ==========================================================================
let modoVistaCompeticion = 'Liga'; // Variable global para recordar dónde estamos

function cambiarVistaCompeticion(tipo) {
    modoVistaCompeticion = tipo;
    
    // Reseteamos botones visuales
    document.getElementById('btn-vista-ligas')?.classList.remove('active');
    document.getElementById('btn-vista-torneos')?.classList.remove('active');
    document.getElementById('btn-vista-equipos')?.classList.remove('active');
    
    const btnAccion = document.getElementById('btn-nueva-competicion');

    // Lógica inteligente según la pestaña
    if(tipo === 'Liga') {
        document.getElementById('btn-vista-ligas').classList.add('active');
        btnAccion.innerText = '+ NUEVA LIGA';
        btnAccion.onclick = () => abrirModalNuevaCompeticion('Liga');
        cargarCompeticionesAdmin('Liga');
    } else if (tipo === 'Torneo') {
        document.getElementById('btn-vista-torneos').classList.add('active');
        btnAccion.innerText = '+ NUEVO TORNEO';
        btnAccion.onclick = () => abrirModalNuevaCompeticion('Torneo');
        cargarCompeticionesAdmin('Torneo');
    } else {
        document.getElementById('btn-vista-equipos').classList.add('active');
        btnAccion.innerText = '+ NUEVO EQUIPO';
        btnAccion.onclick = () => abrirModalNuevoEquipo(); 
        cargarEquiposAdmin(); 
    }
}

async function cargarCompeticionesAdmin(tipo) {
    const grid = document.getElementById('grid-competiciones');
    if(!grid) return;
    
    grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(500px, 1fr))';
    grid.style.gap = '30px';

    grid.innerHTML = `<p style="color: #aaa; text-align: center; grid-column: 1/-1; margin-top: 40px;">⏳ Cargando ${tipo.toLowerCase()}s...</p>`;
    const endpoint = tipo === 'Liga' ? API_URL+'/Ligas' : API_URL+'/Torneos';

    try {
        const response = await fetch(endpoint, { headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }});
        if (!response.ok) throw new Error();
        const competiciones = await response.json();

        if (competiciones.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; background: rgba(0, 0, 0, 0.4); border: 1px dashed rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 50px; text-align: center;"><h3 style="color: #777;">No hay ${tipo.toLowerCase()}s.</h3></div>`;
            return;
        }

        let html = '';
        competiciones.forEach(c => {
            const cantEquipos = c.equipos ? c.equipos.length : 0;
            const estaLleno = cantEquipos >= c.cupoMaximo;
            const porcentajeOcupacion = (cantEquipos / c.cupoMaximo) * 100;
            
            // 👇 MAGIA: Evaluamos si ya está sorteada 👇
            const tieneFixture = c.fechas && c.fechas.length > 0;
            
            let badgeTexto = 'INSCRIPCIONES ABIERTAS';
            let badgeColor = '#39FF14';
            
            if (tieneFixture) {
                badgeTexto = 'EN CURSO';
                badgeColor = '#00bcd4';
            } else if (estaLleno) {
                badgeTexto = 'CUPOS LLENOS';
                badgeColor = '#ff9800';
            }

            // ARMADO DE LOS BOTONES DEPENDIENDO EL ESTADO
            let botoneraIzquierda = '';
            let botoneraDerecha = '';

            if (tieneFixture) {
                // Si está en curso, bloqueamos inscripciones y sortear, y mostramos el MEGA BOTÓN
                botoneraIzquierda = `<p style="color: #00bcd4; font-size: 0.85rem; text-align: center; font-weight: bold; margin:0; padding:10px;">COMPETICIÓN BLOQUEADA Y ACTIVA</p>`;
                botoneraDerecha = `<button class="btn-reserve" style="background: linear-gradient(45deg, #00bcd4, #2196F3); color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 900; letter-spacing: 1px; width:100%; box-shadow: 0 4px 15px rgba(0,188,212,0.4);" onclick="abrirDetallesLiga(${c.idActividad}, '${c.nombreActividad}')">GESTIONAR LIGA</button>`;
            } else {
                // Modo Configuración / Sorteo
                botoneraIzquierda = `
                    <div style="display: flex; gap: 15px;">
                        <button class="btn-reserve" style="flex: 1; padding: 10px; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: none;" onclick="gestionarEquipos(${c.idActividad}, '${tipo}')">
                            <img src="../img/equipos.svg" style="width: 16px;"> EQUIPOS
                        </button>
                        <button class="btn-reserve outline-green" style="flex: 1; padding: 10px; font-size: 0.8rem; border-color: #ff9800; color: #ff9800; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: none;" onclick="abrirModalEditarCompeticion(${c.idActividad}, '${c.nombreActividad}', ${c.cupoMaximo}, '${tipo}', ${cantEquipos})">
                            <img src="../img/pencil.svg" style="width: 14px;"> EDITAR
                        </button>
                    </div>
                `;
                
                const botonSortearInteligente = estaLleno 
                    ? `<button style="background: linear-gradient(45deg, #ff007f, #7928ca); color: white; border: none; padding: 10px 20px; border-radius: 20px; font-weight: 900; letter-spacing: 1.5px; font-size: 0.85rem; box-shadow: 0 4px 15px rgba(255, 0, 127, 0.4); cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" onclick="iniciarCompeticion(${c.idActividad}, '${tipo}')">SORTEAR</button>`
                    : `<button style="background: rgba(255,255,255,0.05); color: #666; border: 1px solid rgba(255,255,255,0.1); padding: 10px 20px; border-radius: 20px; font-weight: 900; letter-spacing: 1.5px; font-size: 0.85rem; cursor: not-allowed;" disabled title="Faltan ${c.cupoMaximo - cantEquipos} equipos">SORTEAR</button>`;

                botoneraDerecha = `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 15px; border-top: 1px dashed rgba(255,255,255,0.1);">
                        <button style="background: transparent; border: none; color: rgba(255, 56, 56, 0.7); font-size: 0.8rem; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 6px;" onmouseover="this.style.color='#ff3838'" onmouseout="this.style.color='rgba(255, 56, 56, 0.7)'" onclick="eliminarCompeticion(${c.idActividad}, '${tipo}')">
                            <img src="../img/trash.svg" style="width: 14px;"> BORRAR
                        </button>
                        ${botonSortearInteligente}
                    </div>
                `;
            }

            html += `
                <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 30px; position: relative; display: flex; flex-direction: column; gap: 20px;">
                    <span style="position: absolute; top: 25px; right: 30px; border: 1px solid ${badgeColor}; color: ${badgeColor}; padding: 4px 10px; border-radius: 6px; font-size: 0.65rem; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">
                        ${badgeTexto}
                    </span>
                    <div>
                        <h3 style="font-size: 1.6rem; color: white; margin: 0; font-weight: 900; display:flex; align-items:center; gap:10px;">
                            ${c.nombreActividad}
                        </h3>
                        <p style="color: #666; font-size: 0.8rem; font-weight: bold; letter-spacing: 1px; margin: 0;">ID #${c.idActividad}</p>
                    </div>
                    <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);">
                        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px;">
                            <span style="color:#888; font-size:0.75rem; text-transform:uppercase; font-weight:bold;">Equipos Inscriptos</span>
                            <span style="color:white; font-size:1.3rem; font-weight:900;">${cantEquipos} <span style="color:#666; font-size:0.9rem; font-weight:normal;">/ ${c.cupoMaximo}</span></span>
                        </div>
                        <div style="width: 100%; height: 6px; background: rgba(0,0,0,0.5); border-radius: 3px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                            <div style="width: ${porcentajeOcupacion}%; height: 100%; background: ${badgeColor}; transition: width 0.5s ease;"></div>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        ${botoneraIzquierda}
                        ${botoneraDerecha}
                    </div>
                </div>
            `;
        });
        grid.innerHTML = html;
    } catch (error) { grid.innerHTML = `<p style="color: red; text-align: center;">Error al procesar los datos.</p>`; }
}


// ==========================================================================
// 2. EL MEGA MODAL DE "VER DETALLES" (TABLA Y FIXTURE)
// ==========================================================================

// Memoria global para mover las flechitas de las fechas sin recargar el servidor
let ligaMemoriaFixtures = [];
let ligaMemoriaIndiceFecha = 0;
let ligaMemoriaId = 0;

async function abrirDetallesLiga(idLiga, nombreLiga) {
    ligaMemoriaId = idLiga;

    const modalHTML = `
        <div id="modal-mega-liga" class="modal-overlay mostrar" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.9); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
            <div class="glass-panel modal-box" style="width: 900px; max-width: 95%; height: 85vh; display: flex; flex-direction: column; padding: 0; overflow: hidden; border-color: #00bcd4; box-shadow: 0 10px 40px rgba(0,188,212,0.2);">
                
                <div style="background: rgba(0,188,212,0.1); padding: 20px 30px; border-bottom: 1px solid rgba(0,188,212,0.3); display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h2 style="margin:0; font-size:1.8rem; color:white; letter-spacing:1px; text-transform:uppercase;">${nombreLiga}</h2>
                        <span style="color:#00bcd4; font-size:0.8rem; font-weight:bold; letter-spacing:2px;">Panel de Control Deportivo</span>
                    </div>
                    <button onclick="document.getElementById('modal-mega-liga').remove()" class="btn-close-x" style="position:static; transform:none;">×</button>
                </div>

                <div style="display: flex; background: rgba(0,0,0,0.5); border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <button id="tab-det-posiciones" class="tab-btn active" style="flex:1; text-align:center; padding:15px; border-radius:0; border-left:none;" onclick="switchDetalleLiga('posiciones')">TABLA DE POSICIONES</button>
                    <button id="tab-det-fixture" class="tab-btn" style="flex:1; text-align:center; padding:15px; border-radius:0; border-left:none;" onclick="switchDetalleLiga('fixture')">FIXTURE Y RESULTADOS</button>
                </div>

                <div id="cuerpo-mega-liga" style="flex: 1; overflow-y: auto; padding: 30px;">
                    </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Carga inicial
    await cargarTablaPosiciones(idLiga);
}

// ---------------------------------------------------------
// Lógica de pestañas internas
// ---------------------------------------------------------
function switchDetalleLiga(vista) {
    document.getElementById('tab-det-posiciones').classList.remove('active');
    document.getElementById('tab-det-fixture').classList.remove('active');
    document.getElementById(`tab-det-${vista}`).classList.add('active');

    if (vista === 'posiciones') cargarTablaPosiciones(ligaMemoriaId);
    if (vista === 'fixture') cargarMegaFixture(ligaMemoriaId);
}

// ==========================================================================
// 3. RENDERIZADO DE LA TABLA DE POSICIONES
// ==========================================================================
async function cargarTablaPosiciones(idLiga) {
    const cuerpo = document.getElementById('cuerpo-mega-liga');
    cuerpo.innerHTML = '<p style="text-align:center; color:#aaa; margin-top:50px;">⏳ Cargando estadísticas...</p>';

    try {
        const response = await fetch(API_URL+`/Ligas/${idLiga}/tabla`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }});
        const posiciones = await response.json();

        let trHTML = '';
        posiciones.forEach((p, index) => {
            const numeroColor = index < 3 ? '#39FF14' : 'white'; // Top 3 en verde
            const difGoles = p.golesFavor - p.golesContra;
            const difTexto = difGoles > 0 ? `+${difGoles}` : difGoles;

            trHTML += `
                <tr>
                    <td style="color:${numeroColor}; font-weight:bold;">${p.posicion}</td>
                    <td class="td-equipo">${p.equipoAsociado ? p.equipoAsociado.nombre : 'Equipo Desconocido'}</td>
                    <td>${p.partidosJugados}</td>
                    <td>${p.partidosGanados}</td>
                    <td>${p.partidosEmpatados}</td>
                    <td>${p.partidosPerdidos}</td>
                    <td>${p.golesFavor}</td>
                    <td>${p.golesContra}</td>
                    <td style="color:${difGoles >= 0 ? '#00bcd4' : '#ff3838'}; font-weight:bold;">${difTexto}</td>
                    <td class="td-pts">${p.puntos}</td>
                </tr>
            `;
        });

        cuerpo.innerHTML = `
            <table class="table-saas">
                <thead>
                    <tr>
                        <th title="Posición">#</th>
                        <th style="text-align:left;">EQUIPO</th>
                        <th title="Partidos Jugados">PJ</th>
                        <th title="Ganados">PG</th>
                        <th title="Empatados">PE</th>
                        <th title="Perdidos">PP</th>
                        <th title="Goles a Favor">GF</th>
                        <th title="Goles en Contra">GC</th>
                        <th title="Diferencia de Gol">DIF</th>
                        <th title="Puntos Totales" style="color:#39FF14; font-size:0.9rem;">PTS</th>
                    </tr>
                </thead>
                <tbody>
                    ${trHTML}
                </tbody>
            </table>
        `;
    } catch (error) { cuerpo.innerHTML = '<p style="color:red; text-align:center;">Error al cargar la tabla.</p>'; }
}

// ==========================================================================
// 4. RENDERIZADO DEL FIXTURE CON CARGA DE GOLES Y FLECHAS
// ==========================================================================
async function cargarMegaFixture(idLiga) {
    const cuerpo = document.getElementById('cuerpo-mega-liga');
    cuerpo.innerHTML = '<p style="text-align:center; color:#aaa; margin-top:50px;">⏳ Cargando cronograma...</p>';

    try {
        const response = await fetch(API_URL+`/Ligas/${idLiga}/fixture`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }});
        ligaMemoriaFixtures = await response.json();
        
        // Buscamos la primera fecha que tenga al menos un partido "Pendiente" para abrir ahí directamente
        ligaMemoriaIndiceFecha = 0;
        for (let i = 0; i < ligaMemoriaFixtures.length; i++) {
            if (ligaMemoriaFixtures[i].partidos.some(p => p.estado !== "Jugado")) {
                ligaMemoriaIndiceFecha = i;
                break;
            }
        }

        renderizarPaginaFecha();
    } catch (error) { cuerpo.innerHTML = '<p style="color:red; text-align:center;">Error al cargar el fixture.</p>'; }
}

function cambiarFechaNav(direccion) {
    const nuevoIndice = ligaMemoriaIndiceFecha + direccion;
    if (nuevoIndice >= 0 && nuevoIndice < ligaMemoriaFixtures.length) {
        ligaMemoriaIndiceFecha = nuevoIndice;
        renderizarPaginaFecha();
    }
}

function renderizarPaginaFecha() {
    const cuerpo = document.getElementById('cuerpo-mega-liga');
    const fechaData = ligaMemoriaFixtures[ligaMemoriaIndiceFecha];

    if (!fechaData) { cuerpo.innerHTML = "<p>No hay fechas disponibles.</p>"; return; }

    const btnPrevState = ligaMemoriaIndiceFecha === 0 ? 'visibility:hidden;' : '';
    const btnNextState = ligaMemoriaIndiceFecha === ligaMemoriaFixtures.length - 1 ? 'visibility:hidden;' : '';

    let htmlPartidos = '';
    fechaData.partidos.forEach(p => {
        const nombreLocal = p.local ? p.local.nombre : "???";
        const nombreVisita = p.visitante ? p.visitante.nombre : "???";
        const estaJugado = p.estado === "Jugado";

        // Si ya está jugado, mostramos texto. Si no, mostramos Inputs.
        const inputLocal = estaJugado ? `<input class="input-gol" value="${p.golesLocal}" disabled>` : `<input type="number" id="gl-${p.idPartido}" class="input-gol" placeholder="0" min="0">`;
        const inputVisita = estaJugado ? `<input class="input-gol" value="${p.golesVisitante}" disabled>` : `<input type="number" id="gv-${p.idPartido}" class="input-gol" placeholder="0" min="0">`;
        
        const btnGuardar = estaJugado 
            ? `<span style="color:#39FF14; font-size:0.8rem; font-weight:bold;">FINALIZADO</span>` 
            : `<button class="btn-xs" style="background:#00bcd4; color:white; border:none; border-radius:4px;" onclick="guardarGolesPartido(${p.idPartido})">GUARDAR RESULTADO</button>`;

        htmlPartidos += `
            <div class="match-box">
                <div class="match-team" style="text-align: right;">${nombreLocal}</div>
                
                <div class="match-score">
                    ${inputLocal}
                    <span style="color:#888; font-weight:bold;">vs</span>
                    ${inputVisita}
                </div>
                
                <div class="match-team" style="text-align: left;">${nombreVisita}</div>
                
                <div style="width: 150px; text-align: center;">
                    ${btnGuardar}
                </div>
            </div>
        `;
    });

    cuerpo.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; background: rgba(255,255,255,0.05); padding: 10px 20px; border-radius: 50px;">
            
            <button style="${btnPrevState} background: transparent; border: 1px solid #39FF14; color: #39FF14; width: 38px; height: 38px; border-radius: 50%; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; transition: all 0.3s; padding: 0;" onmouseover="this.style.background='rgba(57, 255, 20, 0.1)'" onmouseout="this.style.background='transparent'" onclick="cambiarFechaNav(-1)" title="Fecha Anterior">
                ❮
            </button>
            
            <h3 style="margin:0; color:#00bcd4; font-size:1.4rem; font-weight:900; letter-spacing: 1px;">FECHA ${fechaData.numeroFecha}</h3>
            
            <button style="${btnNextState} background: transparent; border: 1px solid #39FF14; color: #39FF14; width: 38px; height: 38px; border-radius: 50%; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; transition: all 0.3s; padding: 0;" onmouseover="this.style.background='rgba(57, 255, 20, 0.1)'" onmouseout="this.style.background='transparent'" onclick="cambiarFechaNav(1)" title="Fecha Siguiente">
                ❯
            </button>

        </div>

        <div style="display:flex; flex-direction:column; gap:10px;">
            ${htmlPartidos}
        </div>
    `;
}

// ==========================================================================
// 5. GUARDAR RESULTADO E IMPACTAR EN LA TABLA
// ==========================================================================
async function guardarGolesPartido(idPartido) {
    const golesLocalVal = document.getElementById(`gl-${idPartido}`).value;
    const golesVisitaVal = document.getElementById(`gv-${idPartido}`).value;

    if (golesLocalVal === '' || golesVisitaVal === '') {
        alert("Por favor, ingresá los goles de ambos equipos.");
        return;
    }

    try {
        const payload = {
            GolesLocal: parseInt(golesLocalVal),
            GolesVisitante: parseInt(golesVisitaVal)
        };

        const response = await fetch(API_URL+`/Ligas/${ligaMemoriaId}/partidos/${idPartido}/resultado`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // El backend actualizó el partido y reordenó la tabla. ¡Recargamos todo visualmente!
            const msg = await response.json();
            
            // Volvemos a pedir el fixture a C# para actualizar la memoria global
            const resFixture = await fetch(API_URL+`/Ligas/${ligaMemoriaId}/fixture`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }});
            ligaMemoriaFixtures = await resFixture.json();
            
            // Dibujamos de nuevo la misma fecha (ahora aparecerá "FINALIZADO")
            renderizarPaginaFecha();
            
            // Un toquecito de UX: Mostramos un mini alert
            alert("¡Resultado cargado! La tabla de posiciones se actualizó automáticamente.");
        } else {
            const err = await response.json();
            alert(`Error: ${err.mensaje}`);
        }
    } catch (error) { alert("Error de red al guardar el resultado."); }
}


// GESTIÓN INDEPENDIENTE DE EQUIPOS


let equiposCacheados = []; // Memoria global para no perder el foco al tipear

async function cargarEquiposAdmin() {
    const grid = document.getElementById('grid-competiciones');
    if(!grid) return;
    
    grid.style.gridTemplateColumns = '1fr';
    grid.style.gap = '0';

    // 1. Inyectamos el esqueleto (Buscador + Contenedor de Lista) SOLO si no existe
    if (!document.getElementById('lista-equipos-container')) {
        grid.innerHTML = `
            <div style="margin-bottom: 25px; display: flex; justify-content: flex-end;">
                <div style="position: relative; width: 100%; max-width: 350px;">
                    <span style="position: absolute; left: 15px; top: 12px; font-size: 1rem;">🔍</span>
                    <input type="text" id="input-buscar-equipo" class="input-saas" placeholder="Buscar equipo por nombre..." style="width: 100%; padding: 12px 20px 12px 45px; border-radius: 30px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); color: white;" oninput="renderizarEquiposFiltrados()">
                </div>
            </div>
            <div id="lista-equipos-container" style="display: flex; flex-direction: column; gap: 15px;">
                <p style="color: #aaa; text-align: center; margin-top: 40px;">⏳ Cargando planteles...</p>
            </div>
        `;
    }

    try {
        const response = await fetch(API_URL+'/Equipos', { headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }});
        if (!response.ok) throw new Error();
        equiposCacheados = await response.json();

        // 2. ORDEN ALFABÉTICO (A-Z)
        equiposCacheados.sort((a, b) => a.nombre.localeCompare(b.nombre));

        // 3. Renderizamos la lista
        renderizarEquiposFiltrados();
    } catch (error) { 
        document.getElementById('lista-equipos-container').innerHTML = `<p style="color: red; text-align: center;">Error al cargar equipos.</p>`; 
    }
}

function renderizarEquiposFiltrados() {
    const contenedor = document.getElementById('lista-equipos-container');
    const terminoBusqueda = document.getElementById('input-buscar-equipo').value.toLowerCase();
    
    // Filtramos la memoria en base a lo que el usuario escribió
    const equiposFiltrados = equiposCacheados.filter(eq => eq.nombre.toLowerCase().includes(terminoBusqueda));

    if (equiposCacheados.length === 0) {
        contenedor.innerHTML = `<div style="background: rgba(0, 0, 0, 0.4); border: 1px dashed rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 50px; text-align: center;"><h3 style="color: #777;">No hay equipos creados.</h3></div>`;
        return;
    }

    if (equiposFiltrados.length === 0) {
        contenedor.innerHTML = `<p style="color: #aaa; text-align: center; margin-top: 20px;">No se encontraron equipos con el nombre "${terminoBusqueda}".</p>`;
        return;
    }

    let html = '';
    equiposFiltrados.forEach(eq => {
        const cantJugadores = eq.jugadores ? eq.jugadores.length : 0;
        
        // --- Armado del Plantel (Acordeón) ---
        let htmlJugadores = '';
        if (cantJugadores > 0) {
            eq.jugadores.forEach(j => {
                const esUsuario = j.dniUsuario !== null;
                const badge = esUsuario ? '<span style="background: rgba(57,255,20,0.1); color:#39FF14; padding:2px 6px; border-radius:4px; font-size:0.6rem; border: 1px solid rgba(57,255,20,0.3); font-weight: bold;">USUARIO</span>' : '<span style="background: rgba(255,152,0,0.1); color:#ff9800; padding:2px 6px; border-radius:4px; font-size:0.6rem; border: 1px solid rgba(255,152,0,0.3); font-weight: bold;">INVITADO</span>';
                let nombreAMostrar = esUsuario && j.usuarioAsociado ? `${j.usuarioAsociado.nombre} ${j.usuarioAsociado.apellido}` : j.nombreInvitado;
                let dniAMostrar = esUsuario ? j.dniUsuario : j.dniInvitado;

                htmlJugadores += `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; border-bottom: 1px dashed rgba(255,255,255,0.05); background: rgba(0,0,0,0.2);">
                        <div style="display:flex; align-items:center; gap:15px;">
                            <strong style="color:white; font-size:0.95rem;">${nombreAMostrar}</strong>
                            <span style="color:#888; font-size:0.8rem;">DNI: ${dniAMostrar}</span>
                            ${badge}
                        </div>
                        <button onclick="eliminarJugadorEquipo(${eq.idEquipo}, ${j.idJugador})" style="background:transparent; border:none; cursor:pointer; padding:5px; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" title="Expulsar">
                            <img src="../img/trash.svg" alt="Expulsar" style="width: 15px; height: 15px;">
                        </button>
                    </div>
                `;
            });
        } else {
            htmlJugadores = '<p style="color:#666; text-align:center; padding:20px; margin:0; font-size: 0.85rem;">Plantel vacío.</p>';
        }

        // --- Armado de la Fila Principal ---
        html += `
            <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; transition: border-color 0.3s ease; overflow: hidden;">
                
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; cursor: pointer; transition: background 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='transparent'" onclick="toggleAcordeonEquipo(${eq.idEquipo})">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div style="width: 40px; height: 40px; background: rgba(57, 255, 20, 0.05); border: 1px solid rgba(57, 255, 20, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                            <img src="../img/shield.svg" alt="Escudo" style="width: 22px; height: 22px; opacity: 0.9;">
                        </div>
                        <div>
                            <h3 style="font-size: 1.2rem; color: white; margin: 0; font-weight: 900; letter-spacing: 0.5px;">${eq.nombre}</h3>
                            <p style="color: #888; font-size: 0.75rem; text-transform: uppercase; font-weight: bold; margin: 0; margin-top: 3px;">ID #${eq.idEquipo}</p>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <span style="color: #39FF14; font-size: 0.85rem; font-weight: bold; background: rgba(57,255,20,0.1); padding: 4px 12px; border-radius: 20px;">${cantJugadores} / 20 Jugadores</span>
                        
                        <button class="btn-xs" style="background: transparent; border: none; padding: 5px; display:flex; align-items:center;" onclick="event.stopPropagation(); eliminarEquipoGlobal(${eq.idEquipo})" title="Eliminar Equipo">
                            <img src="../img/trash.svg" alt="Borrar" style="width: 18px; height: 18px;">
                        </button>
                        
                        <svg id="flecha-eq-${eq.idEquipo}" style="transition: transform 0.3s; color:#aaa;" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </div>

                <div id="body-eq-${eq.idEquipo}" style="display: none; border-top: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02);">
                    <div style="padding: 20px;">
                        <h4 style="color:#aaa; font-size:0.75rem; margin-bottom:10px; text-transform:uppercase; letter-spacing:1px;">Plantel Actual</h4>
                        <div style="border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
                            ${htmlJugadores}
                        </div>

                        <form onsubmit="agregarJugadorInline(event, ${eq.idEquipo})" style="display:flex; gap:10px; align-items: stretch; background: rgba(0,0,0,0.15); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                            <input type="number" id="inline-dni-${eq.idEquipo}" class="input-saas" placeholder="DNI" required style="flex: 1; margin: 0; min-width: 100px;">
                            <input type="text" id="inline-nombre-${eq.idEquipo}" class="input-saas" placeholder="Nombre (Si es invitado)" style="flex: 2; margin: 0; min-width: 150px;">
                            <button type="submit" class="btn-reserve" style="width: auto; padding: 0 25px; margin: 0; white-space: nowrap; box-shadow: none;">+ AGREGAR</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    });
    contenedor.innerHTML = html;
}

// Lógica Visual del Acordeón
function toggleAcordeonEquipo(id) {
    const body = document.getElementById(`body-eq-${id}`);
    const flecha = document.getElementById(`flecha-eq-${id}`);
    if(body.style.display === 'none') {
        body.style.display = 'block';
        flecha.style.transform = 'rotate(180deg)';
    } else {
        body.style.display = 'none';
        flecha.style.transform = 'rotate(0deg)';
    }
}

// ==========================================================================
// ABM DE JUGADORES DIRECTO EN LA LISTA
// ==========================================================================
async function agregarJugadorInline(event, idEquipo) {
    event.preventDefault();
    const btn = event.target.querySelector('button');
    btn.disabled = true; btn.innerText = "...";

    const dni = document.getElementById(`inline-dni-${idEquipo}`).value;
    const nombre = document.getElementById(`inline-nombre-${idEquipo}`).value;

    try {
        const response = await fetch(API_URL+`/Equipos/${idEquipo}/jugadores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` },
            body: JSON.stringify({ Dni: parseInt(dni), Nombre: nombre })
        });
        if (response.ok) {
            await cargarEquiposAdmin();
            toggleAcordeonEquipo(idEquipo); // Lo volvemos a abrir para que se vea el cambio
        } else {
            const data = await response.json(); alert(data.mensaje);
            btn.disabled = false; btn.innerText = "+ AGREGAR";
        }
    } catch (error) { alert("Error de red."); btn.disabled = false; btn.innerText = "+ AGREGAR"; }
}

async function eliminarJugadorEquipo(idEquipo, idJugador) {
    if (!confirm("¿Desvincular a este jugador?")) return;
    try {
        const response = await fetch(API_URL+`/Equipos/${idEquipo}/jugadores/${idJugador}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }});
        if (response.ok) {
            await cargarEquiposAdmin();
            toggleAcordeonEquipo(idEquipo);
        } else { alert("Error al eliminar el jugador."); }
    } catch (error) { alert("Error de conexión."); }
}

async function eliminarEquipoGlobal(id) {
    if(!confirm('¿Eliminar este equipo por completo? Se borrará de todas las competiciones.')) return;
    try {
        const response = await fetch(API_URL+`/Equipos/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` }});
        if (response.ok) { cargarEquiposAdmin(); } else { alert('Error al borrar.'); }
    } catch (error) { alert('Error de red.'); }
}


// ==========================================================================
// MODAL DE CREACIÓN DE EQUIPO (CON MULTI-CARGA DE JUGADORES)
// ==========================================================================
let plantelTemporal = [];

function abrirModalNuevoEquipo() {
    plantelTemporal = []; // Limpiamos la memoria
    const modalHTML = `
        <div id="modal-crear-equipo" class="modal-overlay mostrar" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px);">
            <div class="glass-panel modal-box" style="width: 500px; max-width: 95%;">
                <button onclick="document.getElementById('modal-crear-equipo').remove()" class="btn-close-x">×</button>
                <h2 style="margin-bottom: 5px; font-size: 1.5rem; color:white;">🛡️ NUEVO EQUIPO</h2>
                <p style="color:#aaa; font-size:0.85rem; margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;">Registrá el equipo y armá su plantel inicial</p>
                
                <div class="input-group">
                    <label>NOMBRE DEL EQUIPO <span style="color:#ff3838">*</span></label>
                    <input type="text" id="crear-equipo-nombre" class="input-saas" placeholder="Ej: Los Galácticos" required>
                </div>

                <div style="background: rgba(255,255,255,0.02); padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 20px;">
                    <h4 style="color:#00bcd4; margin-top:0; margin-bottom:10px; font-size:0.8rem; text-transform:uppercase; letter-spacing:1px;">Carga Rápida de Plantel (Opcional)</h4>
                    <div style="display:flex; gap:10px; margin-bottom:10px;">
                        <input type="number" id="temp-dni" class="input-saas" placeholder="DNI" style="flex:1; margin:0; font-size:0.8rem; padding:8px;">
                        <input type="text" id="temp-nombre" class="input-saas" placeholder="Nombre" style="flex:1.5; margin:0; font-size:0.8rem; padding:8px;">
                        <button type="button" class="btn-xs" style="background: rgba(0, 188, 212, 0.1); border-color: rgba(0, 188, 212, 0.3); color: #00bcd4;" onclick="agregarJugadorTemporal()">AÑADIR</button>
                    </div>
                    
                    <div id="lista-temporal-jugadores" style="max-height: 120px; overflow-y: auto; display:flex; flex-direction:column; gap:5px;"></div>
                </div>

                <button class="btn-reserve" style="width: 100%; box-shadow:none;" onclick="guardarEquipoCompleto(this)">GUARDAR EQUIPO Y PLANTEL</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    renderizarPlantelTemporal();
}

function agregarJugadorTemporal() {
    const dni = document.getElementById('temp-dni').value;
    const nombre = document.getElementById('temp-nombre').value;
    if(!dni) { alert("El DNI es obligatorio."); return; }
    
    // Evitar repetidos en memoria
    if(plantelTemporal.find(j => j.dni == dni)) { alert("Este DNI ya está en la lista de espera."); return; }

    plantelTemporal.push({ dni: parseInt(dni), nombre });
    
    document.getElementById('temp-dni').value = '';
    document.getElementById('temp-nombre').value = '';
    document.getElementById('temp-dni').focus();
    renderizarPlantelTemporal();
}

function quitarJugadorTemporal(dni) {
    plantelTemporal = plantelTemporal.filter(j => j.dni != dni);
    renderizarPlantelTemporal();
}

function renderizarPlantelTemporal() {
    const div = document.getElementById('lista-temporal-jugadores');
    if(plantelTemporal.length === 0) {
        div.innerHTML = '<span style="color:#666; font-size:0.75rem; text-align:center; display:block; padding:10px;">La lista de jugadores está vacía.</span>';
        return;
    }

    let html = '';
    plantelTemporal.forEach(j => {
        html += `
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.4); padding:6px 10px; border-radius:4px; border: 1px solid rgba(255,255,255,0.05);">
                <span style="color:white; font-size:0.8rem;">DNI: ${j.dni} <span style="color:#aaa; margin-left:5px;">${j.nombre}</span></span>
                <button type="button" onclick="quitarJugadorTemporal(${j.dni})" style="background:transparent; border:none; color:#ff3838; cursor:pointer; font-size:1rem; padding:0 5px;">×</button>
            </div>
        `;
    });
    div.innerHTML = html;
}

// El Combo Mágico: Crea el equipo y después dispara los POSTs de los jugadores invisibles al usuario
async function guardarEquipoCompleto(btnSubmit) {
    const nombreEquipo = document.getElementById('crear-equipo-nombre').value.trim();
    if (!nombreEquipo) { alert("El nombre del equipo es obligatorio."); return; }

    btnSubmit.disabled = true; 
    btnSubmit.innerText = "REGISTRANDO EQUIPO...";

    try {
        // PASO 1: Crear el Equipo Base
        const resCrear = await fetch(API_URL+'/Equipos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` },
            body: JSON.stringify({ Nombre: nombreEquipo })
        });

        if (!resCrear.ok) throw new Error("Error al crear el equipo base.");
        const dataCrear = await resCrear.json();
        const idNuevoEquipo = dataCrear.equipo.idEquipo;

        // PASO 2: Inyectar a todos los jugadores de la lista temporal
        if (plantelTemporal.length > 0) {
            btnSubmit.innerText = "VINCULANDO JUGADORES...";
            
            // Disparamos todas las peticiones en paralelo para que sea súper rápido
            const promesasJugadores = plantelTemporal.map(j => {
                return fetch(API_URL+`/Equipos/${idNuevoEquipo}/jugadores`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora')}` },
                    body: JSON.stringify({ Dni: j.dni, Nombre: j.nombre })
                });
            });

            await Promise.all(promesasJugadores); // Esperamos a que terminen todas
        }

        // PASO 3: Éxito total
        document.getElementById('modal-crear-equipo').remove();
        cargarEquiposAdmin(); // Refrescamos la lista elegante

    } catch (error) { 
        alert(error.message || "Error de red."); 
        btnSubmit.disabled = false; btnSubmit.innerText = "GUARDAR EQUIPO Y PLANTEL";
    }
}