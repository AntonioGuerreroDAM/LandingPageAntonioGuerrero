# Documentación Técnica — Deportivo Cachucha Landing Page

---

## 1. Instrucciones de inicio/ejecución

La web está compuesta por tres archivos principales:

- `index.html` — estructura y contenido de la página
- `styles.css` — estilos y diseño responsivo
- `script.js` — lógica e interactividad

Para ejecutar la página en local:

1. Clona o descarga el repositorio en tu equipo.
2. Asegúrate de mantener la siguiente estructura de carpetas:
   ```
   /
   ├── index.html
   ├── styles.css
   ├── script.js
   └── img/
       ├── cachucha.png
       ├── Camiseta.png
       ├── banderametalica1.PNG
       ├── historia/
       ├── cronicas/
       ├── plantilla/
       └── escudo/
   ```
3. Abre el archivo `index.html` directamente en un navegador moderno (Chrome, Firefox, Edge).
4. La funcionalidad de la tienda requiere conexión a Internet, ya que los pedidos se guardan en **Firebase Firestore**. Sin conexión, el resto de la página funciona con normalidad.

---

## 2. Funcionalidades principales

1. **Botón hamburguesa y menú lateral** — Navegación deslizante accesible desde cualquier sección de la página.
2. **Slider arrastrable de Clasificación** — Scroll horizontal interactivo con soporte para ratón y pantalla táctil.
3. **Tienda con backend Firebase** — Formulario de personalización de camiseta que guarda pedidos en Firestore.
4. **Efecto hover en Crónicas** — Las tarjetas de partido revelan el resultado y los goleadores al pasar el cursor.
5. **Animación de ola en letras** — El título del club y los enlaces del menú lateral animan cada letra de forma escalonada al hacer hover.

---

## 3. Funcionalidad 1 — Botón hamburguesa y menú lateral

### 3.1. Descripción

El botón hamburguesa, situado en la esquina derecha de la barra de navegación fija, permite abrir y cerrar un menú lateral deslizante. Al pulsarlo, el menú aparece desde la derecha de la pantalla mostrando los enlaces a todas las secciones de la página. Al hacer clic en cualquier enlace, el menú se cierra automáticamente y la página desplaza suavemente hasta la sección correspondiente.

### 3.2. Funcionamiento

El botón utiliza la librería **Hamburgers.css** (cargada por CDN), que gestiona la animación visual del icono (tres líneas que se convierten en una X). En JavaScript, se escucha el evento `click` sobre el botón y se alternan dos clases CSS:

- `is-active` en el botón, para que Hamburgers.css ejecute la animación del icono.
- `abierto` en el elemento `<nav>`, que mueve el menú desde `right: -100%` hasta `right: 0` mediante una transición CSS.

Cada enlace del menú también tiene un listener que elimina ambas clases al ser pulsado, cerrando el menú.

### 3.3. Fragmentos de código relevantes

**HTML — Botón y nav:**
```html
<button class="hamburger hamburger--emphatic" type="button" id="boton-menu"
        aria-label="Abrir menú de navegación">
    <span class="hamburger-box">
        <span class="hamburger-inner"></span>
    </span>
</button>

<nav class="menu-lateral" id="menu-desplegable" aria-label="Menú principal">
    <ul class="enlaces-menu">
        <li><a href="#Inicio">Inicio</a></li>
        ...
    </ul>
</nav>
```

El atributo `aria-label` en el botón y el `aria-label` en el `<nav>` son buenas prácticas de accesibilidad para lectores de pantalla.

**CSS — Posición y transición del menú:**
```css
.menu-lateral {
    position: fixed;
    top: var(--navbar-height);
    right: -100%;
    width: 100%;
    max-width: 400px;
    height: calc(100vh - var(--navbar-height));
    background-color: #073a67;
    z-index: 90;
    transition: right 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.menu-lateral.abierto { right: 0; }
```

