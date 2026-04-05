document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ACTIVACIÓN DEL BOTÓN Y MENÚ LATERAL ---
    const menuBtn = document.getElementById('boton-menu');
    const menuDesplegable = document.getElementById('menu-desplegable');
    
    if (menuBtn && menuDesplegable) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('is-active');
            menuDesplegable.classList.toggle('abierto');
        });
    }

    // --- 2. EFECTO LETRAS SALTANDO (TÍTULO) ---
    const titulo = document.getElementById('titulo-animado');
    if (titulo) {
        prepararLetras(titulo);
    }

    // --- 3. EFECTO LETRAS SALTANDO EN EL MENÚ ---
    const enlacesMenu = document.querySelectorAll('.enlaces-menu a');
    enlacesMenu.forEach(enlace => {
        prepararLetras(enlace);
        
        enlace.addEventListener('click', () => {
            menuBtn.classList.remove('is-active');
            menuDesplegable.classList.remove('abierto');
        });
    });

    function prepararLetras(elemento) {
        const texto = elemento.textContent;
        elemento.textContent = "";
        [...texto].forEach((letra, i) => {
            const span = document.createElement("span");
            span.textContent = letra === " " ? "\u00A0" : letra;
            span.style.setProperty('--i', i);
            elemento.appendChild(span);
        });
    }

    // --- 4. EFECTO MAGNÉTICO (ESCUDO) ---
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

    // --- 5. SLIDER DE CLASIFICACIÓN ARRASTRABLE ---
    initClasificacionSlider();
});

