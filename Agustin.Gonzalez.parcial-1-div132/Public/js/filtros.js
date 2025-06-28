import { mostrarProductos } from './ui.js';
import { productosGlobal } from './api.js';

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
  const searchBar = document.getElementById("search-bar");
  const texto = searchBar ? searchBar.value.toLowerCase() : "";

  const categoriasSeleccionadas = Array.from(document.querySelectorAll("input[name='categoria']:checked"))
    .map(cb => cb.value);

  const rarezasSeleccionadas = Array.from(document.querySelectorAll("input[name='rareza']:checked"))
    .map(cb => cb.value);

  const precioMaximoValor = document.getElementById("precio-max")?.value;

  let filtrados = productosGlobal.filter(producto => {
    const coincideCategoria = categoriasSeleccionadas.includes(producto.categoria);
    const coincideRareza = rarezasSeleccionadas.includes(producto.subcategoria); // Asegurate que usás el campo correcto
    const coincidePrecio = (precioMaximoValor === "Todos") || (producto.precio === +precioMaximoValor);
    const coincideTexto = texto.length < 3 || producto.nombre.toLowerCase().includes(texto);
    return coincideCategoria && coincideRareza && coincidePrecio && coincideTexto;
  });

  mostrarProductos(filtrados);
}
