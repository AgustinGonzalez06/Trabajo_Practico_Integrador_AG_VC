import { agregarAlCarrito } from './carrito.js';
import { carrito, actualizarTotal } from './carrito.js';

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

export function mostrarCarruselDestacado(lista) {
  const carrusel = document.getElementById("carousel-products");
  if (!carrusel) return;

  carrusel.innerHTML = "";

  const destacados = lista.filter(p => p.destacado);
  if (destacados.length === 0) return;

  destacados.forEach(producto => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="product-card">
        <img src="${producto.img}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>$${producto.precio.toFixed(2)}</p>
        <button class="add-to-cart">Agregar a carrito</button>
      </div>
    `;

    const boton = li.querySelector(".add-to-cart");
    boton.addEventListener("click", (event) => {
      event.stopPropagation();
      agregarAlCarrito(producto);
    });

    carrusel.appendChild(li);
  });

  let currentIndex = 0;

  setInterval(() => {
    currentIndex = (currentIndex + 1) % destacados.length;
    carrusel.style.transform = `translateX(-${currentIndex * 100}%)`;
  }, 3000); // cada 3 segundos
}



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