function initClasificacionSlider() {
    const sliderContainer = document.getElementById('slider-clasificacion');
    const sliderTrack = document.getElementById('slider-track');
    
    if (!sliderContainer || !sliderTrack) return;

    const equipos = [
        { nombre: "Kortatus FS", escudo: "img/escudo/kortatus.png", puntos: 36 },
        { nombre: "Iglesias Proyectos y Reformas", escudo: "img/escudo/iglesias.png", puntos: 30 },
        { nombre: "El Rosal FS", escudo: "img/escudo/rosal.png", puntos: 25 },
        { nombre: "Peña Cádiz CF Puerto Real", escudo: "img/escudo/peña.png", puntos: 21 },
        { nombre: "Agus Team FS", escudo: "img/escudo/agus.png", puntos: 18 },
        { nombre: "CD Luis Beardo", escudo: "img/escudo/luisbeardo.png", puntos: 18 },
        { nombre: "La Taberna FS", escudo: "img/escudo/taberna.png", puntos: 15 },
        { nombre: "Const. Rey Panorama FS", escudo: "img/escudo/panorama.png", puntos: 15 },
        { nombre: "Yunquera 2010", escudo: "img/escudo/yunquera.png", puntos: 14 },
        { nombre: "West Jam York FS", escudo: "img/escudo/westjam.png", puntos: 13 },
        { nombre: "Barberia Haro FS", escudo: "img/escudo/haro.png", puntos: 12 },
        { nombre: "Deportivo Cachucha", escudo: "img/escudo/cachucha.png", puntos: 11 },
        { nombre: "Ciudad Jardín FS", escudo: "img/escudo/ciudadjardin.png", puntos: 9 },
        { nombre: "Recre FS", escudo: "img/escudo/recre.png", puntos: 0 },
    ];

    // NUEVO: Variable para guardar el índice del equipo destacado
    let indiceEquipoDestacado = -1;

    equipos.forEach((equipo, index) => {
        const posicion = index + 1;
        const card = document.createElement('div');
        
        const esDeportivoCachucha = equipo.nombre === "Deportivo Cachucha";
        card.className = esDeportivoCachucha ? 'equipo-card equipo-destacado' : 'equipo-card';
        
        // NUEVO: Guardar el índice del equipo destacado
        if (esDeportivoCachucha) {
            indiceEquipoDestacado = index;
        }
        
        let posicionClass = 'posicion-normal';
        if (posicion === 1) posicionClass = 'posicion-oro';
        else if (posicion === 2) posicionClass = 'posicion-plata';
        else if (posicion === 3) posicionClass = 'posicion-bronce';

        card.innerHTML = `
            <div class="equipo-posicion ${posicionClass}">${posicion}</div>
            <div class="equipo-logo">
                <img src="${equipo.escudo}" alt="Escudo ${equipo.nombre}" class="equipo-escudo-img">
            </div>
            <div class="equipo-nombre">${equipo.nombre}</div>
            <div class="equipo-puntos">${equipo.puntos}</div>
            <div class="equipo-puntos-label">PTS</div>
        `;
        
        sliderTrack.appendChild(card);
    });

    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    function getSliderBounds() {
        const trackWidth = sliderTrack.scrollWidth;
        const containerWidth = sliderContainer.offsetWidth;
        const maxTranslate = 0;
        const minTranslate = -(trackWidth - containerWidth);
        return { minTranslate, maxTranslate };
    }

    // NUEVO: Función para centrar el slider en el equipo destacado
    function centrarEnEquipoDestacado() {
        if (indiceEquipoDestacado === -1) return;
        
        // Obtener todas las tarjetas
        const tarjetas = sliderTrack.querySelectorAll('.equipo-card');
        if (tarjetas.length === 0) return;
        
        // Obtener la tarjeta destacada
        const tarjetaDestacada = tarjetas[indiceEquipoDestacado];
        if (!tarjetaDestacada) return;
        
        // Calcular la posición para centrar la tarjeta en el contenedor
        const containerWidth = sliderContainer.offsetWidth;
        const tarjetaWidth = tarjetaDestacada.offsetWidth;
        const tarjetaLeft = tarjetaDestacada.offsetLeft;
        
        // Posición para centrar: mover el track para que la tarjeta quede en el centro
        let posicionCentrada = -(tarjetaLeft - (containerWidth / 2) + (tarjetaWidth / 2));
        
        // Asegurarse de no pasar los límites
        const { minTranslate, maxTranslate } = getSliderBounds();
        if (posicionCentrada > maxTranslate) {
            posicionCentrada = maxTranslate;
        } else if (posicionCentrada < minTranslate) {
            posicionCentrada = minTranslate;
        }
        
        // Aplicar la posición
        currentTranslate = posicionCentrada;
        prevTranslate = posicionCentrada;
        sliderTrack.style.transform = `translateX(${posicionCentrada}px)`;
    }

    // NUEVO: Centrar en el equipo destacado al cargar la página
    // Usamos setTimeout para asegurar que el DOM esté completamente renderizado
    setTimeout(centrarEnEquipoDestacado, 100);

    sliderContainer.addEventListener('mousedown', dragStart);
    sliderContainer.addEventListener('mousemove', drag);
    sliderContainer.addEventListener('mouseup', dragEnd);
    sliderContainer.addEventListener('mouseleave', dragEnd);

    sliderContainer.addEventListener('touchstart', dragStart, { passive: true });
    sliderContainer.addEventListener('touchmove', drag, { passive: false });
    sliderContainer.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        isDragging = true;
        startX = getPositionX(e);
        sliderContainer.classList.add('dragging');
        animationID = requestAnimationFrame(animation);
    }

    function drag(e) {
        if (!isDragging) return;
        
        const currentX = getPositionX(e);
        const diff = currentX - startX;
        currentTranslate = prevTranslate + diff;

        const { minTranslate, maxTranslate } = getSliderBounds();
        
        if (currentTranslate > maxTranslate) {
            currentTranslate = maxTranslate + (currentTranslate - maxTranslate) * 0.2;
        } else if (currentTranslate < minTranslate) {
            currentTranslate = minTranslate + (currentTranslate - minTranslate) * 0.2;
        }

        if (e.type === 'touchmove') {
            e.preventDefault();
        }
    }

    function dragEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        cancelAnimationFrame(animationID);
        sliderContainer.classList.remove('dragging');

        const { minTranslate, maxTranslate } = getSliderBounds();
        
        if (currentTranslate > maxTranslate) {
            currentTranslate = maxTranslate;
        } else if (currentTranslate < minTranslate) {
            currentTranslate = minTranslate;
        }

        prevTranslate = currentTranslate;
        setSliderPosition();
    }

    function getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    function animation() {
        setSliderPosition();
        if (isDragging) {
            requestAnimationFrame(animation);
        }
    }

    function setSliderPosition() {
        sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
    }

    sliderTrack.addEventListener('dragstart', (e) => e.preventDefault());

    // --- 6. SLIDER DE JORNADAS ARRASTRABLE ---
initJornadasSlider();

