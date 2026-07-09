

let horarioGuardado = JSON.parse( //Guardar el horario en localStorage para que no se pierda al recargar la página
    localStorage.getItem("horario")
) || [];

let fechasGuardadas = JSON.parse( //Guardar las fechas importantes en localStorage para que no se pierdan al recargar la página
    localStorage.getItem("fechas")
) || [];


/* =========================================================
script para generar el horario semanal dinámicamente 
y permitir al usuario agregar actividades a cada celda del horario
========================================================= */
const horario = document.getElementById("horario"); // Obtener el elemento del horario semanal

const dias = [
    "Lun",
    "Mar",
    "Mié",
    "Jue",
    "Vie",
    "Sáb",
    "Dom"
];

const horaInicio = 6; // Hora de inicio del horario (6s AM)
const horaFin = 23; // Hora de fin del horario (11 PM)


function generarHorario() {
    horario.innerHTML = '';
    horario.innerHTML += `<div class="hora"></div>`; // Espacio vacío para la primera celda de la primera fila

    dias.forEach(dia => {
        horario.innerHTML += `
            <div class="dia">${dia}</div>
        `;
    });

    for (let hora = horaInicio; hora <= horaFin; hora++) {
        horario.innerHTML += `
            <div class="hora">${hora}:00</div>
        `;

        dias.forEach(dia => {
            horario.innerHTML += `
                <div
                    class="libre"
                    data-dia="${dia}"
                    data-hora="${hora}">
                </div>
            `;
        });
    }
}

function aplicarHorarioGuardado() {
    horarioGuardado.forEach(item => {
        const celda = document.querySelector(
            `[data-dia="${item.dia}"][data-hora="${item.hora}"]`
        );

        if (!celda) return;

        celda.textContent = item.actividad;
        celda.classList.remove("libre", "clase", "estudio", "descanso");

        if (item.tipo === "1") {
            celda.classList.add("clase");
        } else if (item.tipo === "2") {
            celda.classList.add("estudio");
        } else if (item.tipo === "3") {
            celda.classList.add("descanso");
        }
    });
}

generarHorario();
aplicarHorarioGuardado();



const celdas = document.querySelectorAll(
    ".libre, .clase, .estudio, .descanso"
); // Seleccionar todas las celdas del horario

console.log(celdas.length); // Verificar la cantidad de celdas generadas



let selectedCells = [];

function actualizarInputsDesdeCelda(celda) {
    const guardado = horarioGuardado.find(item =>
        item.dia === celda.dataset.dia &&
        item.hora === celda.dataset.hora
    );

    if (guardado) {
        document.getElementById("actividadInput").value = guardado.actividad;
        document.getElementById("tipoInput").value = guardado.tipo;
    } else {
        document.getElementById("actividadInput").value = "";
        document.getElementById("tipoInput").value = "";
    }
}

function actualizarSeleccion(celda) {
    if (selectedCells.includes(celda)) {
        celda.classList.remove("celda-seleccionada");
        selectedCells = selectedCells.filter(item => item !== celda);
    } else {
        celda.classList.add("celda-seleccionada");
        selectedCells.push(celda);
    }
}

celdas.forEach(celda => {
    celda.addEventListener("click", () => {
        actualizarSeleccion(celda);

        if (selectedCells.length === 1) {
            actualizarInputsDesdeCelda(celda);
        } else {
            document.getElementById("actividadInput").value = "";
            document.getElementById("tipoInput").value = "";
        }
    });
});

const guardarActividad = document.getElementById("guardarActividad");
guardarActividad.addEventListener("click", () => {
    const actividad = document.getElementById("actividadInput").value.trim();
    const tipo = document.getElementById("tipoInput").value;

    if (selectedCells.length === 0) {
        alert("Selecciona al menos una celda del horario primero.");
        return;
    }

    if (!actividad) {
        alert("Ingresa el nombre de la actividad.");
        return;
    }

    if (!tipo) {
        alert("Selecciona el tipo de actividad.");
        return;
    }

    selectedCells.forEach(celda => {
        celda.textContent = actividad;
        celda.classList.remove("libre", "clase", "estudio", "descanso");

        if (tipo === "1") {
            celda.classList.add("clase");
        } else if (tipo === "2") {
            celda.classList.add("estudio");
        } else if (tipo === "3") {
            celda.classList.add("descanso");
        }

        const existe = horarioGuardado.find(item =>
            item.dia === celda.dataset.dia &&
            item.hora === celda.dataset.hora
        );

        if (existe) {
            existe.actividad = actividad;
            existe.tipo = tipo;
        } else {
            horarioGuardado.push({
                dia: celda.dataset.dia,
                hora: celda.dataset.hora,
                actividad,
                tipo
            });
        }
    });

    localStorage.setItem("horario", JSON.stringify(horarioGuardado));
    alert("Actividad guardada en las celdas seleccionadas.");
});

