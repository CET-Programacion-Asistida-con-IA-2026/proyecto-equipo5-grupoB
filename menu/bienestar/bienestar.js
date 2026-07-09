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

// RESPIRACIÓN
const btnCalmarme = document.getElementById("btn-calmarme"); 
const overlayRespiracion = document.getElementById("overlay-respiracion"); 
const circuloRespiracionGrande = document.getElementById("circulo-respiracion-grande"); 

btnCalmarme.addEventListener("click", function() {  
  overlayRespiracion.style.display = "flex";
  overlayRespiracion.style.opacity = "1";
  circuloRespiracionGrande.classList.add("respirando"); 
  cicloDeTexto();
  intervaloRespiracion = setInterval(cicloDeTexto, 15000);
});

const btnCerrarOverlay = document.getElementById("btn-cerrar-overlay");
const textoRespiracionGrande = document.getElementById("texto-respiracion-grande");

btnCerrarOverlay.addEventListener("click", function() {  
  cerrarOverlay();
});

function cicloDeTexto() {
  textoRespiracionGrande.textContent = "Inhalá";

  setTimeout(() => {
    textoRespiracionGrande.textContent = "Sostené";
  }, 5000);

  setTimeout(() => {
    textoRespiracionGrande.textContent = "Exhalá";
  }, 10000);
}

let contadorCiclos = 0;
let intervaloRespiracion;

function cicloDeTexto() {
  contadorCiclos++;

  textoRespiracionGrande.textContent = "Inhalá";

  setTimeout(() => {
    textoRespiracionGrande.textContent = "Sostené";
  }, 5000);

  setTimeout(() => {
    textoRespiracionGrande.textContent = "Exhalá";
  }, 10000);

  if (contadorCiclos >= 4) {
  clearInterval(intervaloRespiracion);
  cerrarOverlay();
  contadorCiclos = 0;
  }
}

function cerrarOverlay() {
  overlayRespiracion.style.opacity = "0";

  overlayRespiracion.addEventListener("transitionend", function () {
    overlayRespiracion.style.display = "none";
    circuloRespiracionGrande.classList.remove("respirando");
  }, { once: true });
}

// HABIT TRACKER
const selectAmbito = document.getElementById("select-ambito");
const inputNuevoHabito = document.getElementById("input-nuevo-habito");
const btnAgregarHabito = document.getElementById("btn-agregar-habito");

let habitos = JSON.parse(localStorage.getItem("habitos")) || {
  salud: [],
  ocio: [],
  educacion: []
};

let habitosMarcadosHoy = JSON.parse(localStorage.getItem("habitosMarcadosHoy_" + obtenerFechaHoy())) || {};

btnAgregarHabito.addEventListener("click", function() {
  const ambitoElegido = selectAmbito.value;
  const nuevoHabito = inputNuevoHabito.value;
  if (nuevoHabito.trim() === "") {
    return;
  }
  habitos[ambitoElegido].push(nuevoHabito);
  inputNuevoHabito.value = "";
  guardarHabitosEnStorage();
  dibujarHabitos();
});

const contenedorHabitos = document.getElementById("lista-habitos-por-ambito");
const contadorHabitos = document.getElementById("contador-habitos");
const barraCompletada = document.getElementById("barra-completada");

const nombresAmbitos = {
  salud: "Salud",
  ocio: "Ocio",
  educacion: "Educación"
};

// Guardamos qué hábitos se marcaron HOY (clave: "ambito-indice", valor: true/false)
const btnBorrarHabitos = document.getElementById("btn-borrar-habitos");
let habitosParaBorrar = [];

function dibujarHabitos() {
  contenedorHabitos.innerHTML = "";
  habitosParaBorrar = [];

  let totalHabitos = 0;
  let totalMarcados = 0;

  for (const ambito in habitos) {
    if (habitos[ambito].length === 0) continue;

    const tituloAmbito = document.createElement("h3");
    tituloAmbito.textContent = nombresAmbitos[ambito];
    tituloAmbito.classList.add("titulo-ambito");
    contenedorHabitos.appendChild(tituloAmbito);

    habitos[ambito].forEach(function(nombreHabito, indice) {
      totalHabitos++;

      const claveHabito = ambito + "-" + indice;
      const estaMarcado = habitosMarcadosHoy[claveHabito] === true;
      if (estaMarcado) totalMarcados++;

      const fila = document.createElement("div");
      fila.classList.add("fila-habito");

      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("check-habito");
      checkbox.checked = estaMarcado;
      checkbox.addEventListener("change", function() {
        habitosMarcadosHoy[claveHabito] = checkbox.checked;
        guardarHabitosEnStorage();
        dibujarHabitos();
      });

      label.appendChild(checkbox);
      label.append(" " + nombreHabito);

      const btnBorrarEste = document.createElement("button");
      btnBorrarEste.classList.add("btn-borrar-item");
      btnBorrarEste.textContent = "✕";
      btnBorrarEste.type = "button"; // para que no envíe ningún formulario sin querer

      btnBorrarEste.addEventListener("click", function() {
        fila.classList.toggle("seleccionado-borrar");

        const yaEstaEnLaLista = habitosParaBorrar.some(function(item) {
          return item.ambito === ambito && item.indice === indice;
        });

        if (yaEstaEnLaLista) {
          habitosParaBorrar = habitosParaBorrar.filter(function(item) {
            return !(item.ambito === ambito && item.indice === indice);
          });
        } else {
          habitosParaBorrar.push({ ambito: ambito, indice: indice });
        }
      });

      fila.appendChild(label);
      fila.appendChild(btnBorrarEste);
      contenedorHabitos.appendChild(fila);
    });
  }

  contadorHabitos.textContent = `Progreso: ${totalMarcados}/${totalHabitos} hábitos`;
  const porcentaje = totalHabitos === 0 ? 0 : Math.round((totalMarcados / totalHabitos) * 100);
  barraCompletada.style.width = porcentaje + "%";
}

btnBorrarHabitos.addEventListener("click", function() {
  for (const ambito in habitos) {
    const indicesABorrar = habitosParaBorrar
      .filter(item => item.ambito === ambito)
      .map(item => item.indice);

    habitos[ambito] = habitos[ambito].filter(function(habito, indice) {
      return !indicesABorrar.includes(indice);
    });
  }

  habitosMarcadosHoy = {};
  guardarHabitosEnStorage();
  dibujarHabitos();
});

function guardarHabitosEnStorage() {
  localStorage.setItem("habitos", JSON.stringify(habitos));
  localStorage.setItem("habitosMarcadosHoy_" + obtenerFechaHoy(), JSON.stringify(habitosMarcadosHoy));
}

function obtenerFechaHoy() {
  const hoy = new Date();
  return hoy.toISOString().split("T")[0];
}

dibujarHabitos();