// ==========================================================================
// 1. EFECTOS DE NAVEGACIÓN Y SCROLL
// ==========================================================================
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        menuPegajoso.classList.add('scrolled');
    } else {
        menuPegajoso.classList.remove('scrolled');
    }
});

// ==========================================================================
// 2. CONTROL DE MODALES NATIVOS (<dialog>)
// ==========================================================================

// --- Modal de Login ---
btnIngresar.addEventListener('click', () => {
    modalLogin.showModal();
    mensajeError.style.display = 'none';
});
btnCloseModal.addEventListener('click', () => {
    modalLogin.close();
});

// --- Modal de Registro ---
btnRegistrar.addEventListener('click', () => {
    modalRegistrar.showModal(); 
    mensajeErrorRegistro.style.display = 'none';
});
btnCloseRegistrar.addEventListener('click', () => {
    modalRegistrar.close();
});


// --- Puente de Login a Registro ---
const btnIrARegistro = document.getElementById('btn-ir-a-registro');
if (btnIrARegistro) {
    btnIrARegistro.addEventListener('click', () => {
        // Cerramos el modal de login
        modalLogin.close();
        
        // Limpiamos los mensajes de error por las dudas
        mensajeErrorRegistro.style.display = 'none';
        
        // Abrimos el modal de registro
        modalRegistrar.showModal(); 
    });
}

// --- Cerrar al hacer click afuera (Backdrop) ---
const vincularCierreAfuera = (modal) => {
    modal.addEventListener('click', (e) => {
        const dimensiones = modal.getBoundingClientRect();
        if (
            e.clientX < dimensiones.left ||
            e.clientX > dimensiones.right ||
            e.clientY < dimensiones.top ||
            e.clientY > dimensiones.bottom
        ) {
            modal.close();
        }
    });
};
vincularCierreAfuera(modalLogin);
vincularCierreAfuera(modalRegistrar);

// ==========================================================================
// 5. SLIDER DE IMÁGENES
// ==========================================================================
const diapositivas = document.querySelectorAll('.slide');
const puntos = document.querySelectorAll('.dot');
let actual = 0;
let temporizador;

function goToSlide(index) {
    if (!diapositivas.length) return; // Evita errores si no encuentra las fotos
    diapositivas[actual].classList.remove('active');
    puntos[actual].classList.remove('active');
    actual = (index + diapositivas.length) % diapositivas.length;
    diapositivas[actual].classList.add('active');
    puntos[actual].classList.add('active');
}

function nextSlide() { goToSlide(actual + 1); }
function prevSlide() { goToSlide(actual - 1); }

function startAutoplay() {
    temporizador = setInterval(nextSlide, 4000);
}

function resetAutoplay() {
    clearInterval(temporizador);
    startAutoplay();
}

const sliderNext = document.getElementById('slider-next');
const sliderPrev = document.getElementById('slider-prev');
if (sliderNext) sliderNext.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
if (sliderPrev) sliderPrev.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

puntos.forEach(dot => {
    dot.addEventListener('click', () => { goToSlide(+dot.dataset.index); resetAutoplay(); });
});
startAutoplay();

// ==========================================================================
// 6. SCROLL REVEAL (Animación de aparición al bajar)
// ==========================================================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.glass-panel').forEach(panel => {
    observer.observe(panel);
});
