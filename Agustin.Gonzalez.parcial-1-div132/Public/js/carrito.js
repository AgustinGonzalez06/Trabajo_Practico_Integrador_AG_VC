export let carrito = [];

export function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

export function cargarCarrito() {
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
  }
  return carrito;
}

export function agregarAlCarrito(producto) {
  const existente = carrito.find(item => item.id === producto.id);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  guardarCarrito();
  renderizarCarrito();
}

export function eliminarDelCarrito(index) {
  if (index >= 0 && index < carrito.length) {
    if (carrito[index].cantidad > 1) {
      carrito[index].cantidad -= 1;
    } else {
      carrito.splice(index, 1);
    }
    guardarCarrito();
    renderizarCarrito();
  }
}

export function actualizarTotal() {
  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const totalLabel = document.getElementById("total-price");
  if (totalLabel) {
    totalLabel.textContent = `$${total.toFixed(2)}`;
  }
}

export function renderizarCarrito() {
  const contenedor = document.getElementById("cart-items");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>No hay elementos en el carrito.</p>";
    actualizarTotal();
    return;
  }

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.classList.add("item-block");
    li.innerHTML = `
      <p class="item-name">${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}</p>
      <button class="delete-button">Eliminar</button>
    `;

    const btnEliminar = li.querySelector(".delete-button");
    btnEliminar.addEventListener("click", (event) => {
      event.stopPropagation();
      eliminarDelCarrito(index);
    });

    contenedor.appendChild(li);
  });

  actualizarTotal();
}
