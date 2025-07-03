let page = 1;
const limit = 2;

function actualizarPaginacion(pageActual, totalPaginas) {
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const pageNumber = document.getElementById("pageNumber");

  if (!prevBtn || !nextBtn || !pageNumber) return;

  pageNumber.textContent = `Página ${pageActual} de ${totalPaginas}`;
  prevBtn.disabled = pageActual === 1;
  nextBtn.disabled = pageActual === totalPaginas;
}

document.getElementById("prev")?.addEventListener("click", () => {
  if (page > 1) {
    page--;
    cargarProductosPaginados();  // Tu función que recarga los productos
  }
});

document.getElementById("next")?.addEventListener("click", () => {
  page++;
  cargarProductosPaginados();
});

// En la función que carga los productos paginados debes llamar a actualizarPaginacion
async function cargarProductosPaginados() {
  const res = await fetch(`/api/productos/paginacion?page=${page}&limit=${limit}`);
  const data = await res.json();

  mostrarProductos(data.productos);
  actualizarPaginacion(data.page, data.totalPages);
}
