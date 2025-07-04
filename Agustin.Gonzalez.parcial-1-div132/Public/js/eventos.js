import { filtrarProductosPorTexto, aplicarFiltros, resetearFiltros } from './filtros.js';
import { cargarCarrito, renderizarCarrito, renderizarResumenCarrito } from './carrito.js';
import { mostrarProductos, mostrarCarruselDestacado } from './ui.js';
import { productosGlobal, cargarDatos, setProductosGlobal } from './api.js';
import { finalizarCompra } from './carrito.js';

export let categoriaActual = 'skin'; // variable global para categoría actual

export async function inicializarEventos() {
  const pathname = window.location.pathname;
  console.log("Página actual:", pathname);

  if (pathname.includes("carrito.html")) {
    // código carrito (igual que antes)
    cargarCarrito();
    renderizarResumenCarrito();
    const btnFinalizar = document.getElementById("finalizar-compra");
    if (btnFinalizar) {
      btnFinalizar.addEventListener("click", () => finalizarCompra());
    }

    // Botones que llevan a productos con query string (solo para carrito)
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
    return; // no sigue el resto para carrito
  }

  // Para productos.html y demás

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
  mostrarProductos(productosFiltrados);
  mostrarCarruselDestacado(productosFiltrados);

  // Listeners filtros
  const subcategoriasCheckboxes = document.querySelectorAll("input[name='subcategoria']");
  const ordenPrecioSelect = document.getElementById("orden-precio");
  const precioLimiteInput = document.getElementById("precio-limite");

  subcategoriasCheckboxes.forEach(cb => cb.addEventListener("change", aplicarFiltros));
  if (ordenPrecioSelect) ordenPrecioSelect.addEventListener("change", aplicarFiltros);
  if (precioLimiteInput) precioLimiteInput.addEventListener("input", aplicarFiltros);

  // Botones categoría: al hacer clic cambian categoriaActual, resetean filtros y aplican filtros
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
}
