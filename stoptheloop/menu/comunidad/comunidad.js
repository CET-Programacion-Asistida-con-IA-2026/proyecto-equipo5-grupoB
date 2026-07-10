/* =========================================
   MENÚ HAMBURGUESA (MOBILE)
   ========================================= */
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

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
});

const boton = document.getElementById('btn-pseudonimo');
const input = document.getElementById('input-pseudonimo');
const pseudonimoActual = document.getElementById('pseudonimo-actual');
const tarjetaPseudonimo = document.getElementById('tarjeta-pseudonimo');
const textoIntro = document.getElementById('texto-intro-foro');
const restoDelForo = document.getElementById('resto-del-foro');

boton.addEventListener('click', function() {
  const pseudonimoElegido = input.value;
  localStorage.setItem('pseudonimo', pseudonimoElegido);
  pseudonimoActual.textContent = 'Tu nombre anónimo es: ' + pseudonimoElegido;

  textoIntro.style.display = 'none';
  tarjetaPseudonimo.style.display = 'none';
  restoDelForo.style.display = 'block';
});

// 1. Guardamos las categorías y sus tags en un array de objetos.
//    Cada objeto tiene un "nombre" (la categoría) y una lista de "tags".
const categoriasDeTags = [
  { nombre: "Emociones y malestar", tags: ["ansiedad","culpa","miedo","frustración","estrés","incomodidad","vergüenza","impotencia","inseguridad","desconfianza","preocupación","agobio","confusión"] },
  { nombre: "Salud física y mental", tags: ["sueño","hambre","fatiga","cansancio","insomnio","alimentación"] },
  { nombre: "Tiempo, presión, responsabilidad y urgencia", tags: ["examenes","parciales","finales","urgencia","tiempo","presión","deadline","aprobar","desaprobar","procrastinación","plazos"] },
  { nombre: "Tecnología, redes sociales, scrolling e IA", tags: ["nociondeltiempo","celular","scrolling","tiktok","instagram","reels","twitter","algoritmo","dopamina","atencion","chatgpt","notificaciones","distracción","youtube","loop"] },
  { nombre: "Tareas aburridas o difíciles", tags: ["dificultad","interés","materias","aburrimiento","bodrio","embole"] },
  { nombre: "Comparación social y presión académica", tags: ["rendimiento","promedio","competencia","compañeros","compañeras","exigencia","comparación","atraso","autoexigencia","presiónsocial","humillación","rechazo"] },
  { nombre: "Productividad tóxica, descanso y tiempo libre", tags: ["productividad","tiempolibre","descanso","energía","límites","balance"] },
  { nombre: "Autocontrol, disciplina y motivación", tags: ["organización","regulación","gestión","disciplina","perseverancia","consistencia","motivación","autocontrol","hábito","objetivos","intención","autoconocimiento","determinación"] },
  { nombre: "Acompañamiento, herramientas y técnicas", tags: ["IA","aprendizaje","errores","tecnicasdeestudio","apoyo","recursos","tips","plantillas","herramientas"] }
];

// 2. Buscamos los elementos del HTML que ya existen.
const btnFiltrar = document.getElementById('btn-filtrar');
const panelTags = document.getElementById('panel-tags');
const contenedorCategorias = document.getElementById('contenedor-categorias');

// 2.0 Modo actual del panel: indica si los tags que se seleccionen ahí
//     son para "busqueda" o para "posteo". Sin esto, no habría forma
//     de saber a cuál de las dos listas afectar.
let modoPanelTags = 'busqueda';

// 3. Abre el panel en el modo indicado (o lo cierra, si ya estaba
//    abierto en ESE MISMO modo). Si estaba abierto en el otro modo,
//    lo deja abierto pero cambia de contexto.
function abrirPanelEnModo(modo) {
  if (panelTags.style.display === 'block' && modoPanelTags === modo) {
    panelTags.style.display = 'none';
    return;
  }
  modoPanelTags = modo;
  panelTags.style.display = 'block';
  refrescarPillsDelPanel();
}

btnFiltrar.addEventListener('click', function() {
  abrirPanelEnModo('busqueda');
});

// 2.1 Dos arrays separados: uno para los tags de búsqueda, otro para
//     los del posteo que se está armando.
let tagsSeleccionadosBusqueda = [];
let tagsSeleccionadosPosteo = [];

// 2.2 Diccionario (objeto) que guarda, para cada tag, el botón del panel
//     que le corresponde. Nos permite encontrarlo después sin recorrer nada.
const botonesPorTag = {};

