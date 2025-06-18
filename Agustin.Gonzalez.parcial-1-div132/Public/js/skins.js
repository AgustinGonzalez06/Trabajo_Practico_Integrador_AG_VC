let skinsGlobal = [];
let carrito = [];
const searchBar = document.getElementById("search-bar");

// Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}


// Cargar la app
function init() {
  let jsonUrl = "skins.json"; // Por defecto

  const pathname = window.location.pathname;

  // Detectar la página y ajustar el JSON a cargar
  if (pathname.includes("vp.html")) {
    jsonUrl = "vp.json";
  } else if (pathname.includes("skins.html")) {
    jsonUrl = "skins.json";
  }

  // Cargar los datos
  fetch(jsonUrl)
    .then(res => res.json())
    .then(skins => {
      skinsGlobal = skins;
      mostrarProductos(skinsGlobal);
      mostrarCarruselDestacado(skinsGlobal);
      searchBar.addEventListener("input", filtrarSkins);
      const filtros = document.querySelectorAll("input[name='categoria'], input[name='rareza'], #precio-max");
      filtros.forEach(f => f.addEventListener("input", aplicarFiltros));

      const precioMaxSelect = document.getElementById("precio-max");
      precioMaxSelect.addEventListener("change", aplicarFiltros);
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
  
  const logoDiv = document.querySelector(".logo");
  logoDiv.addEventListener("click", () => {
  window.location.href = "MI.html"; // o "/" si es el inicio
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

  // Mostrar/ocultar input de búsqueda al hacer clic en el ícono
  const searchIcon = document.getElementById("search-toggle");
  const searchContainer = document.querySelector(".search-container");

  if (searchIcon && searchContainer) {
    searchIcon.addEventListener("click", () => {
      searchContainer.classList.toggle("active");
      const input = document.getElementById("search-bar");
      if (searchContainer.classList.contains("active")) {
        input.focus();
      }
    });

    document.addEventListener("click", (e) => {
      if (!searchContainer.contains(e.target) && e.target !== searchIcon) {
        searchContainer.classList.remove("active");
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

function filtrarSkins() {
  const texto = searchBar.value.toLowerCase();

if (texto.length < 3) {
    mostrarProductos(skinsGlobal);
    return;
  }
  const filtrados = skinsGlobal.filter(p => p.nombre.toLowerCase().includes(texto));
  mostrarProductos(filtrados);
}

function aplicarFiltros() {
  const texto = searchBar.value.toLowerCase();

  const categoriasSeleccionadas = Array.from(document.querySelectorAll("input[name='categoria']:checked"))
    .map(cb => cb.value);

  const rarezasSeleccionadas = Array.from(document.querySelectorAll("input[name='rareza']:checked"))
    .map(cb => cb.value);

  const precioMaximoValor = document.getElementById("precio-max").value;

  let filtrados = skinsGlobal.filter(skin => {
    const coincideCategoria = categoriasSeleccionadas.includes(skin.categoria);
    const coincideRareza = rarezasSeleccionadas.includes(skin.rareza);
    const coincidePrecio = (precioMaximoValor === "Todos") || (skin.precio === +precioMaximoValor);
    const coincideTexto = texto.length < 3 || skin.nombre.toLowerCase().includes(texto);
    return coincideCategoria && coincideRareza && coincidePrecio && coincideTexto;
  });

  mostrarProductos(filtrados);
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
function mostrarCarruselDestacado(lista) {
  const carrusel = document.getElementById("carousel-products");
  carrusel.innerHTML = "";

  const destacados = lista.slice(0, 4);

  destacados.forEach(skin => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="product-card">
        <img src="${skin.img}" alt="${skin.nombre}">
        <h3>${skin.nombre}</h3>
        <p>$${skin.precio.toFixed(2)}</p>
        <button class="add-to-cart">Agregar a carrito</button>
      </div>
    `;

    const boton = li.querySelector(".add-to-cart");
    boton.addEventListener("click", (event) => {
      event.stopPropagation();
      agregarAlCarrito(skin);
    });

    carrusel.appendChild(li);
  });
}

btnVP.addEventListener("click", () => {
    window.location.href = "/vp";
});


btnSkins.addEventListener("click", () => {
    window.location.href = "/skins";
});
// Inicializar app cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", init);
