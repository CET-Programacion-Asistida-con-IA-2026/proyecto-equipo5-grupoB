// =============================================
// Stop the Loop — aprende.js
// =============================================

// 1. Buscamos todos los botones de filtro y todas las tarjetas de artículos
const botonesFiltro = document.querySelectorAll('.filtro-btn');
const tarjetasArticulo = document.querySelectorAll('.articulo-card');

// 2. Escuchamos el click en cada botón de filtro
botonesFiltro.forEach(function(boton) {
  boton.addEventListener('click', function() {

    // 3. Marcamos como "activo" solo el botón que se tocó
    botonesFiltro.forEach(function(btn) {
      btn.classList.remove('activo');
    });
    boton.classList.add('activo');

    // 4. Leemos qué filtro eligió el usuario
    const filtroElegido = boton.dataset.filtro;

    // 5. Mostramos u ocultamos cada tarjeta según su categoría
    tarjetasArticulo.forEach(function(tarjeta) {
      if (filtroElegido === 'todos') {
        // Si eligió "Todos", mostramos todas
        tarjeta.classList.remove('oculto');
      } else if (tarjeta.dataset.categoria === filtroElegido) {
        // Si la categoría de la tarjeta coincide con el filtro, la mostramos
        tarjeta.classList.remove('oculto');
      } else {
        // Si no coincide, la ocultamos
        tarjeta.classList.add('oculto');
      }
    });

  });
});
