import { agregarAlCarrito } from './carrito.js';
import { carrito, actualizarTotal } from './carrito.js';
import { paginacionProductos } from './paginacion.js';


// Mostrar productos en la sección de productos
// Crea tarjetas de productos dinámicamente y agrega eventos para añadir al carrito
export function mostrarProductos(lista) {
  const container = document.querySelector(".product-grid");
  if (!container) return;

  container.innerHTML = "";

  lista.forEach(producto => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${producto.img}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>$${producto.precio.toFixed(2)}</p>
      <button class="add-to-cart">Agregar a carrito</button>
    `;

    const boton = card.querySelector(".add-to-cart");
    boton.addEventListener("click", (event) => {
      event.stopPropagation();
      agregarAlCarrito(producto);
    });

    container.appendChild(card);
  });
}


// Renderizar el carrito en la página
// Limpia el contenedor y muestra cada producto con su cantidad y precio
export function renderizarResumenCarrito() {
  const contenedor = document.querySelector('.resumen-carrito');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>No hay productos en el carrito.</p>";
    return;
  }

  carrito.forEach(producto => {
    const div = document.createElement('div');
    div.classList.add('resumen-item');
    div.innerHTML = `
      <p>${producto.nombre} x${producto.cantidad} - $${(producto.precio * producto.cantidad).toFixed(2)}</p>
    `;
    contenedor.appendChild(div);
  });

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const totalDiv = document.createElement('div');
  totalDiv.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
  contenedor.appendChild(totalDiv);
}
