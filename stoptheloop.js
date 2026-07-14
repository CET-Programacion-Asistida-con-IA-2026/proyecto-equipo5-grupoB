// =============================================
// Stop the Loop — script.js
// =============================================

document.addEventListener('DOMContentLoaded', function () {

/* =========================================
     0. BOTONES "¿QUÉ LOOP QUERÉS ROMPER HOY?"
     ========================================= */
  const opcionesLoop = document.querySelectorAll('.loop-option');
  const mensajeLoop = document.getElementById('loop-message');

  opcionesLoop.forEach(function (boton) {
    boton.addEventListener('click', function () {
      mensajeLoop.textContent = boton.dataset.message;
    });
  });

/* =========================================
     MENÚ HAMBURGUESA (MOBILE)
     ========================================= */
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      const abierto = navLinks.classList.toggle('activo');
      menuToggle.classList.toggle('abierto', abierto);
      menuToggle.setAttribute('aria-expanded', abierto);
    });

    // Cerrar el menú al tocar un link
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('activo');
        menuToggle.classList.remove('abierto');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* =========================================
     1. CARRUSEL DE RESEÑAS
     ========================================= */
  const grilla = document.getElementById('grilla-resenas');
  const flechaIzq = document.getElementById('flecha-izq');
  const flechaDer = document.getElementById('flecha-der');

  function anchoDeScroll() {
    const primeraTarjeta = grilla.querySelector('.tarjeta-resena');
    if (!primeraTarjeta) return 300;
    const gap = parseInt(getComputedStyle(grilla).gap) || 22;
    return primeraTarjeta.offsetWidth + gap;
  }

  if (grilla && flechaIzq && flechaDer) {
    flechaIzq.addEventListener('click', function () {
      grilla.scrollBy({ left: -anchoDeScroll(), behavior: 'smooth' });
    });

    flechaDer.addEventListener('click', function () {
      grilla.scrollBy({ left: anchoDeScroll(), behavior: 'smooth' });
    });
  }

  /* =========================================
     2. MODAL "COMPARTÍ TU EXPERIENCIA"
     ========================================= */
  const btnCompartir = document.getElementById('btn-compartir');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalCerrar = document.getElementById('modal-cerrar');
  const formResena = document.getElementById('form-resena');
  const inputNombre = document.getElementById('input-nombre');
  const inputRol = document.getElementById('input-rol');
  const inputComentario = document.getElementById('input-comentario');
  const inputEstrellas = document.getElementById('input-estrellas');
  const selectorEstrellas = document.getElementById('selector-estrellas');
  const estrellasSpans = selectorEstrellas ? selectorEstrellas.querySelectorAll('span') : [];
  const modalError = document.getElementById('modal-error');

  function abrirModal() {
    modalOverlay.classList.add('activo');
    document.body.style.overflow = 'hidden';
    inputNombre.focus();
  }

  function cerrarModal() {
    modalOverlay.classList.remove('activo');
    document.body.style.overflow = '';
    formResena.reset();
    pintarEstrellas(0);
    inputEstrellas.value = '0';
    modalError.textContent = '';
  }

  function pintarEstrellas(valor) {
    estrellasSpans.forEach(function (span) {
      const esActiva = Number(span.dataset.valor) <= valor;
      span.classList.toggle('activa', esActiva);
    });
  }

  if (btnCompartir) {
    btnCompartir.addEventListener('click', abrirModal);
  }

  if (modalCerrar) {
    modalCerrar.addEventListener('click', cerrarModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (evento) {
      if (evento.target === modalOverlay) {
        cerrarModal();
      }
    });
  }

  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && modalOverlay.classList.contains('activo')) {
      cerrarModal();
    }
  });

  estrellasSpans.forEach(function (span) {
    span.addEventListener('click', function () {
      const valor = Number(span.dataset.valor);
      inputEstrellas.value = valor;
      pintarEstrellas(valor);
    });
  });

  /* =========================================
     3. ENVIAR RESEÑA NUEVA
     ========================================= */
  function crearTarjetaResena(nombre, rol, estrellas, comentario) {
    const article = document.createElement('article');
    article.className = 'tarjeta-resena';

    const avatar = document.createElement('div');
    avatar.className = 'avatar';

    const contenido = document.createElement('div');

    const h3 = document.createElement('h3');
    h3.textContent = nombre;

    const pRol = document.createElement('p');
    pRol.className = 'rol';
    pRol.textContent = rol;

    const pEstrellas = document.createElement('p');
    pEstrellas.className = 'estrellas';
    pEstrellas.textContent = '★'.repeat(estrellas) + '☆'.repeat(5 - estrellas);

    const pComentario = document.createElement('p');
    pComentario.textContent = '"' + comentario + '"';

    contenido.append(h3, pRol, pEstrellas, pComentario);
    article.append(avatar, contenido);

    return article;
  }

  if (formResena) {
    formResena.addEventListener('submit', function (evento) {
      evento.preventDefault();

      const nombre = inputNombre.value.trim();
      const rol = inputRol.value.trim();
      const comentario = inputComentario.value.trim();
      const estrellas = Number(inputEstrellas.value);

      if (estrellas === 0) {
        modalError.textContent = 'Elegí un puntaje de 1 a 5 estrellas. ⭐';
        return;
      }

      if (nombre === '' || rol === '' || comentario === '') {
        modalError.textContent = 'Completá todos los campos antes de enviar.';
        return;
      }

      const nuevaTarjeta = crearTarjetaResena(nombre, rol, estrellas, comentario);
      grilla.prepend(nuevaTarjeta);
      grilla.scrollTo({ left: 0, behavior: 'smooth' });

      cerrarModal();
    });
  }

});