// 2.3 Elementos nuevos que necesitamos para los chips y la búsqueda.
const tagsBusquedaVisual = document.getElementById('tags-busqueda-visual');
const tagsPosteoVisual = document.getElementById('tags-posteo-visual');
const inputBuscar = document.getElementById('input-buscar');
const btnBuscar = document.getElementById('btn-buscar');
const resultadoBusqueda = document.getElementById('resultado-busqueda');

// 2.3.1 Elementos de la caja de nuevo posteo.
const btnNuevoPosteo = document.getElementById('btn-nuevo-posteo');
const cajaNuevoPosteo = document.getElementById('caja-nuevo-posteo');
const btnAgregarTags = document.getElementById('btn-agregar-tags');
const btnPostear = document.getElementById('btn-postear');
const tituloNuevoPosteo = document.getElementById('titulo-nuevo-posteo');
const textoNuevoPosteo = document.getElementById('texto-nuevo-posteo');
const feedPosteos = document.getElementById('feed-posteos');

// 2.3.2 "+ Postear" muestra u oculta la caja de nuevo posteo.
btnNuevoPosteo.addEventListener('click', function() {
  if (cajaNuevoPosteo.style.display === 'none') {
    cajaNuevoPosteo.style.display = 'block';
  } else {
    cajaNuevoPosteo.style.display = 'none';
  }
});

// 2.3.3 "Agregar tags", adentro de la caja de posteo, reusa el mismo
//       panel que "Filtrar por tags" (misma función, mismo panel).
btnAgregarTags.addEventListener('click', function() {
  abrirPanelEnModo('posteo');
});

// 2.3.4 "Postear": crea la tarjeta del post en el feed, con una copia
//       de los tags seleccionados (para que no cambien si después se
//       modifica la selección), y limpia todo para el próximo posteo.
btnPostear.addEventListener('click', function() {
  const tituloDelPosteo = tituloNuevoPosteo.value;
  const textoDelPosteo = textoNuevoPosteo.value;
  const tagsDelPosteo = tagsSeleccionadosPosteo.slice();
  const pseudonimoDelPosteo = localStorage.getItem('pseudonimo');

  crearTarjetaDePost(tituloDelPosteo, textoDelPosteo, tagsDelPosteo, pseudonimoDelPosteo);

  tituloNuevoPosteo.value = '';
  textoNuevoPosteo.value = '';

  tagsSeleccionadosPosteo = [];
  actualizarTagsVisibles('posteo');
  refrescarPillsDelPanel();

  cajaNuevoPosteo.style.display = 'none';
});

// 2.3.5 Arma visualmente la tarjeta de un post ya publicado y la
//       agrega al principio del feed (los más nuevos, arriba).
function crearTarjetaDePost(titulo, texto, tags, pseudonimo) {
  const tarjeta = document.createElement('div');
  tarjeta.className = 'tarjeta-post';

  const encabezado = document.createElement('div');
  encabezado.className = 'encabezado-post';

  const tituloEl = document.createElement('h4');
  tituloEl.textContent = titulo;
  encabezado.appendChild(tituloEl);

  const autorEl = document.createElement('span');
  autorEl.className = 'autor-post';
  autorEl.textContent = 'Por: ' + pseudonimo;
  encabezado.appendChild(autorEl);

  tarjeta.appendChild(encabezado);

  const preview = document.createElement('p');
  preview.className = 'preview-post';
  preview.textContent = texto.length > 150 ? texto.slice(0, 150) + '...' : texto;
  tarjeta.appendChild(preview);

  const tagsEl = document.createElement('div');
  tagsEl.className = 'tags-del-post';

  const tagsAMostrar = tags.slice(0, 5);
  tagsAMostrar.forEach(function(tag) {
    const tagChip = document.createElement('span');
    tagChip.className = 'chip-tag-post';
    tagChip.textContent = '#' + tag;
    tagsEl.appendChild(tagChip);
  });

  const tagsRestantes = tags.length - tagsAMostrar.length;
  if (tagsRestantes > 0) {
    const masTags = document.createElement('span');
    masTags.className = 'mas-tags-post';
    masTags.textContent = '+' + tagsRestantes;
    tagsEl.appendChild(masTags);
  }

  tarjeta.appendChild(tagsEl);

  const acciones = document.createElement('div');
  acciones.className = 'acciones-post';

  const btnLike = document.createElement('button');
  btnLike.className = 'btn-like';
  btnLike.textContent = '🤍 Like';

  let likeado = false;

  btnLike.addEventListener('click', function() {
    likeado = !likeado;

    if (likeado) {
      btnLike.textContent = '💜 Like';
      btnLike.classList.add('like-activo');
    } else {
      btnLike.textContent = '🤍 Like';
      btnLike.classList.remove('like-activo');
    }
  });

  acciones.appendChild(btnLike);

  const btnComentar = document.createElement('button');
  btnComentar.className = 'btn-comentar';
  btnComentar.textContent = '💬 Comentar';
  acciones.appendChild(btnComentar);

  tarjeta.appendChild(acciones);

  feedPosteos.prepend(tarjeta);
}

