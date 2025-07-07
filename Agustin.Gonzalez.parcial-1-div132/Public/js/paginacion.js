let paginaActual = 1;
const productosPorPagina = 6;
let listaGlobal = [];

/**
 * Función principal de paginación
 */
export function paginacionProductos(lista, mostrarCallback, reiniciar = false) {
  listaGlobal = lista;

  if (reiniciar) {
    paginaActual = 1;
  }

  const totalPaginas = Math.max(1, Math.ceil(lista.length / productosPorPagina));

  if (paginaActual > totalPaginas) {
    paginaActual = totalPaginas;
  }

  if (paginaActual < 1) {
    paginaActual = 1;
  }

  const inicio = (paginaActual - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPagina = lista.slice(inicio, fin);

  mostrarCallback(productosPagina);
  mostrarControlesPaginacion(totalPaginas, mostrarCallback);
}

/**
 * Controles de paginación
 */
function mostrarControlesPaginacion(totalPaginas, mostrarCallback) {
  let paginacion = document.getElementById("zonaPaginacion");
  if (!paginacion) {
    paginacion = document.createElement("div");
    paginacion.id = "zonaPaginacion";
    document.querySelector('main .products-section').appendChild(paginacion);
  }

  paginacion.innerHTML = `
    <button id="prevPag" ${paginaActual === 1 ? "disabled" : ""}>Anterior</button>
    <span> Página ${paginaActual} de ${totalPaginas} </span>
    <button id="nextPag" ${paginaActual === totalPaginas ? "disabled" : ""}>Siguiente</button>
  `;

  document.getElementById("prevPag").addEventListener("click", () => {
    if (paginaActual > 1) {
      paginaActual--;
      paginacionProductos(listaGlobal, mostrarCallback, false);
    }
  });

  document.getElementById("nextPag").addEventListener("click", () => {
    if (paginaActual < totalPaginas) {
      paginaActual++;
      paginacionProductos(listaGlobal, mostrarCallback, false); 
    }
  });
}