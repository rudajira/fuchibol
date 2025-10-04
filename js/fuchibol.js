// Variables del juego
let marcador1 = 0;
let marcador2 = 0;
let tiempoInicial = 120; // 2 minutos en segundos
let juegoCorriendo = true;

const marcador1El = document.getElementById('marcador-1');
const marcador2El = document.getElementById('marcador-2');
const tiempoEl = document.getElementById('tiempo');
const jugadorIzq = document.getElementById('jugador-izq');
const jugadorDer = document.getElementById('jugador-der');
const balon = document.getElementById('balon');
const cancha = document.getElementById('cancha');
const arcoIzq = document.getElementById('arco-izq');
const arcoDer = document.getElementById('arco-der');

// Posiciones y velocidades
let jugadorIzqPos = { x: 150, y: cancha.offsetHeight / 2 - 25 };
let jugadorDerPos = { x: cancha.offsetWidth - 200, y: cancha.offsetHeight / 2 - 25 };
let balonPos = { x: cancha.offsetWidth / 2 - 10, y: cancha.offsetHeight / 2 - 10 };
let balonVel = { x: 0, y: 0 };
const playerSpeed = 5;
const balonFriction = 0.99;
const kickStrength = 10;

if (window.top === window.self) {
    // No está en un iframe: oculta todo y muestra un mensaje.
    document.body.innerHTML = '<h1 style="font-family: sans-serif; text-align: center; margin-top: 50px;">Este contenido solo puede ser visto en la página oficial.</h1>';
    document.body.style.visibility = 'visible';
} else {
    // Sí está en un iframe: muestra el juego.
    document.body.style.visibility = 'visible';
}

// Teclas presionadas
let keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Función para actualizar el marcador y resetear la pelota
function updateMarcador(player) {
    if (player === 1) {
        marcador1++;
        marcador1El.textContent = marcador1;
    } else if (player === 2) {
        marcador2++;
        marcador2El.textContent = marcador2;
    }
    resetBalon();
}

// Función para actualizar el temporizador
function updateCronometro() {
    if (juegoCorriendo) {
        tiempoInicial--;
        tiempoEl.textContent = tiempoInicial;
        if (tiempoInicial <= 0) {
            juegoCorriendo = false;
            alert("¡Se acabó el tiempo! El marcador final es " + marcador1 + " - " + marcador2);
        }
    }
}

// Función para resetear la posición de la pelota
function resetBalon() {
    balonPos.x = cancha.offsetWidth / 2 - 10;
    balonPos.y = cancha.offsetHeight / 2 - 10;
    balonVel.x = 0;
    balonVel.y = 0;
}

