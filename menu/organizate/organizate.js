/*=========================================================
BLOQUE 1: CONFIGURACIÓN
=========================================================*/


/*============ 1 TODOS LOS DATOS GUARDADOS=================*/
let horarioGuardado = JSON.parse( //Guardar el horario en localStorage para que no se pierda al recargar la página
    localStorage.getItem("horario")
) || [];

let fechasGuardadas = JSON.parse( //Guardar las fechas importantes en localStorage para que no se pierdan al recargar la página
    localStorage.getItem("fechas")
) || [];
// Obtener las tareas guardadas en localStorage o inicializar un array vacío
let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

/*---------------------------------------------------------
Estado temporal del formulario abierto.
Permite cambiar entre formularios sin perder la información
que el usuario ya escribió.
---------------------------------------------------------*/

let estadoFormulario = {

    tipo: null,

    fecha: null,

    materiaId: null,

    titulo: "",

    tipoEvaluación: "Parcial"

};






/*============ 2 TODAS LAS REFERRENCIAS AL DOM =================*/

/*----------horario-------------------*/ //Obtener el input de (...)
const horario = document.getElementById("horario"); // Obtener el elemento del horario semanal
const guardarActividad = document.getElementById("guardarActividad");
const eliminarActividad = document.getElementById("eliminarActividad");
const actividadInput = document.getElementById("actividadInput");

const tipoInput = document.getElementById("tipoInput");

const modalOrganizador = document.getElementById("modalOrganizador");

const contenidoModal = document.getElementById("contenidoModal");

const cerrarModal = document.getElementById("cerrarModal");


/*----------calendario-------------------*/ //Obtener el input de (...)

const listaFechas = document.getElementById("listaFechas");
const btnMesAnterior = document.getElementById("mesAnterior");
const btnMesSiguiente = document.getElementById("mesSiguiente");

// Obtener el contenedor del calendario mensual y el título del mes
const calendarioGrid = document.getElementById("calendarioGrid");
const tituloMes = document.getElementById("tituloMes");

/*----------planificador-------------------*/ //Obtener el input de (...)
const tituloTarea = document.getElementById("tituloTarea");
const prioridadTarea = document.getElementById("prioridadTarea");
const fechaTarea = document.getElementById("fechaTarea");
const agregarTarea = document.getElementById("agregarTarea");
const listaTareas = document.getElementById("listaTareas");

/*----------dashboard-------------------*/ //Obtener el input de (...)
const menuItems = document.querySelectorAll(".menu-item");
const tarjetasCreacion = document.querySelectorAll(".tipo-card");


/*============ 3 CONSTANTES =================*/
//horario
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

/*============ 4 ESTADOS =================*/
let selectedCells = [];
let fechaActual = new Date();
let fechaSeleccionada = null;



/*============??=================*/
/*============??=================*/




/*=========================================================
BLOQUE 2: MOTOR DE ORGANIZACIÓN //Toda la información importante de la aplicación terminará viviendo aquí.
=========================================================*/

let organizacion = JSON.parse(localStorage.getItem("organizacion")) || {

    materias: [],
    objetivos: [],
    actividades: [],
    pasos: []

};

function guardarOrganizacion(){ 

    localStorage.setItem(

        "organizacion",

        JSON.stringify(organizacion)

    );

}

/*=========================================================
BLOQUE 3: API INTERNA
=========================================================*/

/*------------- GESTOR DE MATERIAS-----------*/

//función que normaliza inputs
function normalizarTexto(texto){

    return texto
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}

function formatearNombreMateria(nombre) {

    return nombre
        .trim()
        .split(" ")
        .filter(palabra => palabra !== "")
        .map(palabra =>
            palabra.charAt(0).toUpperCase() +
            palabra.slice(1).toLowerCase()
        )
        .join(" ");

}


function crearMateria(nombre) {

    const materia = {

        id: crypto.randomUUID(),
        nombre: formatearNombreMateria(nombre),
        clave: normalizarTexto(nombre),
        estado: "activo",

    };

    organizacion.materias.push(materia);

    guardarOrganizacion();

    return materia;

}

