/*  
    Instrucciones del Parcial

    - Responde los puntos en orden.
    - Se valorará:
        * Código limpio
        * Comentarios claros
        * Separación en bloques funcionales
        * Buen uso de funciones/modularización

    IMPORTANTE:
    - El trabajo debe desarrollarse utilizando buenas prácticas de programación en JavaScript.
*/

/*  
    Punto 1 _________________________

    Este parcial consiste en crear el frontend de una tienda de frutas.
    Para ello ya se dispone del HTML y deberás programar el JavaScript necesario.

    1. Almacena tus datos personales (nombre, apellido, DNI) en un objeto y:
        - Imprime tu nombre y apellido en la etiqueta del <nav> (donde corresponda).
        - Imprímelo también en la consola.
*/

/*  
    Punto 2 _________________________

    Simula la carga de datos desde un archivo `db.json`. Este debe tener objetos con esta estructura:
    {
        "id": 1,
        "nombre": "arandano",
        "precio": 5000,
        "img": "img/arandano.jpg"
    }
*/

/*  
    Punto 3 _________________________

    Imprime los productos en pantalla al cargar la página.
    Agrega esta funcionalidad dentro de la función `init()`.

    El HTML que debes agregar por cada producto es el siguiente:

        <div class="product-card">
            <img src="ruta" alt="nombre">
            <h3>Nombre del producto</h3>
            <p>$Precio</p>
            <button class="add-to-cart">Agregar a carrito</button>
        </div>
*/

/*  
    Punto 4 _________________________

    Crea la función `filtro()` para filtrar los productos por nombre.
    - Asocia esta función al evento `keyup` de un campo `<input>`.
    - Cada vez que se escriba una letra, deben mostrarse solo los productos que coincidan con el texto ingresado.
*/

/*  
    Punto 5 _________________________

    Agrega la funcionalidad de carrito:
    - Crea un array `carrito` que almacene los productos seleccionados.
    - Al presionar “Agregar a carrito”, el producto debe aparecer en el listado con id `cart-items`.

    El HTML del carrito debe tener el siguiente formato:

        <li class="item-block">
            <p class="item-name">nombreproducto - $precioproducto</p>
            <button class="delete-button">Eliminar</button>
        </li>
*/

/*  
    Punto 6 _________________________

    Guarda los productos del carrito en `localStorage`.
    - Asegúrate de que al recargar la página el carrito se recupere automáticamente desde `localStorage`.
*/

function init() {
   // 1
  const datosPersonales = {
    nombre: "Agustín",
    apellido: "González",
    dni: "47311100"
  };

  const productGrid = document.querySelector(".product-grid");
  const nombreAlumno = document.querySelector(".nombreAlumno");
  const searchBar = document.querySelector(".search-bar");
  const cartCount = document.getElementById("cart-count");
  const cartItemsContainer = document.getElementById("cart-items");
  const totalPriceSpan = document.getElementById("total-price");

  let productos = [];
  let carrito = [];

  // Mostrar datos personales en navbar y consola
  function mostrarDatosPersonales() {
    nombreAlumno.textContent = `${datosPersonales.nombre} ${datosPersonales.apellido}`;
    console.log(`Alumno: ${datosPersonales.nombre} ${datosPersonales.apellido}`);
  }

  // 2 Cargar productos desde db.json simulando fetch
  async function cargarProductos() {
    try {
      const response = await fetch("db.json");
      productos = await response.json();
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  }

  //3  Renderizar productos en pantalla
  function renderizarProductos(productosAMostrar) {
    productGrid.innerHTML = "";
    if (productosAMostrar.length === 0) {
      productGrid.innerHTML = "<p>No se encontraron productos.</p>";
      return;
    }
    productosAMostrar.forEach(producto => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.innerHTML = `
        <img src="${producto.img}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>$${producto.precio}</p>
        <button class="add-to-cart" data-id="${producto.id}">Agregar a carrito</button>
      `;
      productGrid.appendChild(productCard);
    });
  }

  //5 Actualizar contador carrito
  function actualizarContador() {
    cartCount.textContent = carrito.length;
  }

  //5 Actualizar carrito en pantalla
  function renderizarCarrito() {
    cartItemsContainer.innerHTML = "";
    if (carrito.length === 0) {
      cartItemsContainer.innerHTML = "<p>No hay elementos en el carrito.</p>";
      totalPriceSpan.textContent = "$0.00";
      return;
    }

    carrito.forEach((producto, index) => {
      const li = document.createElement("li");
      li.classList.add("item-block");
      li.innerHTML = `
        <p class="item-name">${producto.nombre} - $${producto.precio}</p>
        <button class="delete-button" data-index="${index}">Eliminar</button>
      `;
      cartItemsContainer.appendChild(li);
    });

    //5  Actualizar total
    const total = carrito.reduce((acc, prod) => acc + prod.precio, 0);
    totalPriceSpan.textContent = `$${total.toFixed(2)}`;
  }

  //6 Guardar carrito en localStorage
  function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  //6 Cargar carrito desde localStorage
  function cargarCarrito() {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
      carrito = JSON.parse(carritoGuardado);
    }
  }

  //5 Función para agregar producto al carrito
  function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
      carrito.push(producto);
      actualizarContador();
      renderizarCarrito();
      guardarCarrito();
    }
  }

  //5 Función para eliminar producto del carrito por índice
  function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarContador();
    renderizarCarrito();
    guardarCarrito();
  }

  // 4 Filtro productos por nombre
  function filtro() {
    const texto = searchBar.value.toLowerCase();
    const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(texto));
    renderizarProductos(filtrados);
  }

  // Eventos
  function agregarEventos() {
    // Evento para agregar productos al carrito
    productGrid.addEventListener("click", (e) => {
      if (e.target.classList.contains("add-to-cart")) {
        const id = Number(e.target.dataset.id);
        agregarAlCarrito(id);
      }
    });

    // Evento para eliminar productos del carrito
    cartItemsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-button")) {
        const index = Number(e.target.dataset.index);
        eliminarDelCarrito(index);
      }
    });

    // 4 Evento para el filtro input
    searchBar.addEventListener("keyup", filtro);
  }

  // Función principal
  async function main() {
    mostrarDatosPersonales();
    cargarCarrito();
    await cargarProductos();
    renderizarProductos(productos);
    renderizarCarrito();
    actualizarContador();
    agregarEventos();
  }

  main();
}

init();