- `right: -100%` oculta el menú fuera de la pantalla por la derecha.
- Al añadirse la clase `.abierto`, `right` pasa a `0`, haciendo que el menú deslice hacia dentro.
- `cubic-bezier(0.25, 0.46, 0.45, 0.94)` define una curva de aceleración suave y natural.
- `calc(100vh - var(--navbar-height))` hace que el menú ocupe exactamente el espacio disponible bajo la barra fija.

**JavaScript — Activación:**
```javascript
const menuBtn = document.getElementById('boton-menu');
const menuDesplegable = document.getElementById('menu-desplegable');

if (menuBtn && menuDesplegable) {
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('is-active');
        menuDesplegable.classList.toggle('abierto');
    });
}
```

`classList.toggle()` añade la clase si no está presente y la elimina si ya lo está, gestionando la apertura y cierre en una sola línea. Los enlaces del menú también cierran el menú al ser pulsados:

```javascript
enlacesMenu.forEach(enlace => {
    enlace.addEventListener('click', () => {
        menuBtn.classList.remove('is-active');
        menuDesplegable.classList.remove('abierto');
    });
});
```

Este fragmento pertenece a `script.js` y afecta al `<nav id="menu-desplegable">` definido en `index.html` y al bloque `.menu-lateral` de `styles.css`.

---

## 4. Funcionalidad 2 — Slider arrastrable de Clasificación

### 4.1. Descripción

La sección de Clasificación muestra las tarjetas de todos los equipos de la Liga Local en un carrusel horizontal. El usuario puede desplazarse por ellas arrastrando con el ratón o deslizando con el dedo en pantallas táctiles. Al cargarse, el slider se centra automáticamente en la tarjeta del Deportivo Cachucha, que aparece visualmente destacada con un estilo diferente al del resto.

### 4.2. Funcionamiento

Las tarjetas se generan dinámicamente en JavaScript a partir de un array de datos. A continuación se inicializa el sistema de arrastre mediante `initDragSlider()`, una función genérica que también reutiliza la sección de Jornadas. El sistema captura los eventos `mousedown`/`mousemove`/`mouseup` y sus equivalentes táctiles (`touchstart`/`touchmove`/`touchend`), calculando la diferencia de posición entre el inicio y el punto actual del arrastre para mover el track mediante `transform: translateX()`. Incluye un efecto de inercia al soltar y resistencia elástica en los bordes.

### 4.3. Fragmentos de código relevantes

**JavaScript — Generación dinámica de tarjetas:**
```javascript
equipos.forEach((equipo, index) => {
    const posicion = index + 1;
    const card = document.createElement('div');
    
    const esDeportivoCachucha = equipo.nombre === "Deportivo Cachucha";
    card.className = esDeportivoCachucha ? 'equipo-card equipo-destacado' : 'equipo-card';

    let posicionClass = 'posicion-normal';
    if (posicion === 1) posicionClass = 'posicion-oro';
    else if (posicion === 2) posicionClass = 'posicion-plata';
    else if (posicion === 3) posicionClass = 'posicion-bronce';

    card.innerHTML = `
        <div class="equipo-posicion ${posicionClass}">${posicion}</div>
        ...
    `;
    sliderTrack.appendChild(card);
});
```

Para cada equipo del array se crea un `div` con `document.createElement`, se asignan las clases correspondientes según la posición (oro, plata, bronce) y si es el Deportivo Cachucha se aplica la clase `equipo-destacado`. Finalmente se inserta en el DOM con `appendChild`.

**JavaScript — Sistema de arrastre con inercia:**
```javascript
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
    if (currentTranslate > maxTranslate) {
        currentTranslate = maxTranslate + (currentTranslate - maxTranslate) * 0.2;
    } else if (currentTranslate < minTranslate) {
        currentTranslate = minTranslate + (currentTranslate - minTranslate) * 0.2;
    }
}

function dragEnd() {
    ...
    const velocity = distance / timeDiff;
    if (Math.abs(velocity) > 0.5 && timeDiff < 300) {
        const momentum = velocity * 150;
        currentTranslate += momentum;
    }
    ...
}
```