function obtenerMateria(nombre){

    return organizacion.materias.find(

        materia =>

            materia.clave === normalizarTexto(nombre)

    );

}

function obtenerOCrearMateria(nombre){

    let materia = obtenerMateria(nombre);

    if(!materia){

        materia = crearMateria(nombre);

    }

    return materia;

}

function cargarMateriasEnFormulario() {

    const select = document.getElementById("materiaFormulario");

    if (!select) return;

    select.innerHTML = `
        <option value="">
            Seleccioná una materia
        </option>
    `;

    organizacion.materias.forEach(materia => {

        select.innerHTML += `
            <option value="${materia.id}">
                ${materia.nombre}
            </option>
        `;

    });

    select.innerHTML += `
        <option value="nueva">
            ➕ Agregar nueva materia...
        </option>
    `;

}







/*--------REGISTRO DE ACTIVIDADES---------*/
function registrarActividad(datos){

    const materia = obtenerOCrearMateria(datos.materia);

    const actividad = {

        id: crypto.randomUUID(),

        materiaId: materia.id,

        titulo: datos.titulo,

        tipo: datos.tipo || "evento",

        categoria: datos.categoria || null,

        fecha: datos.fecha || null,

        estado: "pendiente",

        origen: datos.origen || "manual",

        objetivoId: null

    };

    organizacion.actividades.push(actividad);

    if(
        datos.tipo === "examen" ||
        datos.tipo === "final" ||
        datos.tipo === "entrega" ||
        datos.tipo === "proyecto"
    ){

        obtenerOCrearObjetivo({

            materiaId: materia.id,

            titulo: datos.titulo

        });

    }

    guardarOrganizacion();

    return actividad;
}

function obtenerActividades() {

    return organizacion.actividades;

}

/*--------GESTOR DE OBJETIVOS---------*/

function crearObjetivo(datos){

    const objetivo = {

        id: crypto.randomUUID(),

        materiaId: datos.materiaId,

        titulo: datos.titulo,

        estado: "activo",

        progreso: 0,

        pasos: [],

        fechaCreacion: new Date().toISOString()

    };

    organizacion.objetivos.push(objetivo);

    guardarOrganizacion();

    return objetivo;

}

function obtenerObjetivoPorTitulo(titulo){

    return organizacion.objetivos.find(

        objetivo =>

            normalizarTexto(objetivo.titulo) ===
            normalizarTexto(titulo)

    );

}

function obtenerOCrearObjetivo(datos){

    let objetivo = obtenerObjetivoPorTitulo(datos.titulo);

    if(!objetivo){

        objetivo = crearObjetivo(datos);

    }

    return objetivo;

}


/*=========================================================
BLOQUE 4: TODAS LAS FUNCIONES QUE RENDERIZAN
=========================================================*/



/*=========================================================
MODAL
=========================================================*/

function abrirModal() {

    modalOrganizador.classList.remove("oculto");

}

function cerrarModalFuncion() {

    modalOrganizador.classList.add("oculto");

    contenidoModal.innerHTML = "";

}

/* hacemos prueba del modal */
/* abrirModal();

contenidoModal.innerHTML = `
    <h2>Hola 😄</h2>

    <p>

        Este será el nuevo centro del planificador.

    </p>
`; */




/*=========MODAL DEL CALENDARIO=========*/

function crearMenuCalendario() {

    return `

        <h2>

            ¿Qué querés agregar?

        </h2>

        <div class="menu-modal">

            <button class="opcion-modal" data-tipo="examen">

                📚 Examen

            </button>

            <button class="opcion-modal" data-tipo="entrega">

                📑 Entrega

            </button>

            <button class="opcion-modal" data-tipo="actividad">

                📝 Actividad

            </button>

            <button class="opcion-modal" data-tipo="evento">

                🎉 Evento

            </button>

            <button class="opcion-modal" data-tipo="seminario">

                🎤 Seminario

            </button>

        </div>

    `;

}

