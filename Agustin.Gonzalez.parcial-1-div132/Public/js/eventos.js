import { filtrarProductosPorTexto, aplicarFiltros, resetearFiltros } from './filtros.js';
import { cargarCarrito, renderizarCarrito, renderizarResumenCarrito } from './carrito.js';
import { mostrarProductos } from './ui.js';
import { productosGlobal, cargarDatos, setProductosGlobal } from './api.js';
import { finalizarCompra } from './carrito.js';
import { aplicarTemaCSS } from './CambiarTema.js';
import { paginacionProductos } from './paginacion.js';

export let categoriaActual = 'skin';

export async function inicializarEventos() {
  const pathname = window.location.pathname;
  console.log("Página actual:", pathname);

  // ------------------------
  // Código para carrito.html
  // ------------------------

  // Si estamos en carrito.html, cargar carrito y aplicar tema
  if (pathname.includes("carrito.html")) {
    cargarCarrito();
    renderizarResumenCarrito();

    // Aplicar tema y toggle en carrito
    const btnTema = document.getElementById("btnTema");
    const iconoTema = document.getElementById("iconoTema");

    const temaGuardado = localStorage.getItem("tema");
    if (temaGuardado === "oscuro") {
      aplicarTemaCSS("oscuro");
    } else {
      aplicarTemaCSS("claro");
    }

    if (btnTema && iconoTema) {
      btnTema.addEventListener("click", () => {
        const temaActual = localStorage.getItem("tema");
        const nuevoTema = temaActual === "oscuro" ? "claro" : "oscuro";
        aplicarTemaCSS(nuevoTema);
      });
    }

    //finalizar compra
    const btnFinalizar = document.getElementById("finalizar-compra");
    if (btnFinalizar) {
      btnFinalizar.addEventListener("click", () => finalizarCompra());
    }

   //botones de navegacion en carrito.html
    const btnVP = document.getElementById("btnVP");
    if (btnVP) {
      btnVP.addEventListener("click", () => {
        window.location.href = "productos.html?categoria=moneda";
      });
    }
    const btnSkins = document.getElementById("btnSkins");
    if (btnSkins) {
      btnSkins.addEventListener("click", () => {
        window.location.href = "productos.html?categoria=skin";
      });
    }
    return; // Termina ejecución para carrito
  }

  // --------------------------
  // Código para productos.html y otros
  // --------------------------


  const datos = await cargarDatos();
  if (datos.length === 0) {
    console.warn("No se cargaron productos");
    return;
  }
  setProductosGlobal(datos);

  // Inicializar categoriaActual según parámetro URL (o default 'skin')
  const urlParams = new URLSearchParams(window.location.search);
  categoriaActual = urlParams.get('categoria') || 'skin';

  // Mostrar productos iniciales por categoría actual
  const productosFiltrados = productosGlobal.filter(p => p.categoria === categoriaActual);
  paginacionProductos(productosFiltrados, mostrarProductos);

  // Listeners filtros
  const subcategoriasCheckboxes = document.querySelectorAll("input[name='subcategoria']");
  const ordenPrecioSelect = document.getElementById("orden-precio");
  const precioLimiteInput = document.getElementById("precio-limite");

  subcategoriasCheckboxes.forEach(cb => cb.addEventListener("change", aplicarFiltros));
  if (ordenPrecioSelect) ordenPrecioSelect.addEventListener("change", aplicarFiltros);
  if (precioLimiteInput) precioLimiteInput.addEventListener("input", aplicarFiltros);


  // Botones de categoría
  const btnVP = document.getElementById("btnVP");
  if (btnVP) {
    btnVP.addEventListener("click", () => {
      categoriaActual = 'moneda';
      resetearFiltros();
      aplicarFiltros();
    });
  }
  const btnSkins = document.getElementById("btnSkins");
  if (btnSkins) {
    btnSkins.addEventListener("click", () => {
      categoriaActual = 'skin';
      resetearFiltros();
      aplicarFiltros();
    });
  }

  // Búsqueda
  const searchBar = document.getElementById("search-bar");
  if (searchBar) searchBar.addEventListener("input", filtrarProductosPorTexto);

  // Carrito
  cargarCarrito();
  renderizarCarrito();

  // Toggle carrito dropdown
  const cartButton = document.getElementById("cart-button");
  const cartDropdown = document.getElementById("cart-dropdown");
  if (cartButton && cartDropdown) {
    cartButton.addEventListener("click", (event) => {
      event.stopPropagation();
      cartDropdown.classList.toggle("hidden");
    });
    document.addEventListener("click", (event) => {
      if (
        !cartDropdown.classList.contains("hidden") &&
        !cartDropdown.contains(event.target) &&
        event.target !== cartButton
      ) {
        cartDropdown.classList.add("hidden");
      }
    });
  }

  // Logo vuelve a productos sin query
  const logoDiv = document.querySelector(".logo");
  if (logoDiv) {
    logoDiv.addEventListener("click", () => {
      categoriaActual = 'skin';
      resetearFiltros();
      aplicarFiltros();
    });
  }

  // Botón confirmar compra lleva a carrito.html
  const btnConfirmar = document.getElementById("confirmar-compra");
  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", () => {
      window.location.href = "carrito.html";
    });
  }

  // Aplicar tema y toggle para productos y otras páginas
  const btnTema = document.getElementById("btnTema");
  const iconoTema = document.getElementById("iconoTema");

  const temaGuardado = localStorage.getItem("tema");
  if (temaGuardado === "oscuro") {
    aplicarTemaCSS("oscuro");
  } else {
    aplicarTemaCSS("claro");
  }

  if (btnTema && iconoTema) {
    btnTema.addEventListener("click", () => {
      const temaActual = localStorage.getItem("tema");
      const nuevoTema = temaActual === "oscuro" ? "claro" : "oscuro";
      aplicarTemaCSS(nuevoTema);
    });
  }

  // Cerrar menú si clickea afuera
  const menuTema = document.getElementById("menuTema");
  document.addEventListener("click", (event) => {
    if (menuTema && !menuTema.contains(event.target) && event.target !== btnTema) {
      menuTema.classList.add("hidden");
    }
  });

  const searchToggle = document.getElementById("search-toggle");
const searchContainer = document.querySelector(".search-container");


if (searchToggle && searchContainer && searchBar) {
  searchToggle.addEventListener("click", () => {
    searchContainer.classList.toggle("active");
    if (searchContainer.classList.contains("active")) {
      searchBar.focus();
    } else {
      searchBar.value = "";
      aplicarFiltros("");
    }
  });
}
}
