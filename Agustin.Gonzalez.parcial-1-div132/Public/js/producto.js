let skinsGlobal = [];
let carrito = [];
let page = 1;
const limit = 2; // o el número que quieras mostrar por página


// async function cargarProductosDesdeBD() {
//   try {
//     const res = await fetch('/api/skins');
//     if (!res.ok) throw new Error(`Error ${res.status}`);
//     const skins = await res.json();
//     skinsGlobal = skins;
//     mostrarProductos(skinsGlobal);
//     mostrarCarruselDestacado(skinsGlobal);

//     const searchBar = document.getElementById("search-bar");
//     if (searchBar) searchBar.addEventListener("input", filtrarSkins);

//     const filtros = document.querySelectorAll("input[name='categoria'], input[name='rareza'], #precio-max");
//     filtros.forEach(f => f.addEventListener("input", aplicarFiltros));

//     const precioMaxSelect = document.getElementById("precio-max");
//     if (precioMaxSelect) precioMaxSelect.addEventListener("change", aplicarFiltros);

//   } catch (error) {
//     console.error("Error al cargar productos desde API:", error);
//   }
// }

async function cargarDatos() {
  try {
    let url = '';
    const pathname = window.location.pathname;

    if (pathname.endsWith('vp.html')) {
      url = `/api/monedas/paginacion?page=${page}&limit=${limit}`;
    } else if (pathname.endsWith('productos.html') || pathname.endsWith('/')) {
      url = `/api/skins/paginacion?page=${page}&limit=${limit}`;
    } else {
      console.warn('Página no soportada para cargar datos automáticamente');
      return;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error ${res.status}`);

    const datos = await res.json();

    if (url.includes('skins')) {
      skinsGlobal = datos;
      mostrarProductos(skinsGlobal);
      mostrarCarruselDestacado(skinsGlobal);

      const searchBar = document.getElementById("search-bar");
      if (searchBar) searchBar.addEventListener("input", filtrarSkins);

      const filtros = document.querySelectorAll("input[name='categoria'], input[name='rareza'], #precio-max");
      filtros.forEach(f => f.addEventListener("input", aplicarFiltros));

      const precioMaxSelect = document.getElementById("precio-max");
      if (precioMaxSelect) precioMaxSelect.addEventListener("change", aplicarFiltros);

    } else if (url.includes('monedas')) {
      mostrarMonedas(datos);
    }

  } catch (error) {
    console.error("Error al cargar datos desde API:", error);
  }
}

// Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function init() {
  console.log("JS cargado");
  cargarDatos();

  const pathname = window.location.pathname;
console.log("PATHNAME:", pathname);
  // --------- LOGIN PAGE ----------
  if (pathname === "/" || pathname.includes("loginUser")) {
    const loginForm = document.getElementById("loginForm");
    console.log("¿Encontró el formulario?", loginForm);
    
    if (loginForm) {
      loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        console.log("Formulario enviado");

        const inputUsuario = document.getElementById("nombre").value;

        if (inputUsuario) {
          console.log("Redirigiendo...");
          window.location.href = "productos.html";
        } else {
          const error = document.getElementById("errorMsg");
          if (error) {
            error.textContent = "Ingrese su nombre";
          } else {
            alert("Ingrese su nombre");
          }
        }
      });
    }
    return; // Detenemos ejecución para el resto de la app
  }

  // --------- PRODUCTOS Y CARRITO ----------
  const searchBar = document.getElementById("search-bar");
  let jsonUrl = "skins.json";

  if (pathname.includes("vp.html")) {
    jsonUrl = "vp.json";
  }

  // Cargar productos desde el JSON
  // fetch(jsonUrl)
  //   .then(res => res.json())
  //   .then(skins => {
  //     skinsGlobal = skins;
  //     mostrarProductos(skinsGlobal);
  //     mostrarCarruselDestacado(skinsGlobal);

  //     if (searchBar) {
  //       searchBar.addEventListener("input", filtrarSkins);
  //     }

  //     const filtros = document.querySelectorAll("input[name='categoria'], input[name='rareza'], #precio-max");
  //     filtros.forEach(f => f.addEventListener("input", aplicarFiltros));

  //     const precioMaxSelect = document.getElementById("precio-max");
  //     if (precioMaxSelect) {
  //       precioMaxSelect.addEventListener("change", aplicarFiltros);
  //     }
  //   })
  //   .catch(error => {
  //     console.error("Error al cargar productos:", error);
  //   });

  

  // Cargar carrito guardado
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    renderizarCarrito();
  }

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

  const logoDiv = document.querySelector(".logo");
  if (logoDiv) {
    logoDiv.addEventListener("click", () => {
      window.location.href = "MI.html";
    });
  }

  const btnVP = document.getElementById("btnVP");
  if (btnVP) {
    btnVP.addEventListener("click", () => {
      window.location.href = "vp.html";
    });
  }

  const btnSkins = document.getElementById("btnSkins");
  if (btnSkins) {
    btnSkins.addEventListener("click", () => {
      window.location.href = "productos.html";
    });
  }

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

// Mostrar productos en pantalla
function mostrarProductos(lista) {
  const container = document.querySelector(".product-grid");
  if (!container) return;

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
      event.stopPropagation();
      agregarAlCarrito(skin);
    });

    container.appendChild(card);
  });
}

function filtrarSkins() {
  const searchBar = document.getElementById("search-bar");
  if (!searchBar) return;

  const texto = searchBar.value.toLowerCase();
  if (texto.length < 3) {
    mostrarProductos(skinsGlobal);
    return;
  }

  const filtrados = skinsGlobal.filter(p => p.nombre.toLowerCase().includes(texto));
  mostrarProductos(filtrados);
}

function aplicarFiltros() {
  const searchBar = document.getElementById("search-bar");
  const texto = searchBar ? searchBar.value.toLowerCase() : "";

  const categoriasSeleccionadas = Array.from(document.querySelectorAll("input[name='categoria']:checked"))
    .map(cb => cb.value);

  const rarezasSeleccionadas = Array.from(document.querySelectorAll("input[name='rareza']:checked"))
    .map(cb => cb.value);

  const precioMaximoValor = document.getElementById("precio-max")?.value;

  let filtrados = skinsGlobal.filter(skin => {
    const coincideCategoria = categoriasSeleccionadas.includes(skin.categoria);
    const coincideRareza = rarezasSeleccionadas.includes(skin.rareza);
    const coincidePrecio = (precioMaximoValor === "Todos") || (skin.precio === +precioMaximoValor);
    const coincideTexto = texto.length < 3 || skin.nombre.toLowerCase().includes(texto);
    return coincideCategoria && coincideRareza && coincidePrecio && coincideTexto;
  });

  mostrarProductos(filtrados);
}

function agregarAlCarrito(producto) {
  const existente = carrito.find(item => item.id === producto.id);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  guardarCarrito();
  renderizarCarrito();
}

function renderizarCarrito() {
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

function eliminarDelCarrito(index) {
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

function actualizarTotal() {
  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const totalLabel = document.getElementById("total-price");
  if (totalLabel) {
    totalLabel.textContent = `$${total.toFixed(2)}`;
  }
}

function mostrarCarruselDestacado(lista) {
  const carrusel = document.getElementById("carousel-products");
  if (!carrusel) return;

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