// 2.4 Función reusable: selecciona o deselecciona un tag. Recibe el
//     "modo" como parámetro explícito (no usa modoPanelTags directo)
//     para que un chip de búsqueda SIEMPRE afecte a búsqueda, sin
//     importar en qué modo esté el panel en ese momento.
function toggleTag(tag, modo) {
  const seleccionActual = modo === 'busqueda' ? tagsSeleccionadosBusqueda : tagsSeleccionadosPosteo;
  const yaEstaSeleccionado = seleccionActual.includes(tag);
  let nuevaSeleccion;

  if (yaEstaSeleccionado) {
    nuevaSeleccion = seleccionActual.filter(function(t) {
      return t !== tag;
    });
  } else {
    if (seleccionActual.length >= 10) {
      alert('Podés seleccionar hasta 10 tags.');
      return;
    }
    nuevaSeleccion = seleccionActual.concat([tag]);
  }

  if (modo === 'busqueda') {
    tagsSeleccionadosBusqueda = nuevaSeleccion;
  } else {
    tagsSeleccionadosPosteo = nuevaSeleccion;
  }

  if (nuevaSeleccion.includes(tag)) {
    botonesPorTag[tag].classList.add('tag-pill-seleccionado');
  } else {
    botonesPorTag[tag].classList.remove('tag-pill-seleccionado');
  }

  actualizarTagsVisibles(modo);
}

// 2.5 Redibuja los chips seleccionados del modo indicado, en su
//     contenedor correspondiente (búsqueda o posteo).
function actualizarTagsVisibles(modo) {
  const contenedor = modo === 'busqueda' ? tagsBusquedaVisual : tagsPosteoVisual;
  const lista = modo === 'busqueda' ? tagsSeleccionadosBusqueda : tagsSeleccionadosPosteo;

  contenedor.innerHTML = '';

  lista.forEach(function(tag) {
    const chip = document.createElement('span');
    chip.className = 'chip-tag';
    chip.textContent = '#' + tag + ' ×';

    chip.addEventListener('click', function() {
      toggleTag(tag, modo);
    });

    contenedor.appendChild(chip);
  });
}

// 2.5.1 Repinta los pills del panel según la selección del modo
//       ACTUAL (modoPanelTags).
function refrescarPillsDelPanel() {
  const seleccionActual = modoPanelTags === 'busqueda' ? tagsSeleccionadosBusqueda : tagsSeleccionadosPosteo;

  for (const tag in botonesPorTag) {
    if (seleccionActual.includes(tag)) {
      botonesPorTag[tag].classList.add('tag-pill-seleccionado');
    } else {
      botonesPorTag[tag].classList.remove('tag-pill-seleccionado');
    }
  }
}

// 2.6 El botón "Buscar": arma un mensaje con el texto tipeado y los tags
//     seleccionados.
btnBuscar.addEventListener('click', function() {
  const textoBuscado = inputBuscar.value;

  let mensaje = 'Buscando';
  if (textoBuscado !== '') {
    mensaje += ': "' + textoBuscado + '"';
  }
  if (tagsSeleccionadosBusqueda.length > 0) {
    mensaje += ' con tags #' + tagsSeleccionadosBusqueda.join(' #');
  }

  resultadoBusqueda.textContent = mensaje;
});

// 4. Recorremos el array de categorías: una vuelta por cada una.
categoriasDeTags.forEach(function(categoria) {

  const bloqueCategoria = document.createElement('div');
  bloqueCategoria.className = 'categoria-tags';

  const titulo = document.createElement('h4');
  titulo.textContent = categoria.nombre;
  bloqueCategoria.appendChild(titulo);

  const listaTags = document.createElement('div');
  listaTags.className = 'lista-tags';

  categoria.tags.forEach(function(tag) {
    const botonTag = document.createElement('button');
    botonTag.className = 'tag-pill';
    botonTag.textContent = '#' + tag;

    botonesPorTag[tag] = botonTag;

    botonTag.addEventListener('click', function() {
      toggleTag(tag, modoPanelTags);
    });

    listaTags.appendChild(botonTag);
  });

  bloqueCategoria.appendChild(listaTags);
  contenedorCategorias.appendChild(bloqueCategoria);

});
