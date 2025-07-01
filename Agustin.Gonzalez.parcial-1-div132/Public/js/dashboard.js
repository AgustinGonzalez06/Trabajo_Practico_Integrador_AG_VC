document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();

  const btnAgregar = document.getElementById("btnAgregar");
  btnAgregar.addEventListener("click", () => {
    window.location.href = "altaProducto.html"; // Redirige al formulario de alta
  });
});

async function cargarProductos() {
  try {
    const res = await fetch("/api/productos"); // Asegurate que esta ruta exista en backend
    if (!res.ok) throw new Error("Error al cargar productos");

    const productos = await res.json();
    renderizarProductos(productos);
  } catch (error) {
    console.error(error);
  }
}

function renderizarProductos(productos) {
  const contenedor = document.getElementById("listadoProductos");
  contenedor.innerHTML = "";

  productos.forEach(prod => {
    // Crea el div contenedor de cada producto
    const div = document.createElement("div");
    div.classList.add("producto");

    // Determina el estado
    const estado = prod.activo == 1 ? "Activo" : "Inactivo";

    // Renderiza el producto
    div.innerHTML = `
      <h3>${prod.nombre}</h3>
      <img src="${prod.img}" alt="${prod.nombre}" />
      <p>Precio: ${prod.precio}</p>
      <p>Tipo: ${prod.categoria} (${prod.subcategoria})</p>
      <p>Estado: ${estado}</p>
      <div class="acciones-producto">
        <button onclick="editarProducto(${prod.id})">Editar</button>
        ${prod.activo == 1 
          ? `<button onclick="eliminarProducto(${prod.id})">Eliminar</button>` 
          : `<button onclick="activarProducto(${prod.id})">Activar</button>`}
      </div>
    `;

    contenedor.appendChild(div);
  });
}

function editarProducto(id) {
  window.location.href = `editarProducto.html?id=${id}`;
}

function eliminarProducto(id) {
  if (confirm("¿Seguro que desea eliminar este producto?")) {
    fetch(`/api/productos/${id}`, {
      method: "DELETE"
    })
    .then(res => {
      if (!res.ok) throw new Error("Error al eliminar producto");
      alert("Producto eliminado correctamente");
      cargarProductos(); // Recarga la lista
    })
    .catch(err => console.error(err));
  }
}

// function activarProducto(id) {
//   if (confirm("¿Seguro que desea activar este producto?")) {
//     fetch(`/api/productos/${id}/activar`, {
//       method: "PATCH"
//     })
//     .then(res => {
//       if (!res.ok) throw new Error("Error al activar producto");
//       alert("Producto activado correctamente");
//       cargarProductos(); // Recarga la lista
//     })
//     .catch(err => console.error(err));
//   }
// }
