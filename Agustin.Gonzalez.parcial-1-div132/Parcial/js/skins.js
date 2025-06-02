let skinsGlobal = [];
let carrito = [];
//punto 6
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}
// Función inicializadora
function init() {
  // Aquí deben invocarse todas las funciones necesarias para que la aplicación comience a funcionar
    // cargar productos
    fetch("skins.json")
        .then(res => res.json())
        .then(skins => {
            skinsGlobal = skins;
            mostrarProductos(skinsGlobal);
        })
        .catch(error => {
            console.error("Error al cargar productos:", error);
        });

    document.querySelector(".search-bar").addEventListener("keyup", filtro);

    // cargar carrito punto 6
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        renderizarCarrito();
    }
}

//punto 3
function mostrarProductos(lista) {
    const container = document.querySelector(".product-grid"); // contenedor de productos
    container.innerHTML = ""; // limpiar contenedor

    lista.forEach(skin => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <img src="${skin.img}" alt="${skin.nombre}">
            <h3>${skin.nombre}</h3>
            <p>$${skin.precio}</p>
            <button class="add-to-cart">Agregar a carrito</button>
        `;

        // agregar al carrito
        const boton = card.querySelector(".add-to-cart");
        boton.addEventListener("click", () => agregarAlCarrito(skin));

        container.appendChild(card);
    });
}

//punto 4
function filtro(e) {
    const texto = e.target.value.toLowerCase();
    const filtradas = frutasGlobal.filter(fruta =>
        fruta.nombre.toLowerCase().includes(texto)
    );
    mostrarProductos(filtradas);
}

// punto 5
function agregarAlCarrito(producto) {
    carrito.push(producto);
    guardarCarrito();
    renderizarCarrito();
}


function renderizarCarrito() {
    const contenedor = document.getElementById("cart-items");
    contenedor.innerHTML = ""; // limpiar contenedro
    if (carrito.length === 0) {
        contenedor.innerHTML = "<p>No hay elementos en el carrito.</p>";
        actualizarTotal();
        return;
    }

    const ul = document.createElement("ul");

    carrito.forEach((item, index) => {
        const li = document.createElement("li");
        li.classList.add("item-block");

        li.innerHTML = `
            <p class="item-name">${item.nombre} - $${item.precio}</p>
            <button class="delete-button">Eliminar</button>
        `;

        li.querySelector(".delete-button").addEventListener("click", () => {
            eliminarDelCarrito(index);
        });

        ul.appendChild(li);
    });

    contenedor.appendChild(ul);
    actualizarTotal();
}


function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    renderizarCarrito();
}

function actualizarTotal() {
    const total = carrito.reduce((sum, item) => sum + item.precio, 0);
    document.getElementById("total-price").textContent = `$${total.toFixed(2)}`;
    document.getElementById("cart-count").textContent = carrito.length;
}


document.addEventListener("DOMContentLoaded", init);