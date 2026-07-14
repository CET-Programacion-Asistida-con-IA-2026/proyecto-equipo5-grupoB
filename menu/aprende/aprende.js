// =============================================
// Stop the Loop — aprende.js
// =============================================

// ── FILTROS DE ARTÍCULOS ──────────────────────
const botonesFiltro = document.querySelectorAll('.filtro-btn');
const tarjetasArticulo = document.querySelectorAll('.articulo-card');

botonesFiltro.forEach(function(boton) {
  boton.addEventListener('click', function() {
    botonesFiltro.forEach(function(btn) { btn.classList.remove('activo'); });
    boton.classList.add('activo');
    const filtroElegido = boton.dataset.filtro;
    tarjetasArticulo.forEach(function(tarjeta) {
      if (filtroElegido === 'todos' || tarjeta.dataset.categoria === filtroElegido) {
        tarjeta.classList.remove('oculto');
      } else {
        tarjeta.classList.add('oculto');
      }
    });
  });
});

// ── HOVER + CLICK EN TÍTULOS DE TÉCNICAS ─────
document.querySelectorAll('.tecnica-titulo').forEach(function(titulo) {
  titulo.addEventListener('click', function() {
    const tecnica = titulo.dataset.tecnica;
    window.location.href = 'tecnicas.html#' + tecnica;
  });
});

// ── MODALES ───────────────────────────────────
// Abrir modal
document.querySelectorAll('.btn-aplicar').forEach(function(btn) {
  btn.addEventListener('click', function() {
    const idModal = btn.dataset.modal;
    document.getElementById(idModal).classList.add('activo');
  });
});

// Cerrar modal con botón X
document.querySelectorAll('.modal-cerrar').forEach(function(btn) {
  btn.addEventListener('click', function() {
    const idModal = btn.dataset.cerrar;
    document.getElementById(idModal).classList.remove('activo');
  });
});

// Cerrar modal clickeando afuera
document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) overlay.classList.remove('activo');
  });
});

// ── MODAL POMODORO ────────────────────────────
let pomodoroIntervalo = null;
let segundosRestantes = 25 * 60;
let rondaActual = 1;
let enDescanso = false;

function formatearTiempo(seg) {
  const m = Math.floor(seg / 60).toString().padStart(2, '0');
  const s = (seg % 60).toString().padStart(2, '0');
  return m + ':' + s;
}

function actualizarDisplay() {
  document.getElementById('pomodoro-display').textContent = formatearTiempo(segundosRestantes);
}

function mostrarMensaje(texto) {
  const msg = document.getElementById('pomodoro-mensaje');
  msg.textContent = texto;
  msg.style.display = 'block';
  setTimeout(function() { msg.style.display = 'none'; }, 5000);
}

document.getElementById('btn-iniciar').addEventListener('click', function() {
  if (pomodoroIntervalo) return;
  document.getElementById('btn-iniciar').disabled = true;
  document.getElementById('btn-pausar').disabled = false;
  document.getElementById('pomodoro-estado').textContent = enDescanso ? '☕ Descansando...' : '🎯 Concentrate en tu tarea';

  pomodoroIntervalo = setInterval(function() {
    segundosRestantes--;
    actualizarDisplay();

    if (segundosRestantes <= 0) {
      clearInterval(pomodoroIntervalo);
      pomodoroIntervalo = null;
      document.getElementById('btn-iniciar').disabled = false;
      document.getElementById('btn-pausar').disabled = true;

      if (!enDescanso) {
        if (rondaActual < 4) {
          mostrarMensaje('¡Buen trabajo! Ahora descansá 5 minutos. 🌿');
          enDescanso = true;
          segundosRestantes = 5 * 60;
          document.getElementById('pomodoro-estado').textContent = '☕ Tiempo de descanso';
        } else {
          mostrarMensaje('¡Completaste 4 Pomodoros! Es momento de hacer un descanso largo. 🎉');
          rondaActual = 1;
          enDescanso = false;
          segundosRestantes = 25 * 60;
          document.getElementById('ronda-actual').textContent = rondaActual;
          document.getElementById('pomodoro-estado').textContent = 'Listo para empezar';
        }
      } else {
        enDescanso = false;
        rondaActual++;
        segundosRestantes = 25 * 60;
        document.getElementById('ronda-actual').textContent = rondaActual;
        document.getElementById('pomodoro-estado').textContent = '🎯 ¡A concentrarse!';
      }
      actualizarDisplay();
    }
  }, 1000);
});

