import { filtrarProductosPorTexto, aplicarFiltros } from './filtros.js';
import { cargarCarrito, renderizarCarrito } from './carrito.js';
import { mostrarProductos, mostrarCarruselDestacado } from './ui.js';
import { productosGlobal, cargarDatos } from './api.js';

export async function inicializarEventos() {
  console.log("JS cargado");

  const datos = await cargarDatos();

  if (datos.length === 0) {
    console.warn("No se cargaron productos");
    return;
  }

  // Por defecto mostrar skins (filtrar)
  const skins = productosGlobal.filter(p => p.categoria === 'skin');
  mostrarProductos(skins);
  mostrarCarruselDestacado(skins);

  // Eventos de filtros y búsqueda
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

  // Otros eventos UI: logo, botones skins/monedas, búsqueda

  const logoDiv = document.querySelector(".logo");
  if (logoDiv) {
    logoDiv.addEventListener("click", () => {
      window.location.href = "MI.html";
    });
  }

 // Botones de navegación para VP y Skins
  const btnVP = document.getElementById("btnVP");
const btnSkins = document.getElementById("btnSkins");

if (btnVP) {
  btnVP.addEventListener("click", () => {
    const monedas = productosGlobal.filter(p => p.categoria === 'moneda');
    mostrarProductos(monedas);
    mostrarCarruselDestacado(monedas);
  });
}

if (btnSkins) {
  btnSkins.addEventListener("click", () => {
    const skins = productosGlobal.filter(p => p.categoria === 'skin');
    mostrarProductos(skins);
    mostrarCarruselDestacado(skins);
  });
}

// Evento para el icono de búsqueda

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
}
