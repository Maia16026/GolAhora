// ==========================================================================
// MOTOR CENTRAL DE RESERVAS (Unificado, Corregido y con IA de Días)
// ==========================================================================
const btnCtaReservaHero = document.getElementById('btn-cta-reserva');
const btnCtaReservaFooter = document.getElementById('btn-cta-reserva-footer'); 
const modalReservas = document.getElementById('modal-reservas');
const linkNavReserva = document.querySelector('a[href="#reservas"]');

// 👇 Agregamos la propiedad 'diasHabiles' al caché de la reserva
let reservaActual = { 
    cancha: '',       
    idCancha: 0,      
    nombreCancha: '', 
    diasHabiles: '', // <--- DATO NUEVO
    fecha: '', 
    hora: '' 
};

let calendarioFlatpickr = null;
let fechaSeleccionada = new Date();

function intentarAbrirReserva(e) {
    if(e) e.preventDefault(); 
    
    const token = localStorage.getItem('tokenGolAhora') || localStorage.getItem('token');
    
    if (!token) {
        const mensajeError = document.getElementById('mensaje-error');
        if (mensajeError) {
            mensajeError.innerText = '⚠️ Por favor, iniciá sesión o registrate para reservar una cancha.';
            mensajeError.style.display = 'block';
            mensajeError.style.color = '#ff9800'; 
        }
        const modalLogin = document.getElementById('modal-login');
        if (modalLogin) modalLogin.showModal();
    } else {
        iniciarReservaReal();
    }
}

if (btnCtaReservaHero) btnCtaReservaHero.addEventListener('click', intentarAbrirReserva);
if (btnCtaReservaFooter) btnCtaReservaFooter.addEventListener('click', intentarAbrirReserva);
if (linkNavReserva) linkNavReserva.addEventListener('click', intentarAbrirReserva);
if(modalReservas && typeof vincularCierreAfuera === 'function') vincularCierreAfuera(modalReservas);


// ==========================================================================
// 🧠 TRADUCTOR INTELIGENTE DE DÍAS HÁBILES
// ==========================================================================
// Esta función lee el texto libre (ej: "lunes a sabado") y lo convierte en números
// para que el calendario de Flatpickr entienda (0=Dom, 1=Lun, ..., 6=Sab).
function parsearDiasHabiles(texto) {
    if (!texto) return [0,1,2,3,4,5,6]; // Si viene vacío, por seguridad habilitamos todos

    // Quitamos tildes y lo pasamos a minúsculas
    let txt = texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
    let diasMap = { "domingo": 0, "lunes": 1, "martes": 2, "miercoles": 3, "jueves": 4, "viernes": 5, "sabado": 6 };
    
    // 1. Casos globales
    if (txt.includes("todos") || txt.includes("siempre") || txt.includes("lunes a domingo")) return [0,1,2,3,4,5,6];
    if (txt.includes("fin de semana") || txt.includes("fines de semana")) return [0,6]; // Sab y Dom
    if (txt === "semana" || txt === "dias de semana") return [1,2,3,4,5]; // Lun a Vie

    let permitidos = new Set();
    
    // 2. Buscamos patrón de "Rango" (Ej: "lunes a viernes" o "martes al sabado")
    let rangoMatch = txt.match(/(domingo|lunes|martes|miercoles|jueves|viernes|sabado)\s+(a|al|hasta)\s+(domingo|lunes|martes|miercoles|jueves|viernes|sabado)/);
    
    if (rangoMatch) {
        let inicio = diasMap[rangoMatch[1]];
        let fin = diasMap[rangoMatch[3]];
        let actual = inicio;
        // Bucle que da la vuelta a la semana sumando días
        while (true) {
            permitidos.add(actual);
            if (actual === fin) break;
            actual = (actual + 1) % 7; 
        }
    } else {
        // 3. Si no hay rango, buscamos palabras individuales (Ej: "Lunes, Miercoles y Viernes")
        for (let diaTexto in diasMap) {
            if (txt.includes(diaTexto)) {
                permitidos.add(diasMap[diaTexto]);
            }
        }
    }

    // Si logró atrapar días, los devuelve. Si no entendió el texto, habilita todos por las dudas.
    return permitidos.size > 0 ? Array.from(permitidos) : [0,1,2,3,4,5,6];
}

