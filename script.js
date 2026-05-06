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

    // --- 4. EFECTO MAGNÉTICO (ESCUDO) - Solo en desktop ---
    const logo = document.querySelector('#logo-magnetico');
    if (logo && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
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
    
    // --- 6. SLIDER DE JORNADAS ARRASTRABLE ---
    initJornadasSlider();
    
    // --- 7. TIENDA - SELECCIÓN DE TALLAS ---
    initTienda();
    
    // --- 8. SOPORTE TOUCH PARA CRÓNICAS EN MÓVIL ---
    initCronicasTouch();
    
    // --- 9. SOPORTE TOUCH PARA JUGADORES EN MÓVIL ---
    initJugadoresTouch();
});

function initClasificacionSlider() {
    const sliderContainer = document.getElementById('slider-clasificacion');
    const sliderTrack = document.getElementById('slider-track');
    
    if (!sliderContainer || !sliderTrack) return;

    const equipos = [
        { nombre: "Iglesias Proyectos y Reformas", escudo: "img/escudo/iglesias.png", puntos: 36 },
        { nombre: "Kortatus FS", escudo: "img/escudo/kortatus.png", puntos: 36 },
        { nombre: "El Rosal FS", escudo: "img/escudo/rosal.png", puntos: 28 },
        { nombre: "Peña Cádiz CF Puerto Real", escudo: "img/escudo/peña.png", puntos: 22 },
        { nombre: "CD Luis BeardoAgus Team FS", escudo: "img/escudo/luisbeardo.png", puntos: 21 },
        { nombre: "West Jam York FS", escudo: "img/escudo/westjam.png", puntos: 19 },
        { nombre: "Barberia Haro FS", escudo: "img/escudo/haro.png", puntos: 18 },
        { nombre: "Const. Rey Panorama FS", escudo: "img/escudo/panorama.png", puntos: 15 },
        { nombre: "Agus Team FS", escudo: "img/escudo/agus.png", puntos: 15 },
        { nombre: "La Taberna FS", escudo: "img/escudo/taberna.png", puntos: 15 },
        { nombre: "Yunquera 2010", escudo: "img/escudo/yunquera.png", puntos: 14 },
        { nombre: "Ciudad Jardín FS", escudo: "img/escudo/ciudadjardin.png", puntos: 12 },
        { nombre: "Deportivo Cachucha", escudo: "img/escudo/cachucha.png", puntos: 11 },
        { nombre: "Recre FS", escudo: "img/escudo/recre.png", puntos: 0 },
    ];

    let indiceEquipoDestacado = -1;

    equipos.forEach((equipo, index) => {
        const posicion = index + 1;
        const card = document.createElement('div');
        
        const esDeportivoCachucha = equipo.nombre === "Deportivo Cachucha";
        card.className = esDeportivoCachucha ? 'equipo-card equipo-destacado' : 'equipo-card';
        
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

    // Inicializar sistema de arrastre
    initDragSlider(sliderContainer, sliderTrack, indiceEquipoDestacado);
}

function initJornadasSlider() {
    const sliderContainer = document.getElementById('slider-jornadas');
    const sliderTrack = document.getElementById('slider-track-jornadas');
    
    if (!sliderContainer || !sliderTrack) return;

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

    // Inicializar sistema de arrastre
    initDragSlider(sliderContainer, sliderTrack);
}

function initDragSlider(sliderContainer, sliderTrack, centrarEnIndice = -1) {
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let startTime = 0;
    let startPos = 0;

    function getSliderBounds() {
        const trackWidth = sliderTrack.scrollWidth;
        const containerWidth = sliderContainer.offsetWidth;
        const maxTranslate = 0;
        const minTranslate = Math.min(0, -(trackWidth - containerWidth));
        return { minTranslate, maxTranslate };
    }

    // Función para centrar en un índice específico
    function centrarEnElemento(indice) {
        if (indice === -1) return;
        
        const elementos = sliderTrack.children;
        if (elementos.length === 0 || !elementos[indice]) return;
        
        const elemento = elementos[indice];
        const containerWidth = sliderContainer.offsetWidth;
        const elementoWidth = elemento.offsetWidth;
        const elementoLeft = elemento.offsetLeft;
        
        let posicionCentrada = -(elementoLeft - (containerWidth / 2) + (elementoWidth / 2));
        
        const { minTranslate, maxTranslate } = getSliderBounds();
        posicionCentrada = Math.max(minTranslate, Math.min(maxTranslate, posicionCentrada));
        
        currentTranslate = posicionCentrada;
        prevTranslate = posicionCentrada;
        sliderTrack.style.transform = `translateX(${posicionCentrada}px)`;
    }

    // Centrar en el elemento destacado después de cargar
    if (centrarEnIndice !== -1) {
        setTimeout(() => centrarEnElemento(centrarEnIndice), 100);
    }

    // Eventos de mouse
    sliderContainer.addEventListener('mousedown', dragStart);
    sliderContainer.addEventListener('mousemove', drag);
    sliderContainer.addEventListener('mouseup', dragEnd);
    sliderContainer.addEventListener('mouseleave', dragEnd);

    // Eventos táctiles
    sliderContainer.addEventListener('touchstart', dragStart, { passive: true });
    sliderContainer.addEventListener('touchmove', drag, { passive: false });
    sliderContainer.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        isDragging = true;
        startX = getPositionX(e);
        startTime = Date.now();
        startPos = currentTranslate;
        sliderContainer.classList.add('dragging');
        animationID = requestAnimationFrame(animation);
    }

    function drag(e) {
        if (!isDragging) return;
        
        const currentX = getPositionX(e);
        const diff = currentX - startX;
        currentTranslate = prevTranslate + diff;

        const { minTranslate, maxTranslate } = getSliderBounds();
        
        // Efecto de resistencia en los bordes
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
        
        // Calcular velocidad para inercia
        const endTime = Date.now();
        const timeDiff = endTime - startTime;
        const distance = currentTranslate - startPos;
        const velocity = distance / timeDiff;
        
        // Aplicar inercia suave
        if (Math.abs(velocity) > 0.5 && timeDiff < 300) {
            const momentum = velocity * 150;
            currentTranslate += momentum;
        }
        
        // Asegurar límites
        if (currentTranslate > maxTranslate) {
            currentTranslate = maxTranslate;
        } else if (currentTranslate < minTranslate) {
            currentTranslate = minTranslate;
        }

        prevTranslate = currentTranslate;
        
        // Transición suave al soltar
        sliderTrack.style.transition = 'transform 0.3s ease-out';
        setSliderPosition();
        
        setTimeout(() => {
            sliderTrack.style.transition = 'transform 0.1s ease-out';
        }, 300);
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

    // Prevenir arrastre de imágenes
    sliderTrack.addEventListener('dragstart', (e) => e.preventDefault());
    
    // Recalcular posición en resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const { minTranslate, maxTranslate } = getSliderBounds();
            currentTranslate = Math.max(minTranslate, Math.min(maxTranslate, currentTranslate));
            prevTranslate = currentTranslate;
            setSliderPosition();
        }, 100);
    });
}

