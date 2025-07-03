import { filtrarProductosPorTexto, aplicarFiltros } from './filtros.js';
import { cargarCarrito, renderizarCarrito, renderizarResumenCarrito } from './carrito.js';
import { mostrarProductos, mostrarCarruselDestacado } from './ui.js';
import { productosGlobal, cargarDatos } from './api.js';
import { finalizarCompra } from './carrito.js';


export async function inicializarEventos() {
  const pathname = window.location.pathname;
  console.log("Página actual:", pathname);

  if (pathname.includes("carrito.html")) {
    console.log("🛒 Entrando a carrito.html");

    // Cargar carrito y renderizar resumen en carrito.html
    cargarCarrito();
    renderizarResumenCarrito();
    const btnFinalizar = document.getElementById("finalizar-compra");
    if (btnFinalizar) {
      btnFinalizar.addEventListener("click", () => {
      finalizarCompra();
    });
  }

    // En carrito.html los botones redirigen a productos.html con categoría en query string
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

    return; // No continuar con el resto para carrito.html
  }

  // Para productos.html u otras páginas:

  console.log("JS cargado");

  const datos = await cargarDatos();

  if (datos.length === 0) {
    console.warn("No se cargaron productos");
    return;
  }

  // Leer parámetro 'categoria' de URL para mostrar filtro inicial
  const urlParams = new URLSearchParams(window.location.search);
  const categoriaParam = urlParams.get('categoria') || 'skin'; // Por defecto 'skin'

  const productosFiltrados = productosGlobal.filter(p => p.categoria === categoriaParam);

  mostrarProductos(productosFiltrados);
  mostrarCarruselDestacado(productosFiltrados);

  // Eventos de búsqueda y filtros
  const searchBar = document.getElementById("search-bar");
  if (searchBar) searchBar.addEventListener("input", filtrarProductosPorTexto);

  const filtros = document.querySelectorAll("input[name='categoria'], input[name='rareza'], #precio-max");
  filtros.forEach(f => f.addEventListener("input", aplicarFiltros));

  const precioMaxSelect = document.getElementById("precio-max");
  if (precioMaxSelect) precioMaxSelect.addEventListener("change", aplicarFiltros);

  // Cargar carrito guardado y renderizar
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

  // Logo que vuelve a productos.html sin query (por defecto skins)
  const logoDiv = document.querySelector(".logo");
  if (logoDiv) {
    logoDiv.addEventListener("click", () => {
      window.location.href = "productos.html";
    });
  }

  // Botones VP y Skins para filtrar sin cambiar de página (solo si estás en productos.html)
  const btnVP = document.getElementById("btnVP");
  if (btnVP) {
    btnVP.addEventListener("click", () => {
      const monedas = productosGlobal.filter(p => p.categoria === 'moneda');
      mostrarProductos(monedas);
      mostrarCarruselDestacado(monedas);
    });
  }

  const btnSkins = document.getElementById("btnSkins");
  if (btnSkins) {
    btnSkins.addEventListener("click", () => {
      const skins = productosGlobal.filter(p => p.categoria === 'skin');
      mostrarProductos(skins);
      mostrarCarruselDestacado(skins);
    });
  }

  // Icono búsqueda toggle
  const searchIcon = document.getElementById("search-toggle");
  const searchContainer = document.querySelector(".search-container");

  if (searchIcon && searchContainer) {
    searchIcon.addEventListener("click", () => {
      searchContainer.classList.toggle("active");
      const input = document.getElementById("search-bar");
      if (searchContainer.classList.contains("active") && input) {
        input.focus();
      }
    });

    document.addEventListener("click", (e) => {
      if (!searchContainer.contains(e.target) && e.target !== searchIcon) {
        searchContainer.classList.remove("active");
      }
    });
  }

  // Botón confirmar compra que lleva a carrito.html
  const btnConfirmar = document.getElementById("confirmar-compra");
  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", () => {
      window.location.href = "carrito.html";
    });
  }
}
