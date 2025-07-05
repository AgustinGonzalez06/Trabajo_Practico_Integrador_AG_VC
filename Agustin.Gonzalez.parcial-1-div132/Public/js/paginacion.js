let paginaActual = 1;
const productosPorPagina = 6;
let listaGlobal = [];

/**
 * Función principal de paginación
 */
export function paginacionProductos(lista, mostrarCallback) {
  listaGlobal = lista;

  const totalPaginas = Math.ceil(lista.length / productosPorPagina);

  // Ajusta página actual si excede
  if (paginaActual > totalPaginas) {
    paginaActual = totalPaginas;
  }

  const inicio = (paginaActual - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPagina = lista.slice(inicio, fin);

  // Llama a tu función de renderizado que se pasa como callback
  mostrarCallback(productosPagina);

  mostrarControlesPaginacion(totalPaginas, mostrarCallback);
}

/**
 * Controles de paginación
 */
function mostrarControlesPaginacion(totalPaginas, mostrarCallback) {
  let paginacion = document.getElementById("paginacion");
  const zonaPaginacion = document.getElementById("zonaPaginacion");

  if (!paginacion) {
    paginacion = document.createElement("div");
    paginacion.id = "paginacion";
    zonaPaginacion.appendChild(paginacion);
  }

  paginacion.innerHTML = `
    <button id="prevPag" ${paginaActual === 1 ? "disabled" : ""}>Anterior</button>
    <span> Página ${paginaActual} de ${totalPaginas} </span>
    <button id="nextPag" ${paginaActual === totalPaginas ? "disabled" : ""}>Siguiente</button>
  `;

  document.getElementById("prevPag").addEventListener("click", () => {
    if (paginaActual > 1) {
      paginaActual--;
      paginacionProductos(listaGlobal, mostrarCallback);
    }
  });

  document.getElementById("nextPag").addEventListener("click", () => {
    if (paginaActual < totalPaginas) {
      paginaActual++;
      paginacionProductos(listaGlobal, mostrarCallback);
    }
  });
}