// --- CONFIGURACIÓN DEL CALENDARIO ---
function inicializarCalendarioSaaS() {
    if (calendarioFlatpickr) calendarioFlatpickr.destroy();
    
    // Traducimos la frase de la cancha a números para Flatpickr
    const diasPermitidos = parsearDiasHabiles(reservaActual.diasHabiles);
    const hoyNumero = new Date().getDay();

    calendarioFlatpickr = flatpickr("#input-fecha-reserva", {
        locale: "es",
        minDate: "today",
        maxDate: new Date().fp_incr(30),
        dateFormat: "Y-m-d",
        altInput: true,
        altFormat: "l, j \\d\\e F",
        // Si el día de hoy NO se abre la cancha, no lo seteamos por defecto
        defaultDate: diasPermitidos.includes(hoyNumero) ? "today" : null,
        disableMobile: "true",
        static: true, 
        position: "auto center", 
        appendTo: document.getElementById('modal-reservas'),
        
        // 👇 MAGIA ABSOLUTA: Deshabilita del calendario los días que no están en la lista permitida
        disable: [
            function(date) {
                return !diasPermitidos.includes(date.getDay());
            }
        ],

        onChange: function(selectedDates) {
            if (selectedDates.length > 0) {
                fechaSeleccionada = selectedDates[0];
            }
        }
    });

    if(!diasPermitidos.includes(hoyNumero)){
        document.getElementById("input-fecha-reserva").placeholder = "Cancha cerrada hoy. Seleccioná...";
    }
}


// --- LÓGICA DE NAVEGACIÓN MANUAL DE DÍAS ---
const btnPrev = document.getElementById('btn-prev-date');
const btnNext = document.getElementById('btn-next-date');

if (btnPrev) {
    btnPrev.addEventListener('click', (e) => {
        e.preventDefault();
        const hoy = new Date();
        hoy.setHours(0,0,0,0);
        let nuevaFecha = new Date(fechaSeleccionada || new Date());
        
        // Iteramos hacia atrás buscando un día habilitado
        const diasPermitidos = parsearDiasHabiles(reservaActual.diasHabiles);
        do { nuevaFecha.setDate(nuevaFecha.getDate() - 1); } 
        while (!diasPermitidos.includes(nuevaFecha.getDay()) && nuevaFecha >= hoy);

        if (nuevaFecha >= hoy && calendarioFlatpickr) {
            fechaSeleccionada = nuevaFecha;
            calendarioFlatpickr.setDate(fechaSeleccionada, true);
        }
    });
}

if (btnNext) {
    btnNext.addEventListener('click', (e) => {
        e.preventDefault();
        const limite = new Date();
        limite.setDate(limite.getDate() + 30);
        limite.setHours(0,0,0,0);
        let nuevaFecha = new Date(fechaSeleccionada || new Date());
        
        // Iteramos hacia adelante buscando un día habilitado
        const diasPermitidos = parsearDiasHabiles(reservaActual.diasHabiles);
        do { nuevaFecha.setDate(nuevaFecha.getDate() + 1); } 
        while (!diasPermitidos.includes(nuevaFecha.getDay()) && nuevaFecha <= limite);

        if (nuevaFecha <= limite && calendarioFlatpickr) {
            fechaSeleccionada = nuevaFecha;
            calendarioFlatpickr.setDate(fechaSeleccionada, true);
        }
    });
}

// ==========================================================================
// MÓDULO DE RESERVAS REALES (Conexión EF Core)
// ==========================================================================

async function iniciarReservaReal() {
    const modal = document.getElementById('modal-reservas');
    const contenedor = document.querySelector('.cancha-options');
    if (!modal || !contenedor) return;
    
    contenedor.innerHTML = '<p style="color:white; text-align:center;">Cargando canchas desde el servidor...</p>';
    cambiarPasoReserva(1);
    modal.showModal();

    try {
        const res = await fetch('http://localhost:5000/api/Canchas');
        const canchas = await res.json();
        
        // 1. Filtramos para trabajar solo con las disponibles
        let canchasDisponibles = canchas.filter(c => c.disponible);

        // 2. LÓGICA DE ORDENAMIENTO (Busca el número dentro del texto)
        canchasDisponibles.sort((a, b) => {
            let nombreA = a.tipoDeCancha ? a.tipoDeCancha.nombre : '';
            let nombreB = b.tipoDeCancha ? b.tipoDeCancha.nombre : '';

            // Regex /\d+/ atrapa el primer número que encuentre. Si no hay, usa 0.
            let numA = parseInt(nombreA.match(/\d+/) || [0]);
            let numB = parseInt(nombreB.match(/\d+/) || [0]);

            return numA - numB; // Esto las ordena de forma ascendente (5, 7, 11)
        });
        
        let html = '';
        canchasDisponibles.forEach(c => {
            let nombre = c.tipoDeCancha ? c.tipoDeCancha.nombre : `Cancha General`;
            let diasString = c.diasHabiles ? c.diasHabiles : '';
            let superficie = c.tipoDeCancha && c.tipoDeCancha.superficie ? c.tipoDeCancha.superficie : '';

            // Pequeña etiqueta visual si tiene superficie definida (Ej: Sintético)
            let badgeSuperficie = superficie ? `<span style="font-size: 0.65rem; color: #ccc; background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 4px; margin-top: 10px; text-transform: uppercase; letter-spacing: 0.5px;">${superficie}</span>` : '';
            
            // Tarjeta Premium sin Emojis
            html += `
                <button class="cancha-card" onclick="seleccionarCanchaReal(${c.idCancha}, '${nombre}', '${diasString}')" style="justify-content: center; text-align: center; gap: 5px; padding: 25px 15px; border: 1px solid rgba(57, 255, 20, 0.2); transition: all 0.3s ease;">
                    <span style="font-size: 1.4rem; color: #39FF14; text-transform: uppercase; font-weight: 900; letter-spacing: 1px;">${nombre}</span>
                    <span style="font-size: 0.85rem; color: #888; font-weight: normal; margin-top: 5px;">Cancha N°${c.idCancha}</span>
                    ${badgeSuperficie}
                </button>
            `;
        });
        
        contenedor.innerHTML = html || '<p style="color:#ff9800; text-align:center;">No hay canchas habilitadas hoy.</p>';
    } catch (error) {
        contenedor.innerHTML = '<p style="color:#ff3838; text-align:center;">Error al conectar con la base de datos.</p>';
    }
}