function abrirMenuCalendario() {

    contenidoModal.innerHTML = crearMenuCalendario();


    const botonesModal =
        document.querySelectorAll(".opcion-modal");

    botonesModal.forEach(boton=>{

        boton.addEventListener("click",()=>{

            abrirFormulario(

                boton.dataset.tipo

            );

        });

    });


    abrirModal();

}



function abrirFormulario(tipo){

    switch(tipo){

        case "examen":

            contenidoModal.innerHTML =
                crearFormularioExamen();

             cargarMateriasEnFormulario();

                const selectMateria =
                    document.getElementById("materiaFormulario");

                selectMateria.addEventListener("change", () => {

                    if (selectMateria.value === "nueva") {

                        abrirFormularioNuevaMateria();

                    }

                });


             document
                .getElementById("guardarFormulario")
                .addEventListener("click", guardarExamen);

            break;

        case "entrega":

            contenidoModal.innerHTML =
                crearFormularioEntrega();

            break;

        case "actividad":

            contenidoModal.innerHTML =
                crearFormularioActividad();

            break;

        case "evento":

            contenidoModal.innerHTML =
                crearFormularioEvento();

            break;

        case "seminario":

            contenidoModal.innerHTML =
                crearFormularioSeminario();

            break;

    }

}


function guardarExamen(){

    const materiaSelect =
        document.getElementById("materiaFormulario");

    const titulo =
        document.getElementById("tituloFormulario")
        .value
        .trim();

    if(
        !materiaSelect.value ||
        !titulo
    ){

        alert("Completá todos los campos.");

        return;

    }

    const materia =
        organizacion.materias.find(

            m => m.id === materiaSelect.value

        );

    registrarActividad({

        materia: materia.nombre,

        titulo,

        tipo:"examen",

        fecha:fechaSeleccionada,

        categoria:"Examen"

    });

    fechasGuardadas.push({

        fecha:fechaSeleccionada,

        evento:titulo,

        categoria:"Examen"

    });

    localStorage.setItem(

        "fechas",

        JSON.stringify(fechasGuardadas)

    );

    renderizarCalendario();

    mostrarFechas(fechaSeleccionada);

    cerrarModalFuncion();

}


//mini form para introducir nueva maateria que no se tiene en el horario
function abrirFormularioNuevaMateria(){

    contenidoModal.innerHTML = `

        <div class="formulario-creacion">

            <h2>📚 Nueva materia</h2>

            <p>

                No encontramos esa materia en tu base de datos.

            </p>

            <input
                id="nombreNuevaMateria"
                type="text"
                placeholder="Ej: Álgebra">

            <div class="acciones-modal">

                <button id="cancelarNuevaMateria">

                    Cancelar

                </button>

                <button id="crearNuevaMateria">

                    Agregar

                </button>

            </div>

        </div>

    `;

}











/* ==============HORARIO SEMANAL=====================script para generar el horario semanal dinámicamente y permitir al usuario agregar actividades a cada celda del horario============ */

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


/*==============CALENDARIO MENSSUAL======================================================             script para agregar fechas importantes al calendario mensualy guardarlas en localStorage===========================================================*/

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



/* ===========================PLANIFICADOR DE TAREAS============================== */
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



/*======================formulario para el examen================== */


