let skinsGlobal = [];
let carrito = [];

// Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Cargar la app
function init() {
  fetch("skins.json")
    .then(res => res.json())
    .then(skins => {
      skinsGlobal = skins;
      mostrarProductos(skinsGlobal);
    })
    .catch(error => {
      console.error("Error al cargar productos:", error);
    });

  // Cargar carrito guardado
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    renderizarCarrito();
  }

  // Abrir/cerrar menú carrito
  const cartButton = document.getElementById("cart-button");
  const cartDropdown = document.getElementById("cart-dropdown");

  cartButton.addEventListener("click", (event) => {
    event.stopPropagation(); // Evita que el click se propague y cierre el menú
    cartDropdown.classList.toggle("hidden");
  });

  // Cerrar menú si se clickea fuera del menú y del botón
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

// Mostrar productos en pantalla
function mostrarProductos(lista) {
  const container = document.querySelector(".product-grid");
  container.innerHTML = "";

  lista.forEach(skin => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${skin.img}" alt="${skin.nombre}">
      <h3>${skin.nombre}</h3>
      <p>$${skin.precio.toFixed(2)}</p>
      <button class="add-to-cart">Agregar a carrito</button>
    `;

    const boton = card.querySelector(".add-to-cart");
    boton.addEventListener("click", (event) => {
      event.stopPropagation(); // No cerrar menú al click
      agregarAlCarrito(skin);
    });

    container.appendChild(card);
  });
}

// Agrega producto al carrito, sumando cantidades si ya existe
function agregarAlCarrito(producto) {
  // Buscar si producto ya existe en carrito
  const existente = carrito.find(item => item.id === producto.id);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  guardarCarrito();
  renderizarCarrito();
}

// Renderizar carrito con cantidades
function renderizarCarrito() {
  const contenedor = document.getElementById("cart-items");
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
      event.stopPropagation(); // No cerrar menú al eliminar
      eliminarDelCarrito(index);
    });

    contenedor.appendChild(li);
  });

  actualizarTotal();
}

// Eliminar item completo del carrito
function eliminarDelCarrito(index) {
    if (index >= 0 && index < carrito.length) {
    if (carrito[index].cantidad > 1) {
      carrito[index].cantidad -= 1;
    } else {
      carrito.splice(index, 1); // Eliminar solo si queda 1 unidad
    }
  guardarCarrito();
  renderizarCarrito();
}
}

// Actualizar total
function actualizarTotal() {
  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  document.getElementById("total-price").textContent = `$${total.toFixed(2)}`;
}

// Inicializar app cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", init);