// 👇 Recibimos los días hábiles en la fase 1 del modal
function seleccionarCanchaReal(idCancha, nombreCancha, diasHabilesStr) {
    reservaActual.idCancha = idCancha;
    reservaActual.nombreCancha = nombreCancha;
    reservaActual.diasHabiles = diasHabilesStr; // Lo guardamos en memoria
    
    document.getElementById('lbl-cancha-elegida').innerText = nombreCancha;
    
    inicializarCalendarioSaaS();
    cambiarPasoReserva(2);
}

async function buscarTurnosReales() {
    const inputFecha = document.getElementById('input-fecha-reserva');
    const fechaElegida = inputFecha ? inputFecha.value : ''; 
    
    if (!fechaElegida) return alert('Por favor, seleccioná una fecha disponible en el calendario.');

    reservaActual.fecha = fechaElegida;
    document.getElementById('lbl-fecha-elegida').innerText = fechaElegida;
    
    const grilla = document.getElementById('grilla-turnos');
    grilla.style.display = 'block'; 
    grilla.className = ''; 

    grilla.innerHTML = '<p style="color:white; text-align:center;">Analizando disponibilidad...</p>';
    cambiarPasoReserva(3);

    try {
        const resCancha = await fetch(`http://localhost:5000/api/Canchas/${reservaActual.idCancha}`);
        const canchaDB = await resCancha.json();
        
        const token = localStorage.getItem('tokenGolAhora') || localStorage.getItem('token');
        const resReservas = await fetch('http://localhost:5000/api/Reserva/Todas', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const todasLasReservas = await resReservas.json();

        const partes = fechaElegida.split('-');
        const fechaArg = `${partes[2]}/${partes[1]}/${partes[0]}`;

        const ocupadas = todasLasReservas.filter(r => 
            r.idCancha === reservaActual.idCancha && 
            r.fecha === fechaArg &&
            r.estadoReserva !== 'Cancelada'
        );

        let [horaA, minA] = canchaDB.horaInicio.split(':').map(Number);
        let [horaF, minF] = canchaDB.horaFin.split(':').map(Number);
        
        let minutosActuales = (horaA * 60) + minA;
        let minutosCierre = (horaF * 60) + minF;
        
        let saltoMinutos = (canchaDB.duracionMaxima < 10) ? (canchaDB.duracionMaxima * 60) : canchaDB.duracionMaxima;
        if (!saltoMinutos) saltoMinutos = 60; 

        const ahora = new Date();
        const year = ahora.getFullYear();
        const month = String(ahora.getMonth() + 1).padStart(2, '0');
        const day = String(ahora.getDate()).padStart(2, '0');
        const hoyStringLocal = `${year}-${month}-${day}`; 
        
        const esHoy = (fechaElegida === hoyStringLocal);
        const minActualesDelReloj = (ahora.getHours() * 60) + ahora.getMinutes();

        let html = '<div class="turnos-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px;">';
        
        while (minutosActuales + saltoMinutos <= minutosCierre) {
            let hStr = Math.floor(minutosActuales / 60).toString().padStart(2, '0');
            let mStr = (minutosActuales % 60).toString().padStart(2, '0');
            let horaStr = `${hStr}:${mStr}`; 

            let estaOcupada = ocupadas.some(r => r.horaInicio === horaStr);
            let turnoExpiro = esHoy && (minutosActuales <= minActualesDelReloj);

            if (estaOcupada || turnoExpiro) {
                let txtBloqueo = estaOcupada ? "OCUPADO" : "EXPIRO";
                let colBloqueo = estaOcupada ? "#ff3838" : "#888";
                html += `<button class="btn-turno" disabled style="background:#222; color:#555; border:1px solid #333; cursor:not-allowed; display:flex; flex-direction:column; align-items:center; padding: 15px; border-radius:8px;">
                            ${horaStr} <span style="font-size:0.65em; margin-top:3px; color:${colBloqueo}; font-weight:bold;">${txtBloqueo}</span>
                         </button>`;
            } else {
                
                html += `<button type="button" class="btn-turno libre" style="background:rgba(57,255,20,0.1); border:1px solid #39FF14; color:#39FF14; padding: 15px; border-radius:8px; cursor:pointer; font-weight:bold; transition: all 0.3s;" onclick="seleccionarHoraDefinitiva('${horaStr}', this)">${horaStr}</button>`;
            }
            minutosActuales += saltoMinutos; 
        }

        
        html += '</div>';

        
        html += `
            <div style="width: 100%; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px dashed rgba(255,255,255,0.1);">
                <button type="button" id="btn-continuar-pago" class="btn-reserve" style="display: none; width: 100%; max-width: 350px; margin: 0 auto; box-shadow: 0 5px 20px rgba(57,255,20,0.4);" onclick="generarReservaYPasarAlPago()">CONTINUAR AL PAGO</button>
            </div>
        `;

        grilla.innerHTML = html || '<p style="color:white; text-align:center;">No hay horarios configurados.</p>';

    } catch (error) {
        grilla.innerHTML = '<p style="color:#ff3838; text-align:center;">Error al consultar horarios.</p>';
    }

}

async function confirmarReservaReal(hora) {
    if(!confirm(`¿Querés confirmar la reserva para las ${hora} hs?`)) return;

    const payload = {
        Fecha: reservaActual.fecha, 
        Hora: hora,
        TipoCancha: reservaActual.idCancha 
    };

    try {
        const token = localStorage.getItem('tokenGolAhora') || localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/Reserva', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            alert("¡Turno reservado con éxito! ✅");
            document.getElementById('modal-reservas').close();
            
            if (typeof cargarReservasAdmin === 'function') cargarReservasAdmin();
            if (document.getElementById('grid-mis-reservas')) abrirMisReservas();
        } else {
            alert("Atención: " + data.mensaje); 
        }
    } catch (error) {
        alert("Error de red al intentar guardar la reserva.");
    }
}