const eliminarActividad = document.getElementById("eliminarActividad");
eliminarActividad.addEventListener("click", () => {
    if (selectedCells.length === 0) {
        alert("Selecciona al menos una celda del horario primero.");
        return;
    }

    selectedCells.forEach(celda => {
        const indice = horarioGuardado.findIndex(item =>
            item.dia === celda.dataset.dia &&
            item.hora === celda.dataset.hora
        );

        if (indice !== -1) {
            horarioGuardado.splice(indice, 1);
        }

        celda.textContent = "";
        celda.classList.remove("clase", "estudio", "descanso");
        celda.classList.add("libre");
        celda.classList.remove("celda-seleccionada");
    });

    selectedCells = [];
    localStorage.setItem("horario", JSON.stringify(horarioGuardado));
    document.getElementById("actividadInput").value = "";
    document.getElementById("tipoInput").value = "";
    alert("Actividad eliminada de las celdas seleccionadas.");
});

/*=========================================================
script para agregar fechas importantes al calendario mensual
y guardarlas en localStorage
===========================================================*/
const fechaInput = document.getElementById("fechaInput");
const eventoInput = document.getElementById("eventoInput");
const agregarFecha = document.getElementById("agregarFecha");
const listaFechas = document.getElementById("listaFechas");
const btnMesAnterior = document.getElementById("mesAnterior");
const btnMesSiguiente = document.getElementById("mesSiguiente");

// Obtener el contenedor del calendario mensual y el título del mes
const calendarioGrid = document.getElementById("calendarioGrid");
const tituloMes = document.getElementById("tituloMes");

// Obtener el input de categoría
const categoriaInput = document.getElementById("categoriaInput");

let fechaActual = new Date();
let fechaSeleccionada = null;


function mostrarFechas(fecha = null) {
    listaFechas.innerHTML = "";

    const fechaFiltro = fecha || fechaSeleccionada;

    const fechasAMostrar = fechaFiltro
        ? fechasGuardadas.map((item, index) => ({...item, index})).filter(item => item.fecha === fechaFiltro)
        : fechasGuardadas.map((item, index) => ({...item, index})).filter(item => {
            const itemFecha = new Date(item.fecha);
            return itemFecha.getFullYear() === fechaActual.getFullYear() &&
                itemFecha.getMonth() === fechaActual.getMonth();
        });

    if (fechasAMostrar.length === 0) {
        listaFechas.innerHTML = `
            <div class="evento-fecha">
                No hay fechas guardadas ${fechaFiltro ? "para ese día." : "para este mes."}
            </div>
        `;
        return;
    }

    fechasAMostrar.sort((a, b) => a.fecha.localeCompare(b.fecha));

    fechasAMostrar.forEach(item => {
        listaFechas.innerHTML += `
            <div class="evento-fecha">
                <strong>${item.fecha}</strong>
                <span class="categoria">${item.categoria}</span>
                <br>
                ${item.evento}
                <button class="eliminar-fecha" data-index="${item.index}" type="button">Eliminar</button>
            </div>
        `;
    });
}

btnMesAnterior.addEventListener("click", () => {
    fechaActual.setMonth(fechaActual.getMonth() - 1);
    fechaSeleccionada = null;
    renderizarCalendario();
    mostrarFechas();
});

btnMesSiguiente.addEventListener("click", () => {
    fechaActual.setMonth(fechaActual.getMonth() + 1);
    fechaSeleccionada = null;
    renderizarCalendario();
    mostrarFechas();
});

calendarioGrid.addEventListener("click", event => {
    const diaCelda = event.target.closest(".dia-calendario");
    if (!diaCelda) return;

    const fecha = diaCelda.dataset.fecha;
    if (!fecha) return;

    fechaSeleccionada = fecha;
    actualizarSeleccionMes();
    mostrarFechas(fecha);
});

agregarFecha.addEventListener("click", () => {
    const fecha = fechaInput.value;
    const evento = eventoInput.value;
    const categoria = categoriaInput.value; // Obtener la categoría seleccionada    

    if (!fecha || !evento) {
        alert("Completa fecha y descripción");
        return;
    }

    fechasGuardadas.push({
        fecha,
        evento,
        categoria // Guardar la categoría seleccionada
    });

    localStorage.setItem(
        "fechas",
        JSON.stringify(fechasGuardadas)
    );

    fechaSeleccionada = fecha;
    renderizarCalendario();
    actualizarSeleccionMes();
    mostrarFechas(fecha);

    eventoInput.value = "";
    categoriaInput.value = "";
});

listaFechas.addEventListener("click", event => {
    const eliminarBtn = event.target.closest(".eliminar-fecha");
    if (!eliminarBtn) return;

    const index = Number(eliminarBtn.dataset.index);
    if (Number.isNaN(index)) return;

    fechasGuardadas.splice(index, 1);
    localStorage.setItem("fechas", JSON.stringify(fechasGuardadas));
    renderizarCalendario();
    mostrarFechas();
});

