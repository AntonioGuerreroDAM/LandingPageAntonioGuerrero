document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. EFECTO DE LETRAS SALTARINAS (Wave) ---
    const titulo = document.getElementById('titulo-animado');
    if (titulo) {
        const texto = titulo.textContent; // textContent es ligeramente más rápido que innerText
        titulo.textContent = ""; 

        // Usamos el operador spread [...] para manejar mejor los caracteres
        [...texto].forEach((letra, i) => {
            const span = document.createElement("span");
            // Usamos textContent y el espacio irrompible
            span.textContent = letra === " " ? "\u00A0" : letra;
            span.style.setProperty('--i', i);
            titulo.appendChild(span);
        });
    }

    // --- 2. EFECTO MAGNÉTICO (Logo) ---
    const logo = document.querySelector('#logo-magnetico');
    if (logo) {
        logo.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = logo.getBoundingClientRect();
            
            // Calculamos la distancia desde el centro de la imagen
            const x = (e.clientX - (left + width / 2)) * 0.4; // Bajamos un poco la fuerza (0.4)
            const y = (e.clientY - (top + height / 2)) * 0.4;
            
            logo.style.transform = `translate(${x}px, ${y}px) scale(1.15)`;
        });

        logo.addEventListener('mouseleave', () => {
            // El logo vuelve suavemente gracias al CSS
            logo.style.transform = `translate(0px, 0px) scale(1)`;
        });
    }
});