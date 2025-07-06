import { mostrarProductos } from './ui.js';
import { productosGlobal } from './api.js';
import {categoriaActual} from './eventos.js';
import { paginacionProductos } from './paginacion.js';

export function filtrarProductosPorTexto() {
  const searchBar = document.getElementById("search-bar");
  if (!searchBar) return;

  const texto = searchBar.value.toLowerCase();
  if (texto.length < 3) {
    paginacionProductos(productosGlobal, mostrarProductos, true);
    return;
  }

  const filtrados = productosGlobal.filter(p => p.nombre.toLowerCase().includes(texto));
  paginacionProductos(filtrados, mostrarProductos, true);
}


export function aplicarFiltros() {
  const subcategorias = Array.from(document.querySelectorAll("input[name='subcategoria']:checked"))
    .map(cb => cb.value.toLowerCase());

  const orden = document.getElementById("orden-precio")?.value || "default";
  const precioLimite = parseFloat(document.getElementById("precio-limite")?.value);

  const filtrosMoneda = ['vp', 'rp', 'radiant'];
  const filtrosSkin = ['vandal', 'spectre', 'guardian', 'phantom', 'sheriff', 'Operator', 'classic', 'cuchillos'];

  const contieneMonedas = subcategorias.some(sc => filtrosMoneda.includes(sc));
  const contieneSkins = subcategorias.some(sc => filtrosSkin.includes(sc));

  let filtrados = [];

  // Filtrar categoría general
  if (contieneMonedas && contieneSkins) {
    filtrados = productosGlobal.slice(); // todos
  } else if (contieneMonedas) {
    filtrados = productosGlobal.filter(p => p.categoria === 'moneda');
  } else if (contieneSkins) {
    filtrados = productosGlobal.filter(p => p.categoria === 'skin');
  } else {
    filtrados = productosGlobal.filter(p => p.categoria === categoriaActual);
  }

  // Aplicar subcategorías (generalizado para ambas)
  if (subcategorias.length > 0) {
    filtrados = filtrados.filter(p => {
      const pSub = (p.subcategoria || "").trim().toLowerCase();
      const nombreLower = p.nombre.toLowerCase().trim();
    
    return (
      subcategorias.includes(pSub) || // monedas
      subcategorias.some(sub => nombreLower.includes(sub)) // skins
    );
        });
  }

  if (!isNaN(precioLimite)) {
    filtrados = filtrados.filter(p => p.precio <= precioLimite);
  }

  if (orden === 'menor-mayor') {
    filtrados.sort((a, b) => a.precio - b.precio);
  } else if (orden === 'mayor-menor') {
    filtrados.sort((a, b) => b.precio - a.precio);
  }

  paginacionProductos(filtrados, mostrarProductos, true);
}


export function resetearFiltros() {
  // Desmarcar todos los checkboxes de subcategoría
  document.querySelectorAll("input[name='subcategoria']").forEach(cb => cb.checked = false);

  // Resetear orden de precio
  const orden = document.getElementById("orden-precio");
  if (orden) orden.value = "default";

  // Limpiar campo de precio máximo
  const precioLimite = document.getElementById("precio-limite");
  if (precioLimite) precioLimite.value = "";
}