// Bucle principal del juego
function gameLoop() {
    if (!juegoCorriendo) return;

    // --- Movimiento del Jugador 1 (W, A, S, D)
    if (keys['w'] && jugadorIzqPos.y > 0) jugadorIzqPos.y -= playerSpeed;
    if (keys['s'] && jugadorIzqPos.y < cancha.offsetHeight - jugadorIzq.offsetHeight) jugadorIzqPos.y += playerSpeed;
    if (keys['a'] && jugadorIzqPos.x > 0) jugadorIzqPos.x -= playerSpeed;
    if (keys['d'] && jugadorIzqPos.x < cancha.offsetWidth / 2 - jugadorIzq.offsetWidth) jugadorIzqPos.x += playerSpeed;

    // --- Movimiento del Jugador 2 (Arrow Keys)
    if (keys['ArrowUp'] && jugadorDerPos.y > 0) jugadorDerPos.y -= playerSpeed;
    if (keys['ArrowDown'] && jugadorDerPos.y < cancha.offsetHeight - jugadorDer.offsetHeight) jugadorDerPos.y += playerSpeed;
    if (keys['ArrowLeft'] && jugadorDerPos.x > cancha.offsetWidth / 2) jugadorDerPos.x -= playerSpeed;
    if (keys['ArrowRight'] && jugadorDerPos.x < cancha.offsetWidth - jugadorDer.offsetWidth) jugadorDerPos.x += playerSpeed;

    // --- Movimiento de la Pelota
    balonPos.x += balonVel.x;
    balonPos.y += balonVel.y;
    balonVel.x *= balonFriction;
    balonVel.y *= balonFriction;

    // Detección de colisiones con los bordes
    if (balonPos.x <= 0 || balonPos.x + balon.offsetWidth >= cancha.offsetWidth) {
        balonVel.x = -balonVel.x;
    }
    if (balonPos.y <= 0 || balonPos.y + balon.offsetHeight >= cancha.offsetHeight) {
        balonVel.y = -balonVel.y;
    }

    // --- Colisión y Mecánica de Tiro

    // Colisión Jugador 1
    /*
    const dx1 = balonPos.x - jugadorIzqPos.x;
    const dy1 = balonPos.y - jugadorIzqPos.y;
    const distance1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    if (distance1 < jugadorIzq.offsetWidth) {
        const angle = Math.atan2(dy1, dx1);
        balonVel.x = Math.cos(angle) * kickStrength;
        balonVel.y = Math.sin(angle) * kickStrength;
    }
    */
    // Colisión Jugador 1 (Lógica Rectangular)
    if (balonPos.x < jugadorIzqPos.x + jugadorIzq.offsetWidth &&
        balonPos.x + balon.offsetWidth > jugadorIzqPos.x &&
        balonPos.y < jugadorIzqPos.y + jugadorIzq.offsetHeight &&
        balonPos.y + balon.offsetHeight > jugadorIzqPos.y) {

        // La lógica de pateo puede seguir siendo la misma
        const dx1 = (balonPos.x + balon.offsetWidth / 2) - (jugadorIzqPos.x + jugadorIzq.offsetWidth / 2);
        const dy1 = (balonPos.y + balon.offsetHeight / 2) - (jugadorIzqPos.y + jugadorIzq.offsetHeight / 2);

        const angle = Math.atan2(dy1, dx1);
        balonVel.x = Math.cos(angle) * kickStrength;
        balonVel.y = Math.sin(angle) * kickStrength;
    }

    // Colisión Jugador 2
    /*
    const dx2 = balonPos.x - jugadorDerPos.x;
    const dy2 = balonPos.y - jugadorDerPos.y;
    const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    if (distance2 < jugadorDer.offsetWidth) {
        const angle = Math.atan2(dy2, dx2);
        balonVel.x = Math.cos(angle) * kickStrength;
        balonVel.y = Math.sin(angle) * kickStrength;
    }
    */
    // Colisión Jugador 2 (Lógica Rectangular)
    if (balonPos.x < jugadorDerPos.x + jugadorDer.offsetWidth &&
        balonPos.x + balon.offsetWidth > jugadorDerPos.x &&
        balonPos.y < jugadorDerPos.y + jugadorDer.offsetHeight &&
        balonPos.y + balon.offsetHeight > jugadorDerPos.y) {

        // Lógica de pateo basada en el centro de los objetos
        const dx2 = (balonPos.x + balon.offsetWidth / 2) - (jugadorDerPos.x + jugadorDer.offsetWidth / 2);
        const dy2 = (balonPos.y + balon.offsetHeight / 2) - (jugadorDerPos.y + jugadorDer.offsetHeight / 2);

        const angle = Math.atan2(dy2, dx2);
        balonVel.x = Math.cos(angle) * kickStrength;
        balonVel.y = Math.sin(angle) * kickStrength;
    }

    // Detección de Gol
    if (balonPos.x <= arcoIzq.offsetWidth && balonPos.y >= arcoIzq.offsetTop && balonPos.y <= arcoIzq.offsetTop + arcoIzq.offsetHeight) {
        updateMarcador(2);
    }
    if (balonPos.x + balon.offsetWidth >= cancha.offsetWidth - arcoDer.offsetWidth && balonPos.y >= arcoDer.offsetTop && balonPos.y <= arcoDer.offsetTop + arcoDer.offsetHeight) {
        updateMarcador(1);
    }

    // Actualizar posiciones en la pantalla
    jugadorIzq.style.left = jugadorIzqPos.x + 'px';
    jugadorIzq.style.top = jugadorIzqPos.y + 'px';
    jugadorDer.style.left = jugadorDerPos.x + 'px';
    jugadorDer.style.top = jugadorDerPos.y + 'px';
    balon.style.left = balonPos.x + 'px';
    balon.style.top = balonPos.y + 'px';

    requestAnimationFrame(gameLoop);
}

// Iniciar el temporizador
setInterval(updateCronometro, 1000);

// Iniciar el bucle del juego
requestAnimationFrame(gameLoop);

