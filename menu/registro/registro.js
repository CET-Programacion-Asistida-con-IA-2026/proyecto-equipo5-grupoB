// Elementos del DOM de la sección Registro/Cuenta
const bloqueRegistro = document.getElementById('bloque-registro');
const bloqueMiCuenta = document.getElementById('bloque-mi-cuenta');
const registroForm = document.getElementById('registro-form');
const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');

// Elemento de la barra de navegación (Ajustá el ID según tu HTML real)
const btnNavRegistro = document.getElementById('btn-nav-registro') || document.querySelector('nav a[href*="registrate"]') || document.querySelector('.btn-registrate');

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
    if(bloqueRegistro) bloqueRegistro.style.display = 'none';
    if(bloqueMiCuenta) bloqueMiCuenta.style.display = 'block';

    // 3. Modificar mágicamente el botón de la barra de navegación
    if (btnNavRegistro) {
      btnNavRegistro.textContent = `👤 Mi Cuenta (${perfil.nombre})`;
    }
  } else {
    // Si no hay sesión iniciada, volvemos al estado inicial
    if(bloqueRegistro) bloqueRegistro.style.display = 'block';
    if(bloqueMiCuenta) bloqueMiCuenta.style.display = 'none';

    if (btnNavRegistro) {
      btnNavRegistro.textContent = 'Registrate';
    }
  }
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
    if(registroForm) registroForm.reset();
    
    // Refrescamos la interfaz
    actualizarInterfazUsuario();
  });
}

// Al cargar la página, se ejecuta automáticamente para verificar si ya estaba logueado
document.addEventListener('DOMContentLoaded', actualizarInterfazUsuario);
