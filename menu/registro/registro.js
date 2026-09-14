// Elementos del DOM de la sección Registro/Cuenta
const bloqueRegistro = document.getElementById('bloque-registro');
const bloqueMiCuenta = document.getElementById('bloque-mi-cuenta');
const registroForm = document.getElementById('registro-form');
const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');

// Elementos del navbar mobile
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

// Elemento de la barra de navegación
const btnNavRegistro = document.getElementById('btn-nav-registro');

function actualizarTextoBotonRegistro(estado) {
  if (!btnNavRegistro) return;

  const textoDefault = btnNavRegistro.dataset.defaultText || 'Registrate';
  const textoCuenta = btnNavRegistro.dataset.accountText || 'Mi Cuenta';

  if (estado === 'logueado') {
    btnNavRegistro.textContent = textoCuenta;
    btnNavRegistro.setAttribute('aria-label', 'Ir a mi cuenta');
    btnNavRegistro.setAttribute('href', '../registro/registro.html#mi-cuenta');
  } else {
    btnNavRegistro.textContent = textoDefault;
    btnNavRegistro.setAttribute('aria-label', 'Registrate');
    btnNavRegistro.setAttribute('href', '../registro/registro.html');
  }
}

/**
 * Función Principal: Revisa el LocalStorage y actualiza la interfaz completa
 */
function actualizarInterfazUsuario() {
  const datosPerfil = localStorage.getItem('perfilEstudiante');

  if (datosPerfil) {
    const perfil = JSON.parse(datosPerfil);

    // 1. Rellenar los campos de la vista "Mi Cuenta"
    document.getElementById('perfil-nombre-vista').textContent = perfil.nombre;
    document.getElementById('perfil-nivel-vista').textContent = perfil.nivel.toUpperCase();
    document.getElementById('perfil-orientacion-vista').textContent = perfil.orientacion.toUpperCase();

    // 2. Intercambiar los bloques visuales
    if (bloqueRegistro) bloqueRegistro.style.display = 'none';
    if (bloqueMiCuenta) bloqueMiCuenta.style.display = 'block';

    // 3. Actualizar el botón del navbar
    actualizarTextoBotonRegistro('logueado');
  } else {
    // Si no hay sesión iniciada, volvemos al estado inicial
    if (bloqueRegistro) bloqueRegistro.style.display = 'block';
    if (bloqueMiCuenta) bloqueMiCuenta.style.display = 'none';

    actualizarTextoBotonRegistro('guest');
  }
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', function () {
    const abierto = navLinks.classList.toggle('activo');
    menuToggle.classList.toggle('abierto', abierto);
    menuToggle.setAttribute('aria-expanded', abierto);
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('activo');
      menuToggle.classList.remove('abierto');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Evento: Escuchar el envío del formulario de registro
if (registroForm) {
  registroForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Capturamos los datos elegidos por el usuario
    const nuevoUsuario = {
      nombre: document.getElementById('reg-nombre').value,
      nivel: document.getElementById('reg-nivel').value,
      orientacion: document.getElementById('reg-orientacion').value
    };

    // Guardamos en LocalStorage convirtiendo el objeto a string
    localStorage.setItem('perfilEstudiante', JSON.stringify(nuevoUsuario));

    // Refrescamos la pantalla inmediatamente
    actualizarInterfazUsuario();
  });
}

// Evento: Escuchar el clic en Cerrar Sesión
if (btnCerrarSesion) {
  btnCerrarSesion.addEventListener('click', () => {
    // Eliminamos los datos guardados
    localStorage.removeItem('perfilEstudiante');

    // Si tenías campos llenos en el formulario, los limpiamos
    if (registroForm) registroForm.reset();

    // Refrescamos la interfaz
    actualizarInterfazUsuario();
  });
}

// Al cargar la página, se ejecuta automáticamente para verificar si ya estaba logueado
document.addEventListener('DOMContentLoaded', actualizarInterfazUsuario);
