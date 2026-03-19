document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ACTIVACIÓN DEL BOTÓN HAMBURGUESA EMPHATIC ---
    const menuBtn = document.getElementById('boton-menu');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            // Alterna la clase is-active para activar la animación de jonsuh.com
            menuBtn.classList.toggle('is-active');
        });
    }

    // --- 2. EFECTO DE LETRAS SALTARINAS (Título) ---
    const titulo = document.getElementById('titulo-animado');
    if (titulo) {
        const texto = titulo.textContent; 
        titulo.textContent = ""; 

        [...texto].forEach((letra, i) => {
            const span = document.createElement("span");
            span.textContent = letra === " " ? "\u00A0" : letra;
            span.style.setProperty('--i', i);
            titulo.appendChild(span);
        });
    }

    // --- 3. EFECTO MAGNÉTICO (Escudo) ---
    const logo = document.querySelector('#logo-magnetico');
    if (logo) {
        logo.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = logo.getBoundingClientRect();
            
            const x = (e.clientX - (left + width / 2)) * 0.4;
            const y = (e.clientY - (top + height / 2)) * 0.4;
            
            logo.style.transform = `translate(${x}px, ${y}px) scale(1.15)`;
        });

        logo.addEventListener('mouseleave', () => {
            logo.style.transform = `translate(0px, 0px) scale(1)`;
        });
    }
});