function cambiarPasoReserva(paso) {
    document.querySelectorAll('.reserva-step').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.w-step').forEach(el => el.classList.remove('active'));
    
    const pasoElement = document.getElementById(`reserva-paso-${paso}`);
    if (pasoElement) pasoElement.classList.add('active');
    
    for(let i = 1; i <= paso; i++) {
        const dot = document.getElementById(`dot-paso-${i}`);
        if (dot) dot.classList.add('active');
    }
}

// ==========================================================================
// PANEL DEL CLIENTE: MIS RESERVAS Y COMPROBANTES
// ==========================================================================
let filtroMisReservasActual = 'en-curso'; 

function cambiarFiltroMisReservas(filtro) {
    filtroMisReservasActual = filtro;
    abrirMisReservas(); // Volvemos a renderizar aplicando el filtro
}

async function abrirMisReservas() {
    const modal = document.getElementById('modal-mis-reservas');
    const grid = document.getElementById('grid-mis-reservas');
    if(!modal || !grid) return alert("Falta el HTML del modal mis-reservas");

    grid.className = ''; 
    grid.style.display = 'block';

    // Solo mostramos el texto de carga si es la primera vez que se abre el modal
    if (!grid.innerHTML.includes('btn-filtro-estado')) {
        grid.innerHTML = '<p style="color: white; text-align: center;">Cargando tu agenda de partidos...</p>';
        modal.showModal();
    }

    if (!modal.open) {
        modal.showModal();
    }

    try {
        const response = await fetch('http://localhost:5000/api/Reserva/MisReservas', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora') || localStorage.getItem('token')}` }
        });

        if (!response.ok) throw new Error();
        const misReservas = await response.json();

        // 1. DIBUJAMOS LA CABECERA DEL MODAL (Con diseño moderno de "Píldora Toggle")
        let htmlPrincipal = `
            <div style="display: flex; justify-content: center; margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 20px;">
                <div style="display: flex; background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 50px; padding: 5px; box-shadow: inset 0 2px 5px rgba(0,0,0,0.5);">
                    <button class="btn-filtro-estado ${filtroMisReservasActual === 'en-curso' ? 'active' : ''}" onclick="cambiarFiltroMisReservas('en-curso')" style="border-radius: 40px; padding: 8px 24px; transition: all 0.3s ease;">EN CURSO</button>
                    <button class="btn-filtro-estado ${filtroMisReservasActual === 'finalizadas' ? 'active' : ''}" onclick="cambiarFiltroMisReservas('finalizadas')" style="border-radius: 40px; padding: 8px 24px; transition: all 0.3s ease;">FINALIZADAS</button>
                </div>
            </div>
            <div class="scroll-reservas-cliente">
        `;

        if (misReservas.length === 0) {
            grid.innerHTML = htmlPrincipal + '<p style="color: #aaa; text-align: center; margin-top: 20px;">No tenés ninguna reserva registrada a tu nombre en el sistema.</p></div>';
            return;
        }

        // 2. CONFIGURACIÓN DEL RELOJ Y DÍAS CLAVE
        const ahora = new Date();
        const hoyString = ahora.toISOString().split('T')[0]; // YYYY-MM-DD local
        
        const manana = new Date(ahora);
        manana.setDate(manana.getDate() + 1);
        const mananaString = manana.toISOString().split('T')[0];

        // 3. CLASIFICACIÓN DE RESERVAS
        let reservasProcesadas = misReservas.map(r => {
            const partesFecha = r.fecha.split('/'); 
            const [h, m] = r.horaInicio.split(':').map(Number);
            const fechaTurno = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0], h, m);
            
            const turnoYaPaso = fechaTurno <= ahora; 

            // Determinar a qué pestaña va: Si ya se jugó o está cancelada -> Finalizadas
            let perteneceA = 'en-curso';
            if (r.estadoReserva === 'Cancelada' || r.estadoReserva === 'Rechazada' || turnoYaPaso) {
                perteneceA = 'finalizadas';
            }

            // String YYYY-MM-DD para usar como llave de agrupación
            const fechaISO = `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`;

            return { ...r, turnoYaPaso, perteneceA, fechaTurno, fechaISO };
        });

        // 4. FILTRADO
        let reservasFiltradas = reservasProcesadas.filter(r => r.perteneceA === filtroMisReservasActual);

        if (reservasFiltradas.length === 0) {
            let txtVacio = filtroMisReservasActual === 'en-curso' ? 'pendientes o confirmadas' : 'pasadas o canceladas';
            grid.innerHTML = htmlPrincipal + `<p style="color: #aaa; text-align: center; margin-top: 20px;">No tenés reservas ${txtVacio}.</p></div>`;
            return;
        }

        // 5. ORDENAMIENTO INTELIGENTE
        // En curso: ascendente (el partido más pronto arriba)
        // Finalizadas: descendente (el último partido jugado arriba)
        reservasFiltradas.sort((a, b) => {
            return filtroMisReservasActual === 'en-curso' 
                ? a.fechaTurno - b.fechaTurno 
                : b.fechaTurno - a.fechaTurno;
        });

        // 6. AGRUPAMIENTO POR DÍA
        const reservasAgrupadas = {};
        reservasFiltradas.forEach(r => {
            if (!reservasAgrupadas[r.fechaISO]) reservasAgrupadas[r.fechaISO] = [];
            reservasAgrupadas[r.fechaISO].push(r);
        });

        // 7. RENDERIZADO DEL HTML FINAL
        let htmlContenido = '';
        
        for (const fechaISO in reservasAgrupadas) {
            
            // Traducción semántica de la fecha (Hoy, Mañana, "Sábado, 6 de junio")
            let tituloFecha = '';
            if (fechaISO === hoyString) {
                tituloFecha = 'HOY';
            } else if (fechaISO === mananaString) {
                tituloFecha = 'MAÑANA';
            } else {
                // Instanciamos a las 12 del mediodía para evitar saltos de zona horaria
                const dateObj = new Date(fechaISO + 'T12:00:00'); 
                const opciones = { weekday: 'long', day: 'numeric', month: 'long' };
                tituloFecha = dateObj.toLocaleDateString('es-ES', opciones).toUpperCase();
            }

            htmlContenido += `
                <div class="grupo-fecha">
                    <h4 style="color: #ccc; font-size: 1.1rem; border-bottom: 1px dashed rgba(255,255,255,0.2); padding-bottom: 8px; margin-bottom: 15px; letter-spacing: 1px;">
                        📅 ${tituloFecha}
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px;">
            `;

            reservasAgrupadas[fechaISO].forEach(r => {
                let colorEstado = r.estadoReserva === 'Pendiente' ? '#ff9800' : 
                                  r.estadoReserva === 'En Revisión' ? '#00bcd4' : 
                                  r.estadoReserva === 'Confirmada' ? '#39FF14' : '#ff3838';

                let estadoVisual = r.estadoReserva;
                let cssConcretada = '';

                // Estilos opacos para el historial
                if (r.turnoYaPaso && r.estadoReserva === 'Confirmada') {
                    estadoVisual = 'Concretada';
                    colorEstado = '#888'; 
                    cssConcretada = 'opacity: 0.65; background: rgba(0,0,0,0.7); border-color: rgba(255,255,255,0.05);';
                } else if (r.estadoReserva === 'Cancelada') {
                    cssConcretada = 'opacity: 0.75; background: rgba(255,56,56,0.05);';
                }

                const precioText = r.precio ? `$${r.precio.toLocaleString('es-AR')}` : 'A confirmar';

                htmlContenido += `
                    <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; justify-content: space-between; border-left: 5px solid ${colorEstado}; position: relative; ${cssConcretada}">
                        
                        <span style="position: absolute; top: 15px; right: 15px; color: ${colorEstado}; font-size: 0.7rem; font-weight: bold; padding: 3px 8px; border: 1px solid ${colorEstado}; border-radius: 4px; text-transform: uppercase;">
                            ${estadoVisual}
                        </span>

                        <div style="margin-bottom: 15px; margin-top: 5px;">
                            <h3 style="font-size: 1.1rem; margin-bottom: 5px; color: white;">Cancha: ${r.cancha}</h3>
                            
                            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 15px; background: rgba(255,255,255,0.02); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
                                <div style="display: flex; justify-content: space-between;">
                                    <div>
                                        <span style="color: #777; display: block; font-size: 0.65rem; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Fecha</span>
                                        <span style="color: white; font-size: 0.9rem; font-weight: 500;">${r.fecha}</span>
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
                                        <span style="color: white; font-size: 0.9rem; font-weight: 500;">${r.horaFin || '--:--'} hs</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            ${r.estadoReserva === 'Pendiente' && !r.turnoYaPaso ? `
                                <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; margin-bottom: 10px; border: 1px dashed rgba(0, 188, 212, 0.4);">
                                    <label style="color: #00bcd4; font-size: 0.75rem; font-weight: bold; display:block; margin-bottom: 8px; text-transform: uppercase;">Adjuntar Comprobante de Pago:</label>
                                    <input type="file" id="file-reserva-${r.idReserva}" accept="image/jpeg, application/pdf" style="font-size: 0.75rem; color: #ccc; width: 100%; border: 1px solid rgba(255,255,255,0.1); padding: 6px; border-radius: 4px; background: rgba(0,0,0,0.5);">
                                    <button class="btn-xs" style="background: #00bcd4; color: black; margin-top: 8px; width: 100%; border: none; font-weight: bold;" onclick="subirComprobanteCliente(${r.idReserva})">ENVIAR PAGO</button>
                                </div>
                            ` : ''}

                            ${r.estadoReserva === 'En Revisión' ? `
                                <div style="background: rgba(0, 188, 212, 0.1); border: 1px solid rgba(0, 188, 212, 0.3); padding: 8px; border-radius: 6px; font-size: 0.8rem; color: #00bcd4; text-align: center; margin-bottom: 8px; font-weight: bold;">
                                    Su comprobante está siendo revisado.
                                </div>
                            ` : ''}

                            ${(r.estadoReserva !== 'Cancelada' && !r.turnoYaPaso) ? `
                                <button class="btn-cancel-red" onclick="cancelarReservaCliente(${r.idReserva})">CANCELAR TURNO</button>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
            htmlContenido += `</div></div>`; // Cierra la grilla y el grupo de fecha
        }

        // Unimos Cabecera + Contenido + Cierre del contenedor Scroll
        grid.innerHTML = htmlPrincipal + htmlContenido + `</div>`; 

    } catch (error) {
        grid.innerHTML = '<p style="color: #ff3838; text-align: center;">Error al cargar tus reservas.</p>';
    }
}


