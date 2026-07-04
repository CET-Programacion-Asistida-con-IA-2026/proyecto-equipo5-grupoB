let horarioGuardado = JSON.parse(
    localStorage.getItem("horario")
) || [];

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

const horaInicio = 8; // Hora de inicio del horario (8 AM)
const horaFin = 23; // Hora de fin del horario (11 PM)


horario.innerHTML += `<div class="hora"></div>`; // Espacio vacío para la primera celda de la primera fila

dias.forEach(dia => {  // Iterar sobre los días de la semana
    horario.innerHTML += `
        <div class="dia">${dia}</div>
    `;
});

for (let hora = horaInicio; hora <= horaFin; hora++) { // Iterar sobre las horas del horario
    horarioGuardado.forEach(item => {

        const celda = document.querySelector(
            `[data-dia="${item.dia}"][data-hora="${item.hora}"]`
        );

        if (!celda) return;

        celda.textContent = item.actividad;

        celda.classList.remove("libre");

        if (item.tipo === "1") {
            celda.classList.add("clase");
        }

        else if (item.tipo === "2") {
            celda.classList.add("estudio");
        }

        else if (item.tipo === "3") {
            celda.classList.add("descanso");
        }

    });

    // Agregar la hora a la primera columna de cada fila
    horario.innerHTML += `
        <div class="hora">${hora}:00</div>
    `;

    // Agregar celdas para cada día de la semana en la fila correspondiente a la hora actual
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



const celdas = document.querySelectorAll(
    ".libre, .clase, .estudio, .descanso"
); // Seleccionar todas las celdas del horario

console.log(celdas.length); // Verificar la cantidad de celdas generadas



celdas.forEach(celda => {

    celda.addEventListener("click", () => {
        


        // Solicitar al usuario que ingrese la actividad y el tipo de actividad
        const actividad = prompt(
            "¿Qué actividad quieres agregar?"
        );

        if (!actividad) return;

        const tipo = prompt(
            "Tipo:\n1 = Clase\n2 = Estudio\n3 = Descanso"
        );

        celda.textContent = actividad;

        celda.classList.remove(
            "libre",
            "clase",
            "estudio",
            "descanso"
        );

        if (tipo === "1") {
            celda.classList.add("clase");
        }

        else if (tipo === "2") {
            celda.classList.add("estudio");
        }

        else if (tipo === "3") {
            celda.classList.add("descanso");
        }

        // Guardar la información de la actividad en el arreglo horarioGuardado
        
        const existente = horarioGuardado.find(item =>
            item.dia === celda.dataset.dia &&
            item.hora === celda.dataset.hora
        );

        if (existente) {
            existente.actividad = actividad;
            existente.tipo = tipo;
        } else {
            horarioGuardado.push({
                dia: celda.dataset.dia,
                hora: celda.dataset.hora,
                actividad: actividad,
                tipo: tipo
            });
        }

        localStorage.setItem(
            "horario",
            JSON.stringify(horarioGuardado)
        );

        console.log(horarioGuardado);

        // Obtener los datos del día y la hora de la celda clickeada
        console.log(
            celda.dataset.dia,
            celda.dataset.hora
        );

    });

});

