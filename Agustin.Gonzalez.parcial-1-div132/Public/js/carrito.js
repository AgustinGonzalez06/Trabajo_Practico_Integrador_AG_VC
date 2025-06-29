export let carrito = [];

export function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

export function cargarCarrito() {
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
  } else {
    carrito = [];
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

// Renderizar resumen carrito para carrito.html con botones + y -
export function renderizarResumenCarrito() {
  const contenedor = document.getElementById("resumen-compra");
  const totalLabel = document.getElementById("total-price");
  if (!contenedor || !totalLabel) return;

  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>No hay productos en el carrito.</p>";
    totalLabel.textContent = "$0.00";
    return;
  }

  let total = 0;

  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;

    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${item.img}" alt="${item.nombre}">
      <h3>${item.nombre}</h3>
      <p>Precio: $${item.precio.toFixed(2)}</p>
      <div class="cantidad-control">
        <button class="btn-restar" ${item.cantidad === 1 ? "disabled" : ""} title="Restar cantidad">-</button>
        <span>${item.cantidad}</span>
        <button class="btn-sumar" title="Sumar cantidad">+</button>
      </div>
      <p>Subtotal: $${subtotal.toFixed(2)}</p>
      <button class="btn-eliminar" title="Eliminar producto">Eliminar</button>
    `;

    // Sumar cantidad
    card.querySelector(".btn-sumar").addEventListener("click", () => {
      item.cantidad += 1;
      guardarCarrito();
      renderizarResumenCarrito();
    });

    // Restar cantidad (solo si > 1)
    card.querySelector(".btn-restar").addEventListener("click", () => {
      if (item.cantidad > 1) {
        item.cantidad -= 1;
        guardarCarrito();
        renderizarResumenCarrito();
      }
    });

    // Eliminar completamente
    card.querySelector(".btn-eliminar").addEventListener("click", () => {
      carrito.splice(index, 1);
      guardarCarrito();
      renderizarResumenCarrito();
    });

    contenedor.appendChild(card);
  });

  totalLabel.textContent = `$${total.toFixed(2)}`;
}


export function actualizarTotalResumen() {
  const totalLabel = document.getElementById("total-compra");
  if (!totalLabel) return;

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  totalLabel.textContent = `$${total.toFixed(2)}`;
}

// Función para finalizar compra
export function finalizarCompra() {
  if (carrito.length === 0) {
    alert("El carrito está vacío.");
    return;
  }
  alert(`Gracias por tu compra! Total: $${carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0).toFixed(2)}`);
  carrito = [];
  guardarCarrito();
  renderizarResumenCarrito();
}