- `requestAnimationFrame(animation)` sincroniza el movimiento del track con el refresco de pantalla para un movimiento fluido.
- El multiplicador `* 0.2` en los bordes simula resistencia elástica: el usuario puede arrastrar más allá del límite, pero con dificultad.
- En `dragEnd`, si la velocidad supera `0.5 px/ms` y el gesto fue rápido (menos de 300ms), se aplica un momentum proporcional para simular inercia.

**JavaScript — Centrado en el equipo destacado:**
```javascript
function centrarEnElemento(indice) {
    const elemento = elementos[indice];
    const containerWidth = sliderContainer.offsetWidth;
    const elementoWidth = elemento.offsetWidth;
    const elementoLeft = elemento.offsetLeft;
    
    let posicionCentrada = -(elementoLeft - (containerWidth / 2) + (elementoWidth / 2));
    posicionCentrada = Math.max(minTranslate, Math.min(maxTranslate, posicionCentrada));
    
    currentTranslate = posicionCentrada;
    sliderTrack.style.transform = `translateX(${posicionCentrada}px)`;
}
```

Esta función calcula la traslación necesaria para que el elemento en `indice` quede centrado en el contenedor, restando la mitad del contenedor y sumando la mitad del elemento. El resultado se recorta con `Math.max`/`Math.min` para no salir de los límites del track.

Este código reside en `script.js` e interactúa con los elementos `#slider-clasificacion` y `#slider-track` del HTML, y con las clases `.slider-container`, `.slider-track` y `.equipo-card` de `styles.css`.

---

## 5. Funcionalidad 3 — Tienda con backend Firebase

### 5.1. Descripción

La sección Tienda permite al usuario personalizar una camiseta del Deportivo Cachucha introduciendo un nombre (máx. 12 caracteres), un dorsal (1–99) y seleccionando una talla. Al pulsar el botón "Comprar Ahora", el pedido se valida y se almacena en una base de datos en la nube (Firebase Firestore), mostrando al usuario un mensaje de confirmación con el ID único del pedido generado.

### 5.2. Funcionamiento

La aplicación utiliza el SDK de **Firebase versión compat** (cargado mediante etiquetas `<script>` en el HTML), que expone el objeto global `firebase`. Al inicio de `script.js` se inicializa la app con las credenciales del proyecto y se obtiene una referencia a Firestore con `firebase.firestore()`. Cuando el usuario pulsa el botón de compra, se ejecutan validaciones sobre los campos del formulario y, si todo es correcto, se llama a `db.collection("pedidos").add({...})`, que crea un nuevo documento en la colección `pedidos` de Firestore con los datos de la personalización y la fecha.

### 5.3. Fragmentos de código relevantes

**JavaScript — Inicialización de Firebase:**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyBSrPDaUOdlPMZ" + "rsMuUHXAJlIkWPXLvPDQ",
    authDomain: "deportivo-cachucha-tienda.firebaseapp.com",
    projectId: "deportivo-cachucha-tienda",
    storageBucket: "deportivo-cachucha-tienda.firebasestorage.app",
    messagingSenderId: "22136912604",
    appId: "1:22136912604:web:d38fb52faa3a8fdf57d219"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
