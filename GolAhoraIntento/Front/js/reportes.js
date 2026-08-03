const API_REPORTES = API_URL+'/reportes';

// 1. FUNCIÓN QUE DIBUJA TUS TARJETAS NEÓN
function renderizarEstructuraReportes() {
    const contenedor = document.getElementById('dashboard-acciones');
    if (!contenedor) return;

    contenedor.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 25px; width: 100%;">
            
            <!-- Tarjeta 1: Ingresos (Verde) -->
            <div style="background: #1e1e1e; border-left: 5px solid #00e676; border-radius: 12px; padding: 25px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                <h4 style="color: #00e676; margin: 0; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 1.5px; font-weight: 700;">Ingresos</h4>
                <h2 id="lbl-total-recaudado" style="color: white; margin: 15px 0 5px 0; font-size: 2.2rem; font-weight: 700;">$0.00</h2>
                <p id="lbl-total-transacciones" style="color: #888; margin: 0; font-size: 0.85rem;">Cargando cobros...</p>
            </div>

            <!-- Tarjeta 2: Reservas (Cian) -->
            <div style="background: #1e1e1e; border-left: 5px solid #00b0ff; border-radius: 12px; padding: 25px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                <h4 style="color: #00b0ff; margin: 0; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 1.5px; font-weight: 700;">Reservas</h4>
                <h2 id="lbl-total-reservas" style="color: white; margin: 15px 0 5px 0; font-size: 2.2rem; font-weight: 700;">0</h2>
                <p id="lbl-detalle-reservas" style="color: #888; margin: 0; font-size: 0.85rem;">Calculando métricas...</p>
            </div>

            <!-- Tarjeta 3: Canchas (Naranja) -->
            <div style="background: #1e1e1e; border-left: 5px solid #ff9100; border-radius: 12px; padding: 25px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                <h4 style="color: #ff9100; margin: 0; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 1.5px; font-weight: 700;">Cancha Popular</h4>
                <h2 id="lbl-cancha-estrella" style="color: white; margin: 15px 0 5px 0; font-size: 1.4rem; font-weight: 700; line-height: 1.2;">Buscando...</h2>
                <p id="lbl-detalle-cancha" style="color: #888; margin: 0; font-size: 0.85rem;">Analizando reservas</p>
            </div>

        </div>
    `;
}

// 2. FUNCIÓN QUE TRAE LOS DATOS DESDE C#
async function cargarDatosBackendReportes() {
    try {
        const [resIngresos, resReservas, resCanchas] = await Promise.all([
            fetch(`${API_REPORTES}/ingresos`),
            fetch(`${API_REPORTES}/reservas`),
            fetch(`${API_REPORTES}/canchas`)
        ]);

        if (resIngresos.ok) {
            const data = await resIngresos.json();
            const formateador = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            document.getElementById('lbl-total-recaudado').innerText = `$${formateador.format(data.totalRecaudado)}`;
            document.getElementById('lbl-total-transacciones').innerText = `Total en ${data.totalVentas} cobros (${data.periodo})`;
        }

        if (resReservas.ok) {
            const data = await resReservas.json();
            document.getElementById('lbl-total-reservas').innerText = data.totalReservasRegistradas;
            document.getElementById('lbl-detalle-reservas').innerText = `${data.estados.confirmadas} Confirmadas / ${data.estados.anuladas} Anuladas`;
        }

        if (resCanchas.ok) {
            const data = await resCanchas.json();
            if (data.ranking && data.ranking.length > 0) {
                const canchaMasPopular = data.ranking[0];
                document.getElementById('lbl-cancha-estrella').innerText = canchaMasPopular.nombre;
                document.getElementById('lbl-detalle-cancha').innerText = `${canchaMasPopular.totalReservas} turnos alquilados`;
            }
        }
    } catch (error) {
        console.error("Error al conectar con C# para reportes:", error);
    }
}

// 3. DETECTOR INTERCEPTOR (Vigila los cambios de pantalla)
function verificarYFijarReportes() {
    const tituloNode = document.getElementById('titulo-seccion');
    const contenedor = document.getElementById('dashboard-acciones');

    if (!tituloNode || !contenedor) return;

    // SI el título dice "REPORTES" y todavía vemos el texto viejo en construcción... ¡ACTUAMOS!
    if (tituloNode.innerText.toUpperCase().includes('REPORTES') && (contenedor.innerText.includes('construcción') || !document.getElementById('lbl-total-recaudado'))) {
        renderizarEstructuraReportes();
        cargarDatosBackendReportes();
    }
}

// Creamos el observador que vigila el DOM en tiempo real
const observadorPanel = new MutationObserver(() => {
    verificarYFijarReportes();
});

// Iniciamos la vigilancia apenas el navegador procese el script
document.addEventListener('DOMContentLoaded', () => {
    const contentBody = document.getElementById('dashboard-acciones');
    const tituloSeccion = document.getElementById('titulo-seccion');

    if (contentBody) {
        observadorPanel.observe(contentBody, { childList: true, subtree: true });
    }
    if (tituloSeccion) {
        observadorPanel.observe(tituloSeccion, { childList: true, characterData: true, subtree: true });
    }

    // Por seguridad, si hacen clic en cualquier parte de la barra lateral, también chequeamos rápido
    document.querySelector('.sidebar-nav')?.addEventListener('click', () => {
        setTimeout(verificarYFijarReportes, 30);
    });
});