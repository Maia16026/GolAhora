// ==========================================================================
// PROCESAR LOGIN AL SISTEMA (Conexión Real con API C# y JWT)
// ==========================================================================
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    mensajeError.style.display = 'none';

    // 1. Capturamos las credenciales del formulario
    const credenciales = {
        mail: document.getElementById('input-usuario').value.trim(),
        contrasena: document.getElementById('input-password').value
    };

    // Feedback visual: Bloqueamos el botón para evitar clicks dobles
    const btnSubmit = formLogin.querySelector('button[type="submit"]');
    const textoOriginal = btnSubmit.innerText;
    btnSubmit.innerText = 'VERIFICANDO...';
    btnSubmit.disabled = true;

    try {
        const URL_API_LOGIN = API_URL+'/auth/login'; 

        // 2. Petición asíncrona al backend
        const response = await fetch(URL_API_LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credenciales)
        });

        // Si el servidor responde con un código de error (400, 401, 500, etc.)
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Usuario o contraseña incorrectos.');
        }

        // 3. Si la respuesta es exitosa, procesamos el JSON (esperamos Token y Rol)
        const data = await response.json(); 
        
        // Guardamos el token de seguridad JWT de forma persistente en el navegador
        localStorage.setItem('tokenGolAhora', data.token);
        
        let rolCrudo = data.rol || data.Rol || data.role || data.Role || 'cliente';
        if (Array.isArray(rolCrudo)) rolCrudo = rolCrudo[0];
        
        const nombreUsr = data.nombre || data.Nombre || 'Jugador'; 
        
        // 👇 ESTAS SON LAS LÍNEAS NUEVAS 👇
        localStorage.setItem('rolGolAhora', rolCrudo);
        localStorage.setItem('nombreGolAhora', nombreUsr);
        localStorage.setItem('dniGolAhora', data.dni || data.Dni || data.DNI);
        
        const rolUsuario = String(rolCrudo).toLowerCase().trim();

        // Atrapamos nombre y apellido
        const apellidoUsr = data.apellido || data.Apellido || '';
        const nombreCompleto = `${nombreUsr} ${apellidoUsr}`.trim();

        // Inyectamos el nombre en la barra lateral del panel oscuro
        const lblNombreSidebar = document.getElementById('nombre-admin-sidebar');
        if (lblNombreSidebar) {
            lblNombreSidebar.innerText = nombreCompleto;
        }

        if (rolUsuario === 'administrador' || rolUsuario === 'admin') {
            activarPanelControl();
            renderDashboardAdmin();
        } else if (rolUsuario === 'profe' || rolUsuario === 'entrenador') {
            activarPanelControl();
            renderDashboardProfe();
        } else {
            // SI ES CLIENTE: Cerramos el modal pero NO ocultamos la página pública
            modalLogin.close();
            activarModoCliente(nombreUsr);
        }

    } catch (error) {
        // Manejo de excepciones en consola y pantalla
        console.error("Error en la autenticación:", error);
        mensajeError.innerText = error.message || 'Error de conexión con el servidor.';
        mensajeError.style.display = 'block';
    } finally {
        // Este bloque se ejecuta SIEMPRE, liberando el botón al terminar todo el circuito
        btnSubmit.innerText = textoOriginal;
        btnSubmit.disabled = false;
    }
});

function activarPanelControl() {
    modalLogin.close();
    sitioPublico.style.display = 'none';
    menuPegajoso.style.display = 'none'; 
    if(btnWsp) btnWsp.style.display = 'none'; // <-- Apagamos WhatsApp
    panelControl.style.display = 'grid'; // <-- Cambiamos a grid para el nuevo layout
    dashboardAcciones.innerHTML = ''; 
}

// ==========================================================================
// LÓGICA DE VISTA CLIENTE EN PÁGINA PÚBLICA
// ==========================================================================

// 1. Activar el menú logueado
function activarModoCliente(nombre) {
    document.getElementById('nav-modo-publico').style.display = 'none';
    document.getElementById('nav-modo-cliente').style.display = 'flex';
    document.getElementById('nav-nombre-cliente').innerText = nombre;
}

// 2. Botón SALIR del Cliente
document.getElementById('btn-logout-cliente').addEventListener('click', () => {
    localStorage.removeItem('tokenGolAhora');
    localStorage.removeItem('rolGolAhora');    
    localStorage.removeItem('nombreGolAhora');
    localStorage.removeItem('dniGolAhora');
    
    // Restauramos el menú superior a su estado original
    document.getElementById('nav-modo-cliente').style.display = 'none';
    document.getElementById('nav-modo-publico').style.display = 'flex';
    
    // Lo llevamos arriba de todo
    window.scrollTo(0, 0);
});