// ==========================================================================
// NUEVA LÓGICA DE PAGO Y VISTA PREVIA (PASO 4)
// ==========================================================================
let temporizadorInterval; // Variable global para el reloj

function seleccionarHoraDefinitiva(hora, btn) {
    reservaActual.hora = hora;
    
    // Reseteamos el color de todos los botones
    document.querySelectorAll('#grilla-turnos .btn-turno.libre').forEach(b => {
        b.style.background = 'rgba(57,255,20,0.1)';
        b.style.color = '#39FF14';
        b.style.boxShadow = 'none';
    });

    // Pintamos el seleccionado
    btn.style.background = '#39FF14';
    btn.style.color = 'black';
    btn.style.boxShadow = '0 0 15px rgba(57, 255, 20, 0.6)';
    
    // Mostramos el botón continuar
    document.getElementById('btn-continuar-pago').style.display = 'block';
}

async function generarReservaYPasarAlPago() {
    const btnContinuar = document.getElementById('btn-continuar-pago');
    btnContinuar.innerText = 'PREPARANDO RESERVA...';
    btnContinuar.disabled = true;

    const payload = {
        Fecha: reservaActual.fecha, 
        Hora: reservaActual.hora,
        TipoCancha: reservaActual.idCancha 
    };

    try {
        const token = localStorage.getItem('tokenGolAhora') || localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/Reserva', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        
        if (response.ok) {
            const idGenerado = data.idReserva || data.id; 
            const precioTotal = data.precioTotal || 0; // Atrapamos el precio 
            mostrarPaso4Pago(idGenerado, precioTotal); // Se lo mandamos a la pantalla
        } else {
            alert("Atención: " + data.mensaje); 
            btnContinuar.innerText = 'CONTINUAR AL PAGO';
            btnContinuar.disabled = false;
        }
    } catch (error) {
        alert("Error de red al conectar con el servidor.");
        console.error("Error:", error);
        btnContinuar.innerText = 'CONTINUAR AL PAGO';
        btnContinuar.disabled = false;
    }
}