```

`firebaseConfig` contiene los parámetros de conexión al proyecto de Firebase. `firebase.initializeApp()` registra la configuración y `firebase.firestore()` devuelve la instancia de la base de datos, que se guarda en `db` para usarla a lo largo del script.

**JavaScript — Guardado del pedido:**
```javascript
db.collection("pedidos").add({
    Nombre: nombre,
    Dorsal: parseInt(dorsal),
    Talla: tallaSeleccionada,
    Fecha: new Date().toLocaleString()
})
.then(function(docRef) {
    alert("¡Pedido realizado con éxito! ID: " + docRef.id);
    inputNombre.value = "";
    inputDorsal.value = "";
    tallaBtns.forEach(btn => btn.classList.remove('activo'));
    tallaSeleccionada = null;
})
.catch(function(error) {
    console.error("Error al guardar en Firebase:", error);
    alert("Hubo un error al procesar el pedido. Inténtalo de nuevo.");
});
```

- `db.collection("pedidos").add({...})` crea un nuevo documento en la colección `pedidos` con un ID autogenerado por Firestore. Devuelve una **Promise**.
- `.then(docRef => ...)` se ejecuta si el guardado fue exitoso. `docRef.id` contiene el ID único del documento creado.
- `.catch(error => ...)` captura cualquier error de red o de permisos y lo muestra al usuario.
- `parseInt(dorsal)` convierte el valor del input (que es string) a número entero antes de guardarlo.
- Tras el éxito, se limpian todos los campos para dejar el formulario listo para un nuevo pedido.

**JavaScript — Validación previa:**
```javascript
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
```

Las tres guardas con `return` detienen la ejecución si algún campo no es válido, evitando escrituras incompletas en la base de datos.

**HTML — Carga del SDK (al final del body):**
```html
<script src="https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore-compat.js"></script>
<script src="script.js"></script>
```

Los scripts de Firebase se cargan antes que `script.js` para garantizar que el objeto `firebase` esté disponible cuando se ejecute la inicialización.

Esta funcionalidad afecta a los elementos `#btn-comprar`, `#input-nombre`, `#input-dorsal` y `.talla-btn` del HTML, a los estilos `.tienda-formulario`, `.formulario-input` y `.btn-comprar` de `styles.css`, y a la función `initTienda()` de `script.js`.

---

## 6. Funcionalidad 4 — Hover en tarjetas de Crónicas

### 6.1. Descripción

La sección Crónicas muestra tarjetas con fotografías de los partidos jugados. Al pasar el cursor por encima de una tarjeta en dispositivos de escritorio, la imagen sube ligeramente para dejar espacio a una barra de información que emerge desde la parte inferior, mostrando el resultado del partido y los goleadores. En dispositivos táctiles, el mismo efecto se activa con un toque sobre la tarjeta.

### 6.2. Funcionamiento

Cada tarjeta `.cronica-card` contiene dos capas: `.cronica-imagen-wrapper` (la foto) y `.cronica-info` (la barra con los datos). Por defecto, la barra está oculta debajo de la tarjeta con `transform: translateY(100%)`. Al hacer hover, se aplica a la imagen una traslación negativa igual a la altura de la barra (`calc(-1 * var(--cronica-info-height))`), y a la barra una traslación de `0` para que aparezca. La altura de la barra se mide dinámicamente en JavaScript con `offsetHeight` y se almacena como variable CSS personalizada `--cronica-info-height` en cada tarjeta, lo que garantiza que el desplazamiento sea exacto independientemente del contenido.

En móvil, en lugar del hover, se usa JavaScript para añadir/eliminar la clase `touch-active` al tocar la tarjeta.

### 6.3. Fragmentos de código relevantes

**CSS — Estado inicial y transición:**
```css
.cronica-imagen-wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transition: transform 0.4s ease;
}

.cronica-info {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #1e73be;
    transform: translateY(100%);
    transition: transform 0.4s ease;
}
```

Ambos elementos usan `position: absolute` dentro de `.cronica-card` (que tiene `position: relative`), lo que permite superponerlos y animarlos de forma independiente.

**CSS — Activación del efecto en desktop:**
```css
@media (hover: hover) and (pointer: fine) {
    .cronica-card:hover .cronica-imagen-wrapper {
        transform: translateY(calc(-1 * var(--cronica-info-height)));
    }

    .cronica-card:hover .cronica-info {
        transform: translateY(0);
    }
}
```