function renderDashboardProfe() {
    rolTitulo.innerHTML = 'PANEL DE <span>ENTRENADORES</span>';
    dashboardAcciones.innerHTML = `
        <p style="text-align: left; color: #aaa;">Bienvenido, Profe. Agenda de entrenamientos y clases del día:</p>
        <ul class="uml-list">
            <li>
                <div>
                    <strong> Ver Agenda de Clases Asignadas</strong><br>
                    <span>Turno Tarde: 18:00hs a 20:00hs (Cancha F5 - 12 Alumnos).</span>
                </div>
                <button class="btn-sm">Pasar Lista</button>
            </li>
            <li>
                <div>
                    <strong> Modificar Disponibilidad Horaria</strong><br>
                    <span>Editar tus bloques de horarios libres.</span>
                </div>
                <button class="btn-sm">Modificar</button>
            </li>
        </ul>
    `;
}

// CERRAR SESIÓN (Logout seguro unificado)
btnCerrarSesion.addEventListener('click', () => {
    localStorage.removeItem('tokenGolAhora');
    localStorage.removeItem('rolGolAhora');    
    localStorage.removeItem('nombreGolAhora'); 
    localStorage.removeItem('dniGolAhora');
    panelControl.style.display = 'none';
    sitioPublico.style.display = 'flex';
    menuPegajoso.style.display = '';
    if(btnWsp) btnWsp.style.display = 'flex';
    formLogin.reset(); 
    window.scrollTo(0, 0);
});


// ==========================================================================
// 4. PROCESAR REGISTRO DE USUARIO (Envío asíncrono del objeto estructurado)
// ==========================================================================
formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    mensajeErrorRegistro.style.display = 'none';

    const mailInput = document.getElementById('reg-mail').value.trim();

    // Validación personalizada del correo electrónico antes del envío
    if (!mailInput.includes('@') || !mailInput.toLowerCase().endsWith('.com')) {
        mensajeErrorRegistro.innerText = 'El correo electrónico debe ser válido y terminar en .com';
        mensajeErrorRegistro.style.display = 'block';
        return; 
    }

    const dniValor = parseInt(document.getElementById('reg-dni').value);

    // Armamos el JSON con la estructura idéntica que espera tu backend en C#
    const usuarioJSON = {
        "dni": dniValor,
        "nombre": document.getElementById('reg-nombre').value.trim(),
        "apellido": document.getElementById('reg-apellido').value.trim(),
        "direccion_": {
            // El idDireccion no se manda porque el controlador lo autoincrementa
            "calle": document.getElementById('reg-calle').value.trim(),
            "numero": parseInt(document.getElementById('reg-numero').value),
            "localidad": document.getElementById('reg-localidad').value.trim(),
            "barrio": document.getElementById('reg-barrio').value.trim(),
            "codigoPostal": parseInt(document.getElementById('reg-cp').value),
            "dniUsuario": dniValor // Clave foránea vinculada automáticamente
        },
        "telefono": parseInt(document.getElementById('reg-telefono').value),
        "mail": mailInput,
        "contrasena": document.getElementById('reg-password').value
    };

    // Feedback visual en el botón de registro
    const btnSubmit = formRegistro.querySelector('button[type="submit"]');
    const textoOriginal = btnSubmit.innerText;
    btnSubmit.innerText = 'PROCESANDO REGISTRO...';
    btnSubmit.disabled = true;

    try {
        
        const URL_API_REGISTRO = API_URL+'/Usuario/registrar'; 

        const response = await fetch(URL_API_REGISTRO, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioJSON)
        });

        // Si el backend rechaza el registro (ej. DNI duplicado o campos inválidos)
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Hubo un problema en el servidor al registrar.');
        }

        // Si el estado HTTP es 200/201 OK
        alert('¡Registro exitoso! La cuenta y la dirección fueron guardadas. Ya podés iniciar sesión.');
        modalRegistrar.close();
        formRegistro.reset();

    } catch (error) {
        console.error("❌ Error en el proceso de registro:", error);
        mensajeErrorRegistro.innerText = error.message || 'Error de conexión con el servidor.';
        mensajeErrorRegistro.style.display = 'block';
    } finally {
        btnSubmit.innerText = textoOriginal;
        btnSubmit.disabled = false;
    }
});


// ==========================================================================
// MANTENER SESIÓN ACTIVA AL RECARGAR (F5)
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Buscamos en la memoria si dejamos algo guardado de la sesión anterior
    const token = localStorage.getItem('tokenGolAhora');
    const rolCrudo = localStorage.getItem('rolGolAhora');
    const nombreUsr = localStorage.getItem('nombreGolAhora');

    // 2. Si encontramos el token y el rol, restauramos la vista
    if (token && rolCrudo) {
        // Formateamos el rol por las dudas (como hacemos en el login)
        const rolUsuario = String(rolCrudo).toLowerCase().trim();

        if (rolUsuario === 'administrador' || rolUsuario === 'admin') {
            activarPanelControl();
            renderDashboardAdmin();
            
            // Re-inyectamos el nombre en el sidebar oscuro
            const lblNombreSidebar = document.getElementById('nombre-admin-sidebar');
            if (lblNombreSidebar) lblNombreSidebar.innerText = nombreUsr;
            
        } else if (rolUsuario === 'profe' || rolUsuario === 'entrenador' || rolUsuario === 'profesor') {
            activarPanelControl();
            renderDashboardProfe();
        } else {
            // Es un cliente común
            activarModoCliente(nombreUsr || 'Jugador');
        }
    }
});