function mostrarPaso4Pago(idReserva, precioTotal) {
    // 1. Inyectamos dinámicamente el Punto 4 en el navegador superior
    const wizard = document.querySelector('.wizard-steps');
    if (wizard && !document.getElementById('dot-paso-4')) {
        wizard.innerHTML += `<span class="w-step" id="dot-paso-4" style="margin-left: 15px;">4. PAGO</span>`;
    }

    // 2. Creamos el contenedor del Paso 4 si no existe
    let contenedorPaso4 = document.getElementById('reserva-paso-4');
    if (!contenedorPaso4) {
        contenedorPaso4 = document.createElement('div');
        contenedorPaso4.id = 'reserva-paso-4';
        contenedorPaso4.className = 'reserva-step';
        document.getElementById('reserva-paso-3').parentNode.appendChild(contenedorPaso4);
    }

    // 3. Cambiamos la vista activa al Paso 4
    cambiarPasoReserva(4);

    // 4. Dibujamos la interfaz de Pago con el Precio Total
    contenedorPaso4.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 20px; align-items: stretch;">
            
            <div style="flex: 1; min-width: 250px; background: rgba(0,0,0,0.4); border: 1px solid rgba(57,255,20,0.3); border-left: 5px solid #39FF14; border-radius: 12px; padding: 25px;">
                <h3 style="color: white; font-size: 1.3rem; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">TU RESERVA</h3>
                <p style="color: #ccc; margin-bottom: 8px; font-size: 0.95rem;">Cancha: <strong style="color: white;">${reservaActual.nombreCancha}</strong></p>
                <p style="color: #ccc; margin-bottom: 8px; font-size: 0.95rem;">Fecha: <strong style="color: white;">${reservaActual.fecha}</strong></p>
                <p style="color: #ccc; margin-bottom: 8px; font-size: 0.95rem;">Inicio: <strong style="color: white;">${reservaActual.hora} hs</strong></p>
                <p style="color: #666; margin-top: 15px; font-size: 0.8rem; font-weight: bold;">ID Reserva: #${idReserva}</p>
                
                <div style="margin-top: 25px; background: rgba(255,56,56,0.05); border: 1px dashed rgba(255,56,56,0.4); padding: 15px; border-radius: 8px; text-align: center;">
                    <p style="color: #ff8888; font-size: 0.85rem; font-weight: bold; margin-bottom: 5px; text-transform: uppercase;">Tiempo para adjuntar pago:</p>
                    <p id="timer-pago" style="color: white; font-size: 2rem; font-weight: 900; letter-spacing: 3px;">10:00</p>
                </div>
            </div>

            <div style="flex: 1; min-width: 280px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 25px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <h4 style="color: #00bcd4; margin-bottom: 15px; font-size: 1.1rem;">ESCANEÁ PARA PAGAR</h4>
                    
                    <div style="background: rgba(57, 255, 20, 0.05); border: 1px solid rgba(57, 255, 20, 0.4); padding: 10px; border-radius: 8px; margin-bottom: 15px;">
                        <span style="color: #ccc; font-size: 0.8rem; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;">Total a Transferir:</span><br>
                        <span style="color: #39FF14; font-size: 1.8rem; font-weight: 900;">$${precioTotal.toLocaleString('es-AR')}</span>
                    </div>

                    <img src="qrmp.png" alt="QR MercadoPago" style="width: 130px; height: 130px; border-radius: 8px; border: 2px solid white; margin-bottom: 10px;">
                    
                    <p style="color: #aaa; font-size: 0.85rem; margin-bottom: 5px;">O transferí al alias:</p>
                    <p style="color: #39FF14; font-weight: bold; font-size: 1.1rem; letter-spacing: 1px; margin-bottom: 20px; background: rgba(0,0,0,0.5); padding: 8px; border-radius: 6px;">ivan.salto</p>
                </div>
                
                <div>
                    <div style="text-align: left; margin-bottom: 15px;">
                        <label style="color: #00bcd4; font-size: 0.8rem; font-weight: bold; display:block; margin-bottom: 8px; text-transform: uppercase;">ADJUNTAR COMPROBANTE:</label>
                        <input type="file" id="file-pago-paso4" accept="image/jpeg, application/pdf" style="font-size: 0.8rem; color: white; width: 100%; border: 1px solid rgba(255,255,255,0.2); padding: 8px; border-radius: 6px; background: rgba(0,0,0,0.5); cursor: pointer;">
                    </div>
                    
                    <button class="btn-reserve" style="background: #00bcd4; color: black; box-shadow: 0 4px 15px rgba(0,188,212,0.4); width: 100%; margin-bottom: 12px; font-size: 0.95rem; padding: 12px;" onclick="enviarComprobantePaso4(${idReserva}, this)">CONFIRMAR Y ENVIAR</button>
                    <button class="btn-xs" style="width: 100%; color: #aaa; border: none; background: transparent; text-decoration: underline; padding: 10px; font-size: 0.85rem;" onclick="document.getElementById('modal-reservas').close()">Cerrar y subir desde 'Mis Reservas'</button>
                </div>
            </div>
        </div>
    `;

    iniciarTemporizador(600, document.getElementById('timer-pago')); // 600 segundos = 10 min
}

function iniciarTemporizador(duracionSegundos, elementoReloj) {
    clearInterval(temporizadorInterval); // Limpia cualquier reloj anterior
    let tiempo = duracionSegundos;

    temporizadorInterval = setInterval(() => {
        const minutos = Math.floor(tiempo / 60);
        let segundos = tiempo % 60;
        segundos = segundos < 10 ? '0' + segundos : segundos;

        elementoReloj.innerText = `${minutos}:${segundos}`;

        if (tiempo <= 0) {
            clearInterval(temporizadorInterval);
            elementoReloj.innerText = "00:00";
            elementoReloj.style.color = "#ff3838";
            alert("⏳ ¡Tiempo expirado! Si no subiste el comprobante, la reserva será cancelada automáticamente.");
            document.getElementById('modal-reservas').close();
            if (document.getElementById('grid-mis-reservas')) abrirMisReservas();
        }
        tiempo--;
    }, 1000);
}

async function enviarComprobantePaso4(idReserva, btnEnvio) {
    const fileInput = document.getElementById('file-pago-paso4');
    if (!fileInput.files.length) return alert("⚠️ Seleccioná el archivo JPG o PDF de tu comprobante primero.");

    btnEnvio.innerText = "SUBIENDO ARCHIVO...";
    btnEnvio.disabled = true;

    const formData = new FormData();
    formData.append('archivo', fileInput.files[0]);

    try {
        const response = await fetch(`http://localhost:5000/api/Reserva/SubirComprobante/${idReserva}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora') || localStorage.getItem('token')}` }, 
            body: formData
        });

        const data = await response.json();
        
        if (response.ok) {
            clearInterval(temporizadorInterval); // Detenemos el reloj porque ya pagó
            alert("✅ ¡Éxito! " + data.mensaje);
            document.getElementById('modal-reservas').close();
            if (document.getElementById('grid-mis-reservas')) abrirMisReservas(); // Abre su agenda
        } else { 
            alert("Error: " + data.mensaje); 
            btnEnvio.innerText = "CONFIRMAR Y ENVIAR";
            btnEnvio.disabled = false;
        }
    } catch (error) { 
        alert("Error de red al subir el archivo."); 
        btnEnvio.innerText = "CONFIRMAR Y ENVIAR";
        btnEnvio.disabled = false;
    }
}

