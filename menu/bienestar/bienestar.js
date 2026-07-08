// =============================================
// MOOD TRACKER - Stop the Loop
// =============================================

// Moods disponibles
const moods = {
  tranquilo: {
    imagen: "mood-tracker-circulos/tranquilo.jpeg",
    valor: 85,
    consejo: "Hoy te sentís tranquilo/a. Aprovechá este estado para avanzar con una tarea importante, pero sin exigirte de más."
  },
  motivado: {
    imagen: "mood-tracker-circulos/motivado.jpeg",
    valor: 95,
    consejo: "Hoy tenés buena energía. Usala para empezar por eso que venías postergando, aunque sea durante 25 minutos."
  },
  cansado: {
    imagen: "mood-tracker-circulos/cansado.jpeg",
    valor: 55,
    consejo: "Si estás cansado/a, no intentes estudiar todo junto. Probá con una tarea corta, tomá agua y hacé pausas."
  },
  nervioso: {
    imagen: "mood-tracker-circulos/nervioso.jpeg",
    valor: 45,
    consejo: "Si estás nervioso/a, bajá un cambio antes de estudiar. Respirá profundo y elegí un solo tema para empezar."
  },
  saturado: {
    imagen: "mood-tracker-circulos/saturado.jpeg",
    valor: 30,
    consejo: "Si te sentís saturado/a, vaciá tu cabeza en una lista. Después elegí solo una cosa pequeña para resolver."
  }
};

let moodsGuardados = {}

let hoy = new Date();
let diaFormateado = hoy.toISOString().split("T")[0]; 
// esto da algo como "2026-07-07"

let mesActual = hoy.getMonth();
let anioActual = hoy.getFullYear();

let primerDiaDelMes = new Date(anioActual, mesActual, 1).getDay();

let diasEnElMes = new Date(anioActual, mesActual + 1, 0).getDate();

const contenedorCalendario = document.getElementById("calendario-moods");

function dibujarCalendario() {
  contenedorCalendario.innerHTML = ""; // borra lo anterior antes de dibujar de nuevo

  // Casilleros vacíos antes del día 1
  for (let i = 0; i < primerDiaDelMes; i++) {
    const vacio = document.createElement("div");
    contenedorCalendario.appendChild(vacio);
  }

  for (let dia = 1; dia <= diasEnElMes; dia++) {
  const diaDiv = document.createElement("div");
  diaDiv.classList.add("dia-calendario");
  diaDiv.textContent = dia;

  // tu bloque, ahora usando el "dia" del loop
  let diaConCero = String(dia).padStart(2, "0");
  let mesConCero = String(mesActual + 1).padStart(2, "0");
  let fechaDelDia = anioActual + "-" + mesConCero + "-" + diaConCero;

  // acá preguntamos: ¿hay un mood guardado para esta fecha?
  if (moodsGuardados[fechaDelDia]) {
    const moodDelDia = moodsGuardados[fechaDelDia]; // ej: "motivado"
    diaDiv.style.backgroundColor = "lightgreen"; // color de prueba, después lo cambiamos
  }

  contenedorCalendario.appendChild(diaDiv);
}
}

dibujarCalendario();

const botonesMood = document.querySelectorAll(".boton-mood");

botonesMood.forEach(boton => {
  boton.addEventListener("click", () => {
    const mood = boton.dataset.mood; // toma el valor de data-mood="motivado"
    moodsGuardados[diaFormateado] = mood;
    console.log(moodsGuardados); // para que veas qué se guardó
    dibujarCalendario();
  });
});