mostrarFechas();

// Renderizar el calendario mensual
function renderizarCalendario() {
    

    calendarioGrid.innerHTML = "";

    const nombresDias = [
        "Lun",
        "Mar",
        "Mié",
        "Jue",
        "Vie",
        "Sáb",
        "Dom"
    ];

    nombresDias.forEach(dia => {

        calendarioGrid.innerHTML += `
            <div class="encabezado-dia">
                ${dia}
            </div>
        `;

    }); 

    const meses = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
    ];

    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();

    tituloMes.textContent =
        `${meses[mes]} ${año}`;

    const diasMes =
        new Date(año, mes + 1, 0).getDate();

    const primerDiaMes =
        new Date(año, mes, 1).getDay();

    console.log(primerDiaMes);

    let desplazamiento = primerDiaMes - 1;

    if (desplazamiento < 0) {
        desplazamiento = 6;
    }

    for(let i = 0; i < desplazamiento; i++){

        calendarioGrid.innerHTML += `
            <div class="dia-vacio"></div>
        `;

    }

    const fechaHoy = new Date();
    const fechaHoyStr = `${fechaHoy.getFullYear()}-${String(fechaHoy.getMonth() + 1).padStart(2, "0")}-${String(fechaHoy.getDate()).padStart(2, "0")}`;

    for(let dia = 1; dia <= diasMes; dia++){
        const fechaCompleta =
            `${año}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

        //const tieneEvento = fechasGuardadas.some(item => item.fecha === fechaCompleta);

        const eventosDelDia = fechasGuardadas.filter(item => item.fecha === fechaCompleta);
    
        const tieneEvento = eventosDelDia.length > 0;
   
        const nombreEvento = eventosDelDia.map(item => item.evento).join(", ");

        const esHoy = fechaCompleta === fechaHoyStr;

        const seleccionado = fechaCompleta === fechaSeleccionada;

        calendarioGrid.innerHTML += `
          
            <div class="dia-calendario" data-fecha="${fechaCompleta}"  title="${nombreEvento}">
                ${dia}
                ${
                    eventosDelDia.length > 0
                    ? `<div class="contenedor-puntos">
                            ${
                                eventosDelDia
                                    .map(item =>
                                        `<div class="punto-evento ${item.categoria}"></div>`
                                    )
                                    .join("")
                            }
                        </div>`
                    : ""
                }
            </div>
        `;
        
    }
}

function actualizarSeleccionMes() {
    document.querySelectorAll('.dia-calendario').forEach(celda => {
        if (celda.dataset.fecha === fechaSeleccionada) {
            celda.dataset.seleccionado = 'true';
        } else {
            celda.dataset.seleccionado = 'false';
        }
    });
}

renderizarCalendario();

/* =================================================================================
  PLANIFICADOR DE TAREAS
script para agregar tareas a la lista de tareas y guardarlas en localStorage
=================================================================================== */


// Obtener las tareas guardadas en localStorage o inicializar un array vacío
let tareas = JSON.parse(localStorage.getItem("tareas")) || [];


const tituloTarea = document.getElementById("tituloTarea");

const prioridadTarea = document.getElementById("prioridadTarea");

const fechaTarea = document.getElementById("fechaTarea");

const agregarTarea = document.getElementById("agregarTarea");

const listaTareas = document.getElementById("listaTareas");


function renderizarTareas() {

    listaTareas.innerHTML = "";

    tareas.forEach((tarea, index) => {

        listaTareas.innerHTML += `
            <div class="tarea">

                <div>
                    <strong>${tarea.titulo}</strong>
                </div>

                <div>
                    <span class="prioridad ${tarea.prioridad}">
                       ${tarea.prioridad}
                    </span>
                </div>

                <div>
                    Fecha límite: ${tarea.fecha || "Sin fecha"}
                </div>

                <button
                    class="eliminar-tarea"
                    data-index="${index}">
                    Eliminar
                </button>

            </div>
        `;

    });

}

renderizarTareas();

listaTareas.addEventListener("click", event => {

    const boton =
        event.target.closest(".eliminar-tarea");

    if (!boton) return;

    const index =
        Number(boton.dataset.index);

    tareas.splice(index, 1);

    localStorage.setItem(
        "tareas",
        JSON.stringify(tareas)
    );

    renderizarTareas();

});



// Agregar tarea al hacer clic en el botón "Agregar"
agregarTarea.addEventListener("click", () => {

    const titulo = tituloTarea.value.trim();
    const prioridad = prioridadTarea.value;
    const fecha = fechaTarea.value;

    if (!titulo) {
        alert("Ingresa una tarea.");
        return;
    }

    tareas.push({
        titulo,
        prioridad,
        fecha,
        completada: false
    });

    localStorage.setItem(
        "tareas",
        JSON.stringify(tareas)
    );

    renderizarTareas();

    tituloTarea.value = "";
    fechaTarea.value = "";

});