La media query `(hover: hover) and (pointer: fine)` garantiza que este CSS solo aplique en dispositivos con ratón real, evitando comportamientos no deseados en táctil.

**JavaScript — Cálculo dinámico de la altura:**
```javascript
function syncCronicasInfoHeight() {
    const cronicaCards = document.querySelectorAll('.cronica-card');

    cronicaCards.forEach(card => {
        const info = card.querySelector('.cronica-info');
        if (!info) return;
        card.style.setProperty('--cronica-info-height', `${info.offsetHeight}px`);
    });
}
```

`info.offsetHeight` devuelve la altura renderizada de `.cronica-info` en píxeles. Esta altura se asigna como variable CSS directamente sobre el elemento `card` con `setProperty`, lo que permite al CSS usar `var(--cronica-info-height)` de forma dinámica. La función se llama tanto en `DOMContentLoaded` como en el evento `resize` de `window`.

**JavaScript — Soporte táctil:**
```css
/* En móvil (styles.css) */
.cronica-card.touch-active .cronica-imagen-wrapper {
    transform: translateY(calc(-1 * var(--cronica-info-height)));
}
.cronica-card.touch-active .cronica-info {
    transform: translateY(0);
}
```

```javascript
function initCronicasTouch() {
    if (!('ontouchstart' in window)) return;
    
    const cronicaCards = document.querySelectorAll('.cronica-card');
    cronicaCards.forEach(card => {
        card.addEventListener('touchstart', function() {
            cronicaCards.forEach(c => c.classList.remove('touch-active'));
            this.classList.add('touch-active');
        });
    });
}
```

La comprobación `'ontouchstart' in window` evita que el código táctil se ejecute en escritorio. La función `initTouchOverlayClose()` en `script.js` complementa esto eliminando la clase activa al tocar fuera de cualquier tarjeta.

---

## 7. Funcionalidad 5 — Animación de ola en letras del título y menú

### 7.1. Descripción

El nombre del club en la barra de navegación ("DEPORTIVO CACHUCHA") y cada enlace del menú lateral animan sus letras de forma escalonada al pasar el cursor por encima, creando un efecto visual de ola: cada letra sube, se aclara levemente y vuelve a su posición, con un retardo progresivo que hace que la animación recorra el texto de izquierda a derecha.

### 7.2. Funcionamiento

La función `prepararLetras()` en JavaScript divide el contenido de texto de cada elemento en caracteres individuales, envuelve cada uno en un `<span>` y le asigna una propiedad CSS personalizada `--i` con su índice. En CSS, la animación `saltito` mueve el span hacia arriba con `translateY(-15px)` y cambia su color. El `animation-delay` de cada letra es `calc(0.06s * var(--i))`, de modo que la letra 0 empieza inmediatamente, la 1 espera 60ms, la 2 espera 120ms, etc., produciendo el efecto de ola.

### 7.3. Fragmentos de código relevantes

**JavaScript — Función `prepararLetras`:**
```javascript
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
```

- `[...texto]` usa el operador spread sobre el string para obtener un array de caracteres, respetando correctamente caracteres Unicode.
- Para los espacios se usa `\u00A0` (espacio de no separación) en lugar de un espacio normal, ya que los spans de bloque ignorarían un espacio común.
- `span.style.setProperty('--i', i)` asigna la variable CSS personalizada `--i` directamente como estilo inline del span, que CSS leerá para calcular el retardo.
- La función se invoca para el título y para cada enlace del menú:

```javascript
const titulo = document.getElementById('titulo-animado');
if (titulo) prepararLetras(titulo);

const enlacesMenu = document.querySelectorAll('.enlaces-menu a');
enlacesMenu.forEach(enlace => prepararLetras(enlace));
```

