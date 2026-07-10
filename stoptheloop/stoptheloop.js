// =============================================
// Stop the Loop — script.js
// =============================================

// 1. Buscamos los elementos en el HTML por su id
const boton = document.getElementById('btn-guardar');
const textarea = document.getElementById('entrada-diario');
const mensaje = document.getElementById('mensaje-guardado');

/*
// 2. Cuando la página carga, revisamos si hay algo guardado
//    Si hay texto guardado, lo mostramos en el textarea
const textoGuardado = localStorage.getItem('diario');
if (textoGuardado) {
  textarea.value = textoGuardado;
}

// 3. Escuchamos el click en el botón
boton.addEventListener('click', function() {

  // 4. Leemos lo que escribió el usuario
  const textoActual = textarea.value;

  // 5. Si el textarea está vacío, avisamos y no hacemos nada más
  if (textoActual.trim() === '') {
    mensaje.textContent = 'Escribí algo antes de guardar. ✏️';
    mensaje.style.color = '#E7A8F8';
    return;
  }

  // 6. Guardamos el texto en el navegador
  localStorage.setItem('diario', textoActual);

  // 7. Mostramos el mensaje de confirmación
  mensaje.textContent = '¡Guardado! 🌟';
  mensaje.style.color = '#545654';

  // 8. El mensaje desaparece solo después de 3 segundos
  setTimeout(function() {
    mensaje.textContent = '';
  }, 3000);

});
*/
