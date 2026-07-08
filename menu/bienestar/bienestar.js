// =============================================
// MOOD TRACKER - Stop the Loop
// =============================================

// 1. Moods disponibles
const moods = {
  tranquilo: {
    imagen: "tranquilo.svg",
    valor: 85,
    consejo: "Hoy te sentís tranquilo/a. Aprovechá este estado para avanzar con una tarea importante, pero sin exigirte de más."
  },
  motivado: {
    imagen: "motivado.svg",
    valor: 95,
    consejo: "Hoy tenés buena energía. Usala para empezar por eso que venías postergando, aunque sea durante 25 minutos."
  },
  cansado: {
    imagen: "cansado.svg",
    valor: 55,
    consejo: "Si estás cansado/a, no intentes estudiar todo junto. Probá con una tarea corta, tomá agua y hacé pausas."
  },
  nervioso: {
    imagen: "nervioso.svg",
    valor: 45,
    consejo: "Si estás nervioso/a, bajá un cambio antes de estudiar. Respirá profundo y elegí un solo tema para empezar."
  },
  saturado: {
    imagen: "saturado.svg",
    valor: 30,
    consejo: "Si te sentís saturado/a, vaciá tu cabeza en una lista. Después elegí solo una cosa pequeña para resolver."
  }
};

// 2. Elementos del HTML
const botonesMood = document.querySelectorAll(".boton-mood");
const calendarioMoods = document.getElementById("calendario-moods");
const tituloCalendario = document.getElementById("titulo-calendario");
const consejoMood = document.getElementById("consejo-mood");
const porcentajeBienestar = document.getElementById("porcentaje-bienestar");
const mensajeScore = document.getElementById("mensaje-puntaje");
const botonMesAnterior = document.getElementById("mes-anterior");
const botonMesSiguiente = document.getElementById("mes-siguiente");

// 3. Fecha actual
const fechaActual = new Date();
let mesMostrado = fechaActual.getMonth();
let anioMostrado = fechaActual.getFullYear();

// 4. Recuperamos moods guardados
let registrosMood = JSON.parse(localStorage.getItem("registrosMood")) || {};

// 5. Formatear fecha como YYYY-MM-DD
function obtenerClaveFecha(anio, mes, dia) {
  const mesTexto = String(mes + 1).padStart(2, "0");
  const diaTexto = String(dia).padStart(2, "0");
  return `${anio}-${mesTexto}-${diaTexto}`;
}

// 6. Guardar mood del día actual
function guardarMood(moodElegido) {
  const claveHoy = obtenerClaveFecha(
    fechaActual.getFullYear(),
    fechaActual.getMonth(),
    fechaActual.getDate()
  );

  registrosMood[claveHoy] = moodElegido;
  localStorage.setItem("registrosMood", JSON.stringify(registrosMood));

  consejoMood.textContent = moods[moodElegido].consejo;

  botonesMood.forEach(function(boton) {
    boton.classList.remove("activo");
  });

  const botonActivo = document.querySelector(`[data-mood="${moodElegido}"]`);
  botonActivo.classList.add("activo");

  crearCalendario();
  calcularBienestar();
}

// 7. Crear calendario
function crearCalendario() {
  calendarioMoods.innerHTML = "";

  const nombresMeses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  tituloCalendario.textContent = `${nombresMeses[mesMostrado]} ${anioMostrado}`;

  const primerDiaDelMes = new Date(anioMostrado, mesMostrado, 1).getDay();
  const cantidadDias = new Date(anioMostrado, mesMostrado + 1, 0).getDate();

  // Espacios vacíos antes del primer día
  for (let i = 0; i < primerDiaDelMes; i++) {
    const diaVacio = document.createElement("div");
    diaVacio.classList.add("dia-calendario", "vacio");
    calendarioMoods.appendChild(diaVacio);
  }

  // Días del mes
  for (let dia = 1; dia <= cantidadDias; dia++) {
    const claveFecha = obtenerClaveFecha(anioMostrado, mesMostrado, dia);
    const moodDelDia = registrosMood[claveFecha];

    const celdaDia = document.createElement("div");
    celdaDia.classList.add("dia-calendario");

    const numeroDia = document.createElement("span");
    numeroDia.classList.add("numero-dia");
    numeroDia.textContent = dia;

    celdaDia.appendChild(numeroDia);

    const esHoy =
      dia === fechaActual.getDate() &&
      mesMostrado === fechaActual.getMonth() &&
      anioMostrado === fechaActual.getFullYear();

    if (esHoy) {
      celdaDia.classList.add("hoy");
    }

    if (moodDelDia) {
      const imagenMood = document.createElement("img");
      imagenMood.src = moods[moodDelDia].imagen;
      imagenMood.classList.add("icono-mood-calendario");
  
      celdaDia.appendChild(imagenMood);
    }
    calendarioMoods.appendChild(celdaDia);
  }
}

// 8. Calcular porcentaje de bienestar
function calcularBienestar() {
  const hoy = new Date(
    fechaActual.getFullYear(),
    fechaActual.getMonth(),
    fechaActual.getDate()
  );

  let suma = 0;
  let cantidad = 0;

  for (const fecha in registrosMood) {
    const partesFecha = fecha.split("-");
    const fechaRegistro = new Date(
      Number(partesFecha[0]),
      Number(partesFecha[1]) - 1,
      Number(partesFecha[2])
    );

    // Solo cuenta moods hasta el día de hoy
    if (fechaRegistro <= hoy) {
      const mood = registrosMood[fecha];

      if (moods[mood]) {
        suma += moods[mood].valor;
        cantidad++;
      }
    }
  }

  if (cantidad === 0) {
    porcentajeBienestar.textContent = "0%";
    mensajeScore.textContent = "Todavía no hay registros. Elegí cómo te sentís hoy para empezar.";
    return;
  }

  const promedio = Math.round(suma / cantidad);
  porcentajeBienestar.textContent = `${promedio}%`;

  if (promedio >= 80) {
    mensajeScore.textContent = "Tu registro viene muy bien. Seguí cuidando tus descansos y tus hábitos.";
  } else if (promedio >= 60) {
    mensajeScore.textContent = "Tu bienestar viene bastante estable. Revisá qué días te costaron más y qué necesitabas.";
  } else if (promedio >= 40) {
    mensajeScore.textContent = "Parece que venís con bastante carga. Probá sumar pausas, descanso y objetivos más chicos.";
  } else {
    mensajeScore.textContent = "Tus registros muestran varios días difíciles. Bajá la exigencia y buscá apoyo si lo necesitás.";
  }
}

// 9. Botones de mood
botonesMood.forEach(function(boton) {
  boton.addEventListener("click", function() {
    const moodElegido = boton.dataset.mood;
    guardarMood(moodElegido);
  });
});

// 10. Cambiar de mes
botonMesAnterior.addEventListener("click", function() {
  mesMostrado--;

  if (mesMostrado < 0) {
    mesMostrado = 11;
    anioMostrado--;
  }

  crearCalendario();
});

botonMesSiguiente.addEventListener("click", function() {
  mesMostrado++;

  if (mesMostrado > 11) {
    mesMostrado = 0;
    anioMostrado++;
  }

  crearCalendario();
});

// 11. Iniciar calendario y score al cargar
crearCalendario();
calcularBienestar();