document.getElementById('btn-pausar').addEventListener('click', function() {
  clearInterval(pomodoroIntervalo);
  pomodoroIntervalo = null;
  document.getElementById('btn-iniciar').disabled = false;
  document.getElementById('btn-pausar').disabled = true;
  document.getElementById('pomodoro-estado').textContent = '⏸ Pausado';
});

document.getElementById('btn-reiniciar').addEventListener('click', function() {
  clearInterval(pomodoroIntervalo);
  pomodoroIntervalo = null;
  segundosRestantes = 25 * 60;
  rondaActual = 1;
  enDescanso = false;
  actualizarDisplay();
  document.getElementById('ronda-actual').textContent = 1;
  document.getElementById('btn-iniciar').disabled = false;
  document.getElementById('btn-pausar').disabled = true;
  document.getElementById('pomodoro-estado').textContent = 'Listo para empezar';
  document.getElementById('pomodoro-mensaje').style.display = 'none';
});

// ── MODAL MAPAS MENTALES ──────────────────────
document.getElementById('btn-agregar-rama').addEventListener('click', function() {
  const contenedor = document.getElementById('mapa-ramas');
  const rama = document.createElement('div');
  rama.className = 'mapa-rama';
  rama.innerHTML = '<input type="text" placeholder="Escribí una rama...">' +
    '<button onclick="this.parentElement.remove()">✕</button>';
  contenedor.appendChild(rama);
});

// ── MODAL LECTURA ACTIVA ──────────────────────
let herramientaActiva = 'subrayar';

document.querySelectorAll('.btn-herramienta').forEach(function(btn) {
  if (btn.classList.contains('btn-limpiar')) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.texto-subrayado, .texto-importante, .texto-pregunta').forEach(function(span) {
        const padre = span.parentNode;
        padre.replaceChild(document.createTextNode(span.textContent), span);
        padre.normalize();
      });
    });
    return;
  }
  btn.addEventListener('click', function() {
    document.querySelectorAll('.btn-herramienta:not(.btn-limpiar)').forEach(function(b) { b.classList.remove('activo'); });
    btn.classList.add('activo');
    herramientaActiva = btn.dataset.herramienta;
  });
});

document.getElementById('lectura-texto').addEventListener('mouseup', function() {
  const seleccion = window.getSelection();
  if (!seleccion || seleccion.isCollapsed) return;
  const rango = seleccion.getRangeAt(0);
  const span = document.createElement('span');
  if (herramientaActiva === 'subrayar') span.className = 'texto-subrayado';
  else if (herramientaActiva === 'importante') span.className = 'texto-importante';
  else if (herramientaActiva === 'pregunta') span.className = 'texto-pregunta';
  try {
    rango.surroundContents(span);
    seleccion.removeAllRanges();
  } catch(e) { seleccion.removeAllRanges(); }
});

// ── MODAL RECUERDO ACTIVO ─────────────────────
document.getElementById('btn-comparar').addEventListener('click', function() {
  document.getElementById('recuerdo-panel').style.display = 'block';
  document.getElementById('btn-comparar').style.display = 'none';
});

document.getElementById('btn-resultado').addEventListener('click', function() {
  const seleccion = document.querySelector('input[name="recuerdo"]:checked');
  const resultado = document.getElementById('recuerdo-resultado');
  if (!seleccion) {
    resultado.style.display = 'block';
    resultado.textContent = 'Elegí una opción para ver tu resultado.';
    return;
  }
  const valor = parseInt(seleccion.value);
  resultado.style.display = 'block';
  if (valor === 100) {
    resultado.textContent = '🎉 ¡Excelente! Recordaste todo. ¡Seguí así!';
    resultado.style.background = '#f0fff4';
  } else if (valor === 50) {
    resultado.textContent = '💪 ¡Bien! Recordaste bastante. Repasá lo que te faltó y volvé a intentarlo.';
    resultado.style.background = '#fffbf0';
  } else {
    resultado.textContent = '📖 No te preocupes. Volvé al material, estudialo de nuevo y repetí el ejercicio.';
    resultado.style.background = '#fff0f0';
  }
});