async function subirComprobanteCliente(idReserva) {
    const fileInput = document.getElementById(`file-reserva-${idReserva}`);
    if (!fileInput.files.length) return alert("Seleccioná un archivo (JPG o PDF) primero.");

    const formData = new FormData();
    formData.append('archivo', fileInput.files[0]);

    try {
        const response = await fetch(`http://localhost:5000/api/Reserva/SubirComprobante/${idReserva}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora') || localStorage.getItem('token')}` }, 
            body: formData
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.mensaje);
            abrirMisReservas(); 
        } else { alert("Error: " + data.mensaje); }
    } catch (error) { alert("Error al subir el archivo."); }
}

async function cancelarReservaCliente(idReserva) {
    if (!confirm("¿Seguro que querés cancelar esta reserva? (Tené en cuenta la política de 6hs para reembolsos).")) return;
    try {
        const response = await fetch(`http://localhost:5000/api/Reserva/Cancelar/${idReserva}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('tokenGolAhora') || localStorage.getItem('token')}` }
        });
        const data = await response.json();
        if (response.ok) {
            alert(data.mensaje); 
            abrirMisReservas(); 
            if (typeof cargarReservasAdmin === 'function') cargarReservasAdmin();
        } else { alert("Error: " + data.mensaje); }
    } catch (error) { alert("Error de red."); }
}