function initJornadasSlider() {
    const sliderContainer = document.getElementById('slider-jornadas');
    const sliderTrack = document.getElementById('slider-track-jornadas');
    
    if (!sliderContainer || !sliderTrack) return;

    // Array de partidos (14 jornadas)
    const partidos = [
        { 
            jornada: 1,
            local: { nombre: "Deportivo Cachucha", escudo: "img/escudo/cachucha.png" },
            visitante: { nombre: "El Rosal FS", escudo: "img/escudo/rosal.png" },
            fecha: "17 Oct 2025",
            hora: "20:00",
            pabellon: "Sala de Barrio Rio San Pedro"
        },
        { 
            jornada: 2,
            local: { nombre: "Recre FS", escudo: "img/escudo/recre.png"  },
            visitante: { nombre: "Deportivo Cachucha", escudo: "img/escudo/cachucha.png" },
            fecha: "7 Nov 2025",
            hora: "21:00",
            pabellon: "Sala de Barrio Rio San Pedro"
        },
        { 
            jornada: 3,
            local: { nombre: "Deportivo Cachucha", escudo: "img/escudo/cachucha.png" },
            visitante: { nombre: "La Taberna FS", escudo: "img/escudo/taberna.png" },
            fecha: "14 Nov 2025",
            hora: "21:00",
            pabellon: "Sala de Barrio Rio San Pedro"
        },
        { 
            jornada: 4,
            local: { nombre: "West Jam York FS", escudo: "img/escudo/westjam.png" },
            visitante: { nombre: "Deportivo Cachucha", escudo: "img/escudo/cachucha.png" },
            fecha: "22 Nov 2025",
            hora: "21:00",
            pabellon: "Sala de Barrio Rio San Pedro"
        },
        { 
            jornada: 5,
            local: { nombre: "Kortatus FS", escudo: "img/escudo/kortatus.png" },
            visitante: { nombre: "Deportivo Cachucha", escudo: "img/escudo/cachucha.png" },
            fecha: "12 Dic 2025",
            hora: "20:00",
            pabellon: "Sala de Barrio Rio San Pedro"
        },
        { 
            jornada: 6,
            local: { nombre: "Deportivo Cachucha", escudo: "img/escudo/cachucha.png" },
            visitante: { nombre: "Peña Cadiz CF Puerto Real", escudo: "img/escudo/peña.png" },
            fecha: "14 Ene 2026",
            hora: "21:00",
            pabellon: "Sala de Barrio Rio San Pedro"
        },
        { 
            jornada: 7,
            local: { nombre: "CD Luis Beardo", escudo: "img/escudo/luisbeardo.png" },
            visitante: { nombre: "Deportivo Cachucha", escudo: "img/escudo/cachucha.png" },
            fecha: "23 Ene 2026",
            hora: "20:00",
            pabellon: "Sala de Barrio Rio San Pedro"
        },
        { 
            jornada: 8,
            local: { nombre: "Deportivo Cachucha", escudo: "img/escudo/cachucha.png" },
            visitante: { nombre: "Agus Team FS", escudo: "img/escudo/agus.png" },
            fecha: "14 Feb 2026",
            hora: "20:00",
            pabellon: "Sala de Barrio Rio San Pedro"
        },
        { 
            jornada: 9,
            local: { nombre: "Ciudad Jardín FS", escudo: "img/escudo/ciudadjardin.png" },
            visitante: { nombre: "Deportivo Cachucha", escudo: "img/escudo/cachucha.png" },
            fecha: "28 Feb 2026",
            hora: "20:00",
            pabellon: "Sala de Barrio 512"
        },
        { 
            jornada: 10,
            local: { nombre: "Deportivo Cachucha", escudo: "img/escudo/cachucha.png" },
            visitante: { nombre: "Yunquera 2010", escudo: "img/escudo/yunquera.png" },
            fecha: "14 Mar 2026",
            hora: "16:00",
            pabellon: "Sala de Barrio 512"
        },
        { 
            jornada: 11,
            local: { nombre: "Const. Rey Panorama FS", escudo: "img/escudo/panorama.png" },
            visitante: { nombre: "Deportivo Cachucha", escudo: "img/escudo/cachucha.png" },
            fecha: "21 Mar 2026",
            hora: "21:00",
            pabellon: "Sala de Barrio Rio San Pedro"
        },
        { 
            jornada: 12,
            local: { nombre: "Deportivo Cachucha", escudo: "img/escudo/cachucha.png" },
            visitante: { nombre: "Iglesias Proyectos y Reformas", escudo: "img/escudo/iglesias.png" },
            fecha: "27 Mar 2026",
            hora: "20:00",
            pabellon: "Sala de Barrio Rio San Pedro"
        },
        { 
            jornada: 13,
            local: { nombre: "Barbería Haro FS", escudo: "img/escudo/haro.png" },
            visitante: { nombre: "Deportivo Cachucha", escudo: "img/escudo/cachucha.png" },
            fecha: "18 Ene 2025",
            hora: "18:00",
            pabellon: "Sala de Barrio Rio San Pedro"
        },
    ];

    partidos.forEach((partido) => {
        const card = document.createElement('div');
        
        // Destacar si juega el Deportivo Cachucha
        const esPartidoCachucha = partido.local.nombre === "Deportivo Cachucha" || 
                                   partido.visitante.nombre === "Deportivo Cachucha";
        card.className = esPartidoCachucha ? 'partido-card partido-destacado' : 'partido-card';

        card.innerHTML = `
            <div class="partido-jornada">Jornada ${partido.jornada}</div>
            <div class="partido-equipos">
                <div class="partido-equipo">
                    <div class="partido-escudo">
                        <img src="${partido.local.escudo}" alt="${partido.local.nombre}">
                    </div>
                    <span class="partido-nombre-equipo">${partido.local.nombre}</span>
                </div>
                <span class="partido-vs">VS</span>
                <div class="partido-equipo">
                    <div class="partido-escudo">
                        <img src="${partido.visitante.escudo}" alt="${partido.visitante.nombre}">
                    </div>
                    <span class="partido-nombre-equipo">${partido.visitante.nombre}</span>
                </div>
            </div>
            <div class="partido-info">
                <span class="partido-fecha">${partido.fecha}</span>
                <span class="partido-hora">${partido.hora}</span>
                <span class="partido-pabellon">${partido.pabellon}</span>
            </div>
        `;
        
        sliderTrack.appendChild(card);
    });

    // Sistema de arrastre (igual que clasificacion)
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    function getSliderBounds() {
        const trackWidth = sliderTrack.scrollWidth;
        const containerWidth = sliderContainer.offsetWidth;
        const maxTranslate = 0;
        const minTranslate = -(trackWidth - containerWidth);
        return { minTranslate, maxTranslate };
    }

    sliderContainer.addEventListener('mousedown', dragStart);
    sliderContainer.addEventListener('mousemove', drag);
    sliderContainer.addEventListener('mouseup', dragEnd);
    sliderContainer.addEventListener('mouseleave', dragEnd);

    sliderContainer.addEventListener('touchstart', dragStart, { passive: true });
    sliderContainer.addEventListener('touchmove', drag, { passive: false });
    sliderContainer.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        isDragging = true;
        startX = getPositionX(e);
        sliderContainer.classList.add('dragging');
        animationID = requestAnimationFrame(animation);
    }

    function drag(e) {
        if (!isDragging) return;
        
        const currentX = getPositionX(e);
        const diff = currentX - startX;
        currentTranslate = prevTranslate + diff;

        const { minTranslate, maxTranslate } = getSliderBounds();
        
        if (currentTranslate > maxTranslate) {
            currentTranslate = maxTranslate + (currentTranslate - maxTranslate) * 0.2;
        } else if (currentTranslate < minTranslate) {
            currentTranslate = minTranslate + (currentTranslate - minTranslate) * 0.2;
        }

        if (e.type === 'touchmove') {
            e.preventDefault();
        }
    }

    function dragEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        cancelAnimationFrame(animationID);
        sliderContainer.classList.remove('dragging');

        const { minTranslate, maxTranslate } = getSliderBounds();
        
        if (currentTranslate > maxTranslate) {
            currentTranslate = maxTranslate;
        } else if (currentTranslate < minTranslate) {
            currentTranslate = minTranslate;
        }

        prevTranslate = currentTranslate;
        setSliderPosition();
    }

    function getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    function animation() {
        setSliderPosition();
        if (isDragging) {
            requestAnimationFrame(animation);
        }
    }

    function setSliderPosition() {
        sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
    }

    sliderTrack.addEventListener('dragstart', (e) => e.preventDefault());
}
}