**CSS — Keyframe y aplicación de la animación:**
```css
@keyframes saltito {
    50% { 
        transform: translateY(-15px); 
        color: #e0e0e0; 
        text-shadow: 0 0 8px rgba(255, 255, 255, 0.8); 
    }
}

.nombre-club:hover span {
    animation: saltito 0.5s ease-in-out forwards;
    animation-delay: calc(0.06s * var(--i));
}

.enlaces-menu li a:hover span {
    animation: saltito 0.5s ease-in-out forwards;
    animation-delay: calc(0.06s * var(--i));
}
```

- El keyframe solo define el estado al 50% (el pico de la animación) y deja el 0% y 100% en el estado por defecto, creando un movimiento de ida y vuelta.
- `forwards` hace que la animación se detenga en su último fotograma en lugar de volver al estado inicial abruptamente.
- `calc(0.06s * var(--i))` lee la variable `--i` asignada por JavaScript y calcula el retardo, creando el efecto de ola escalonado.

Tanto la propiedad `display: inline-block` en los spans (implícita por el contexto flex) como el `--i` son imprescindibles para que la transformación `translateY` y el retardo funcionen correctamente. Esta funcionalidad enlaza directamente `script.js` (función `prepararLetras`) con los selectores `.nombre-club span` y `.enlaces-menu li a span` de `styles.css`, y con los elementos `#titulo-animado` y `.enlaces-menu` del HTML.

---

## 8. Funcionalidades adicionales

### 8.1. Efecto magnético en el escudo del logo

#### 8.1.1. Descripción
El escudo del Deportivo Cachucha en la barra de navegación reacciona al movimiento del cursor: cuando el ratón se acerca, el logo se desplaza ligeramente hacia él como si fuera atraído magnéticamente, y al alejar el cursor vuelve suavemente a su posición original.

#### 8.1.2. Funcionamiento
En JavaScript, sobre el evento `mousemove` del logo, se calcula la distancia del cursor respecto al centro del elemento usando `getBoundingClientRect()`. Esa diferencia se multiplica por `0.4` para suavizar el desplazamiento y se aplica mediante `transform: translate()`.

#### 8.1.3. Fragmento de código
```javascript
logo.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = logo.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * 0.4;
    const y = (e.clientY - (top + height / 2)) * 0.4;
    logo.style.transform = `translate(${x}px, ${y}px) scale(1.15)`;
});

logo.addEventListener('mouseleave', () => {
    logo.style.transform = `translate(0px, 0px) scale(1)`;
});
```

El efecto solo se inicializa si `window.matchMedia('(hover: hover) and (pointer: fine)').matches` devuelve `true`, garantizando que no afecte a dispositivos táctiles. Afecta al elemento `#logo-magnetico` del HTML y a `.imagen-logo` de `styles.css`.

---

### 8.2. Slider de Jornadas arrastrable

#### 8.2.1. Descripción
La sección Jornadas presenta el calendario completo de partidos en un slider horizontal arrastrable, con el mismo comportamiento que el slider de Clasificación: soporte para ratón y táctil, inercia, y resistencia elástica en los bordes. Los partidos en los que participa el Deportivo Cachucha se destacan visualmente con un borde y gradiente diferente.

#### 8.2.2. Funcionamiento
Las tarjetas de partido se generan dinámicamente a partir de un array de objetos en `script.js`. La función `initDragSlider()` es genérica y se reutiliza tanto para Clasificación como para Jornadas, recibiendo el contenedor y el track como parámetros.

#### 8.2.3. Fragmento de código
```javascript
const esPartidoCachucha = partido.local.nombre === "Deportivo Cachucha" || 
                           partido.visitante.nombre === "Deportivo Cachucha";
card.className = esPartidoCachucha ? 'partido-card partido-destacado' : 'partido-card';
```

Afecta a `#slider-jornadas` y `#slider-track-jornadas` del HTML, a `.partido-card` y `.partido-destacado` de `styles.css`, y a las funciones `initJornadasSlider()` e `initDragSlider()` de `script.js`.

---

