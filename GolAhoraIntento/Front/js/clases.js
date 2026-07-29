const API_URL = 'http://localhost:5000/api/clases'; 
let listaClases = []; // Variable global para guardar las clases

// 1. OBTENER CLASES
async function cargarClases() {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error('Error al obtener las clases');
        
        const data = await respuesta.json();
        listaClases = data; // Guardamos los datos para poder usarlos en los modales
        renderizarTablaClases(data);
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudieron cargar las clases.");
    }
}

// 2. CREAR CLASE
async function crearClase(datosClase) {
    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosClase)
        });

        const resultado = await respuesta.json();
        
        if (respuesta.ok) {
            alert(resultado.mensaje);
            cargarClases(); 
        } else {
            const errorReal = resultado.mensaje || resultado.title || "Error desconocido";
            alert("No se pudo guardar: " + errorReal);
        }
    } catch (error) {
        console.error("Error al conectar con C#:", error);
    }
}

// 3. ELIMINAR CLASE
async function eliminarClase(idClase) {
    if(!confirm('¿Estás seguro de que deseás eliminar esta clase?')) return;

    try {
        const respuesta = await fetch(`${API_URL}/${idClase}`, {
            method: 'DELETE'
        });

        const resultado = await respuesta.json();
        
        if (respuesta.ok) {
            alert(resultado.mensaje);
            cargarClases();
        } else {
            alert(resultado.mensaje);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// 4. INSCRIBIR ALUMNO
async function inscribirAlumno(idClase, dniCliente) {
    try {
        const respuesta = await fetch(`${API_URL}/${idClase}/inscribir/${dniCliente}`, {
            method: 'POST'
        });

        const resultado = await respuesta.json();
        alert(resultado.mensaje);
        
        if (respuesta.ok) cargarClases();
    } catch (error) {
        console.error("Error:", error);
    }
}

// 4.1 DESINSCRIBIR ALUMNO
async function desinscribirAlumno(idClase, dniCliente) {
    if(!confirm('¿Quitar a este alumno de la clase?')) return;
    try {
        const respuesta = await fetch(`${API_URL}/${idClase}/desinscribir/${dniCliente}`, {
            method: 'DELETE'
        });
        const resultado = await respuesta.json();
        alert(resultado.mensaje);
        if (respuesta.ok) {
            cargarClases();
            document.getElementById('modal-editar-clase').close();
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// 5. DIBUJAR LAS TARJETAS (Reemplaza tu función anterior)
function renderizarTablaClases(clases) {
    const contenedor = document.getElementById('contenedor-clases');
    if (!contenedor) return;

    if (clases.length === 0) {
        contenedor.innerHTML = '<p style="color: white; text-align: center;">No hay clases registradas aún.</p>';
        return;
    }

    // Usamos CSS Grid para que se acomoden solas (responsive)
    let html = `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; margin-top: 20px;">`;

    clases.forEach(clase => {
        const inscriptos = clase.alumnosInscriptos ? clase.alumnosInscriptos.length : 0;
        const id = clase.idActividad || clase.id; 

        // Estructura de la tarjeta
        html += `
            <div class="card-clase">
                <div class="card-info-clase">
                    
                    <div style="width: 100%;">
    <h4 style="color: #bc13fe; margin: 0 0 15px 0; font-size: 1.4rem; letter-spacing: 1px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
        ${clase.nombreActividad.toUpperCase()}
    </h4>
    
    <p style="margin: 12px 0; font-size: 0.95rem; display: flex; align-items: center; gap: 10px; color: white;">
        <svg viewBox="0 0 24 24" fill="none" stroke="#bc13fe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; flex-shrink: 0;">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span><strong>Días:</strong> ${clase.dias}</span>
    </p>
    
    <p style="margin: 12px 0; font-size: 0.95rem; display: flex; align-items: center; gap: 10px; color: white;">
        <svg viewBox="0 0 24 24" fill="none" stroke="#bc13fe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; flex-shrink: 0;">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span><strong>Horario:</strong> ${clase.horario}</span>
    </p>
    
    <p style="margin: 12px 0; font-size: 0.95rem; display: flex; align-items: center; gap: 10px; color: white;">
        <svg viewBox="0 0 24 24" fill="none" stroke="#bc13fe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; flex-shrink: 0;">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <span><strong>Cupo:</strong> ${inscriptos} / ${clase.cupoMaximo}</span>
    </p>
</div>
                    
                    <div style="display: flex; gap: 8px; margin-top: 20px; width: 100%; align-items: center;">
    <button class="btn-neon-violeta" style="flex: 1; padding: 10px 0; font-size: 0.9rem; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 1.5px; cursor: pointer; transition: all 0.2s;" onclick="abrirModalInscripcion(${id})">
    Inscribir</button>
    
    <button onclick="abrirModalEditar(${id})" style="width: 40px; height: 40px; border-radius: 50%; background: #1a1a1a; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: transform 0.2s, background 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='scale(1.1)'; this.style.background='#242424'; this.style.boxShadow='0 0 12px rgba(157, 0, 255, 0.4)';" onmouseout="this.style.transform='scale(1)'; this.style.background='#1a1a1a'; this.style.boxShadow='none'">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;">
            <defs>
                <linearGradient id="gradEditar-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#f500d4" />
                    <stop offset="50%" stop-color="#9d00ff" />
                    <stop offset="100%" stop-color="#0066ff" />
                </linearGradient>
            </defs>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="url(#gradEditar-${id})"></path>
            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="url(#gradEditar-${id})"></path>
        </svg>
    </button>
    
    <button onclick="eliminarClase(${id})" style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #8b1364 0%, #540c3c 100%); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: transform 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.3);" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
    </button>
</div>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    contenedor.innerHTML = html;
}

// 6. EVENTOS DE INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    cargarClases();
});

const formClase = document.getElementById('form-nueva-clase');
if (formClase) {
    formClase.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nuevaClase = {
            nombreActividad: document.getElementById('clase-nombre').value,
            cupoMaximo: parseInt(document.getElementById('clase-cupo').value),
            dniProfesor: parseInt(document.getElementById('clase-profe').value),
            dias: document.getElementById('clase-dias').value,
            horario: document.getElementById('clase-horario').value
        };
        await crearClase(nuevaClase);
        document.getElementById('modal-nueva-clase').close(); 
        formClase.reset(); 
    });
}

// 7. LÓGICA DE MODALES (Inscripción y Edición)
function abrirModalInscripcion(idClase) {
    document.getElementById('inscripcion-id-clase').value = idClase;
    document.getElementById('modal-inscripcion').showModal();
}

async function confirmarInscripcion() {
    const idClase = document.getElementById('inscripcion-id-clase').value;
    const dni = document.getElementById('inscripcion-dni-cliente').value;
    if(!dni) return alert("Por favor ingresá un DNI");
    await inscribirAlumno(idClase, dni);
    document.getElementById('modal-inscripcion').close();
}

async function abrirModalEditar(id) {
    const clase = listaClases.find(c => c.idActividad == id);
    if (!clase) return;
    document.getElementById('edit-profe').value = clase.dniProfesor;
    document.getElementById('edit-id').value = clase.idActividad;
    document.getElementById('edit-nombre').value = clase.nombreActividad;
    document.getElementById('edit-dias').value = clase.dias;
    document.getElementById('edit-horario').value = clase.horario;
    document.getElementById('edit-cupo').value = clase.cupoMaximo;

    const lista = document.getElementById('ul-alumnos');
    lista.innerHTML = clase.alumnosInscriptos.map(a => `
        <li style="display:flex; justify-content:space-between; margin-bottom:10px; color:white;">
            ${a.nombre} ${a.apellido} (${a.dni})
            <button class="btn-xs outline" style="color:#ff3838;" onclick="desinscribirAlumno(${clase.idActividad}, ${a.dni})">Quitar</button>
        </li>
    `).join('');

    document.getElementById('modal-editar-clase').showModal();
}

function mostrarTab(id) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// 8. LÓGICA DE EDICIÓN (PUT)
const formEditar = document.getElementById('form-editar-clase');
if (formEditar) {
    formEditar.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('edit-id').value;
        const datosEditados = {
        nombreActividad: document.getElementById('edit-nombre').value,
        dias: document.getElementById('edit-dias').value,
        horario: document.getElementById('edit-horario').value,
        cupoMaximo: parseInt(document.getElementById('edit-cupo').value),
        dniProfesor: parseInt(document.getElementById('edit-profe').value) 
};

        try {
            const respuesta = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosEditados)
            });

            const resultado = await respuesta.json();
            
            if (respuesta.ok) {
                alert(resultado.mensaje);
                document.getElementById('modal-editar-clase').close();
                cargarClases();
            } else {
                alert("Error al guardar: " + resultado.mensaje);
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("Error de conexión con el servidor.");
        }
    });
}