function initTienda() {
    const tallaBtns = document.querySelectorAll('.talla-btn');
    let tallaSeleccionada = null;

    tallaBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tallaBtns.forEach(b => b.classList.remove('activo'));
            this.classList.add('activo');
            tallaSeleccionada = this.dataset.talla;
        });
    });

    const btnComprar = document.getElementById('btn-comprar');
    const inputNombre = document.getElementById('input-nombre');
    const inputDorsal = document.getElementById('input-dorsal');

    if (btnComprar) {
        btnComprar.addEventListener('click', function() {
            const nombre = inputNombre ? inputNombre.value.trim() : '';
            const dorsal = inputDorsal ? inputDorsal.value : '';

            if (!nombre) {
                alert('Por favor, introduce un nombre para la camiseta.');
                return;
            }

            if (!dorsal || dorsal < 1 || dorsal > 99) {
                alert('Por favor, introduce un dorsal válido (1-99).');
                return;
            }

            if (!tallaSeleccionada) {
                alert('Por favor, selecciona una talla.');
                return;
            }

            // Crear mensaje de WhatsApp
            const mensaje = `¡Hola! Me gustaría comprar una camiseta del Deportivo Cachucha:\n\n` +
                           `📝 Nombre: ${nombre}\n` +
                           `🔢 Dorsal: ${dorsal}\n` +
                           `📏 Talla: ${tallaSeleccionada}\n` +
                           `💰 Precio: 25€`;
            
            const numeroWhatsApp = '34612345678'; // Cambiar por el número real
            const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
            
            window.open(urlWhatsApp, '_blank');
        });
    }
}

function initCronicasTouch() {
    // Solo para dispositivos táctiles
    if (!('ontouchstart' in window)) return;
    
    const cronicaCards = document.querySelectorAll('.cronica-card');
    
    cronicaCards.forEach(card => {
        card.addEventListener('touchstart', function() {
            // Remover clase activa de otras cartas
            cronicaCards.forEach(c => c.classList.remove('touch-active'));
            this.classList.add('touch-active');
        });
    });
    
    // Cerrar al tocar fuera
    document.addEventListener('touchstart', function(e) {
        if (!e.target.closest('.cronica-card')) {
            cronicaCards.forEach(c => c.classList.remove('touch-active'));
        }
    });
}

function initJugadoresTouch() {
    // Solo para dispositivos táctiles
    if (!('ontouchstart' in window)) return;
    
    const jugadorCards = document.querySelectorAll('.jugador-card');
    
    jugadorCards.forEach(card => {
        card.addEventListener('touchstart', function() {
            // Toggle clase activa
            const wasActive = this.classList.contains('touch-active');
            jugadorCards.forEach(c => c.classList.remove('touch-active'));
            if (!wasActive) {
                this.classList.add('touch-active');
            }
        });
    });
    
    // Cerrar al tocar fuera
    document.addEventListener('touchstart', function(e) {
        if (!e.target.closest('.jugador-card')) {
            jugadorCards.forEach(c => c.classList.remove('touch-active'));
        }
    });
}
