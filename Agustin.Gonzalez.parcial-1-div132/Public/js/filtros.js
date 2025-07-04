import { mostrarProductos, mostrarCarruselDestacado } from './ui.js';
import { productosGlobal } from './api.js';
import {categoriaActual} from './eventos.js';

export function filtrarProductosPorTexto() {
  const searchBar = document.getElementById("search-bar");
  if (!searchBar) return;

  const texto = searchBar.value.toLowerCase();
  if (texto.length < 3) {
    mostrarProductos(productosGlobal);
    return;
  }

  const filtrados = productosGlobal.filter(p => p.nombre.toLowerCase().includes(texto));
  mostrarProductos(filtrados);
}


export function aplicarFiltros() {
  const subcategorias = Array.from(document.querySelectorAll("input[name='subcategoria']:checked"))
    .map(cb => cb.value.toLowerCase());

  const orden = document.getElementById("orden-precio")?.value || "default";
  const precioLimite = parseFloat(document.getElementById("precio-limite")?.value);

  // Usamos categoriaActual global en lugar de detectar categoría por filtros
  let categoriaFiltrar = categoriaActual;

  // Si hay filtros de subcategoría, validamos que la categoría corresponda con el filtro
  const filtrosMoneda = ['vp', 'rp', 'radiant'];
  const filtrosSkin = ['vandal', 'spectre', 'guardian', 'phantom', 'sheriff', 'operator', 'classic', 'cuchillos'];

  if (subcategorias.length > 0) {
    if (subcategorias.some(sc => filtrosMoneda.includes(sc))) {
      categoriaFiltrar = 'moneda';
    } else if (subcategorias.some(sc => filtrosSkin.includes(sc))) {
      categoriaFiltrar = 'skin';
    }
  }

  // Filtrar productos por categoria actual
  let filtrados = productosGlobal.filter(p => p.categoria === categoriaFiltrar);

  // Filtrar por subcategoría solo si hay filtros
  if (subcategorias.length > 0) {
    filtrados = filtrados.filter(p => {
      if (categoriaFiltrar === 'moneda') {
        const pSub = (p.subcategoria || "").trim().toLowerCase();
        return subcategorias.includes(pSub);
      } else {
        const nombreLower = p.nombre.toLowerCase().trim();
        return subcategorias.some(sub => nombreLower.startsWith(sub));
      }
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

  mostrarProductos(filtrados);
  mostrarCarruselDestacado(filtrados);
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