## 9. Responsividad

### 9.1. Descripción

La página adapta su diseño a todos los tamaños de pantalla: desde monitores de escritorio hasta smartphones de gama baja. En dispositivos móviles, los efectos hover se reemplazan por interacciones táctiles equivalentes, los layouts de varias columnas se convierten en columnas únicas, y los textos escalan de forma fluida con `clamp()`.

### 9.2. Funcionamiento

Se utilizan **media queries** en `styles.css` con cuatro puntos de ruptura principales:

- `max-width: 1024px` — tablets grandes y ajustes en la tienda.
- `max-width: 780px` — tablets y móviles grandes: menú a pantalla completa, historia en columna, crónicas apiladas, tarjetas de jugador al 50%.
- `max-width: 480px` — móviles: reducción de `--navbar-height`, tipografía más compacta, tarjetas de tienda apiladas.
- `max-width: 360px` — móviles muy pequeños: ajustes de escala adicionales en navbar y sliders.

La media query `(hover: hover) and (pointer: fine)` separa los efectos hover exclusivamente para dispositivos con ratón, evitando que se apliquen en táctil. En su lugar, JavaScript gestiona las clases `touch-active` para crónicas y jugadores.

Los tamaños de fuente usan `clamp(min, preferido, max)` para escalar de forma fluida sin necesidad de media queries adicionales.

### 9.3. Fragmentos de código relevantes

**CSS — Variable de altura de navbar por breakpoint:**
```css
:root {
    --navbar-height: 80px;
}

@media (max-width: 780px) {
    :root { --navbar-height: 70px; }
}

@media (max-width: 480px) {
    :root { --navbar-height: 60px; }
}
```

El uso de la variable CSS `--navbar-height` centraliza este valor: al cambiar en `:root`, todos los elementos que la referencian (menú lateral con `calc(100vh - var(--navbar-height))`, hero con `margin-top`, `padding-top`, y `body` con `padding-top`) se adaptan automáticamente.

**CSS — Separación de hover y táctil:**
```css
/* Solo en desktop con ratón */
@media (hover: hover) and (pointer: fine) {
    .cronica-card:hover .cronica-imagen-wrapper {
        transform: translateY(calc(-1 * var(--cronica-info-height)));
    }
    .cronica-card:hover .cronica-info {
        transform: translateY(0);
    }
}

/* Solo en móvil, activado por JS */
.cronica-card.touch-active .cronica-imagen-wrapper {
    transform: translateY(calc(-1 * var(--cronica-info-height)));
}
.cronica-card.touch-active .cronica-info {
    transform: translateY(0);
}
```

**CSS — Tipografía fluida con `clamp`:**
```css
.nombre-club {
    font-size: clamp(0.9rem, 4vw, 1.8rem);
}

.historia-titulo {
    font-size: clamp(1.5rem, 5vw, 2.5rem);
}
```

`clamp(mín, preferido, máx)` define un tamaño de fuente mínimo garantizado, un valor ideal proporcional al ancho de la ventana (`vw`) y un máximo para pantallas grandes. Esto elimina saltos bruscos entre breakpoints.

**CSS — Layout de jugadores adaptativo:**
```css
/* Desktop: 4 por fila (por el gap y max-width del contenedor) */
.plantilla-fila {
    display: flex;
    justify-content: center;
    gap: 25px;
    flex-wrap: wrap;
}

/* Tablet/móvil: 2 por fila */
@media (max-width: 780px) {
    .jugador-card {
        width: calc(50% - 10px);
        max-width: 200px;
    }
}
```

`flex-wrap: wrap` permite que las tarjetas salten a una nueva línea cuando no caben, y combinado con el `width` porcentual asegura exactamente 2 columnas en móvil.

Toda la responsividad se concentra en la sección final de `styles.css` y en las funciones `initCronicasTouch()`, `initJugadoresTouch()` e `initTouchOverlayClose()` de `script.js`.