function crearFormularioExamen() {

    const fecha = new Date(fechaSeleccionada);

    const fechaTexto = fecha.toLocaleDateString(
        "es-AR",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

    return `

        <div class="formulario-creacion">

            <h2>📚 Nuevo examen</h2>

            <p class="fecha-formulario">
                📅 ${fechaTexto}
            </p>

            <label>Materia</label>

            <select id="materiaFormulario">

                <option value="">
                    Seleccioná una materia
                </option>

            </select>

            <label>Título</label>

            <input
                type="text"
                id="tituloFormulario"
                placeholder="Ej: Parcial 1">

            <button id="guardarFormulario">

                Guardar examen

            </button>

        </div>

    `;

}

function guardarFormularioExamen(){

    console.log("Crear examen");

}

function mostrarFormulario(tipo){

    const contenedor=document.getElementById("formularioDinamico");

    switch(tipo){

        case "examen":

            contenedor.innerHTML=crearFormularioExamen();

            cargarMateriasEnFormulario();

            document
                .getElementById("guardarFormulario")
                .addEventListener("click", guardarFormularioExamen);

            break;

        case "entrega":

            contenedor.innerHTML=crearFormularioEntrega();

            break;

        case "actividad":

            contenedor.innerHTML=crearFormularioActividad();

            break;

        case "evento":

            contenedor.innerHTML=crearFormularioEvento();

            break;

        case "seminario":

            contenedor.innerHTML=crearFormularioSeminario();

            break;

    }

}



/*=========================================================
BLOQUE 5: TODOS LOS EVENTOS
=========================================================*/





cerrarModal.addEventListener("click", () => {

    cerrarModalFuncion();

});












/* HORARIO*/

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


function iniciarEventosHorario() {

    const celdas = document.querySelectorAll(
        ".libre, .clase, .estudio, .descanso"
    );

    console.log(celdas.length);

    celdas.forEach(celda => {

        celda.addEventListener("click", () => {

            actualizarSeleccion(celda);

            if (selectedCells.length === 1) {

                actualizarInputsDesdeCelda(celda);

            } else {

                actividadInput.value = "";

                tipoInput.value = "";

            }

        });

    });


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

            //Añado esto por la nueva api
            

            if(tipo === "1"){

                registrarActividad({

                    materia: actividad,

                    titulo: actividad,

                    tipo: "clase",

                    dia: celda.dataset.dia,

                    hora: celda.dataset.hora

                });

            }

            //

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

}



/*CALENDARIO*/

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
    abrirMenuCalendario();
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



/*CENTRO ORGANIZACIÓN*/

//permite que EL MENU cambie de color al clickear enel menú -- ACTIVO
menuItems.forEach(item => {

    item.addEventListener("click", () => {

        menuItems.forEach(i => i.classList.remove("activo"));

        item.classList.add("activo");

    });

});

//permite cambiar de color DEL CENTRO DE ORGANIZACIÖN al clickear -- ACTIVO y además entiende decide si se despliega forms o no 
tarjetasCreacion.forEach(tarjeta => {

    tarjeta.addEventListener("click", () => {

        console.log(tarjeta.dataset.tipo);

        tarjetasCreacion.forEach(t =>
            t.classList.remove("activo")
        );

        tarjeta.classList.add("activo");

        mostrarFormulario(tarjeta.dataset.tipo);

    });

});






/*PLANIFICADOR DE TAREAS*/

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


/*=========================================================
BLOQUE 6: INICIALIZACIÓN
=========================================================*/
/* =========================================================
script para enseñar el resumen diario va aqui pq necesita que estén definidos las anteriores cosas

Cuando el usuario entre, en vez de mostrar solo números, 
podríamos mostrar un mensaje inteligente, por ejemplo:

👋 ¡Hola, Gina!

Hoy tenés:

• 2 tareas pendientes.
• 1 entrega el lunes.
• Ningún examen esta semana.

Tu prioridad de hoy debería ser avanzar con el Proyecto Final.
========================================================= */

//evaluo las func que acabo de definir son parte de inicialización
generarHorario();
aplicarHorarioGuardado();
iniciarEventosHorario();

mostrarFechas();
renderizarCalendario();

renderizarTareas();


document.getElementById("cantidadEventos").textContent =
    fechasGuardadas.length;

document.getElementById("cantidadTareas").textContent =
    tareas.length;

document.getElementById("cantidadExamenes").textContent = 0;

//codigo para ver en la consola detalles
console.log(tarjetasCreacion);
console.log(organizacion);
console.log("Materias:", organizacion.materias);
