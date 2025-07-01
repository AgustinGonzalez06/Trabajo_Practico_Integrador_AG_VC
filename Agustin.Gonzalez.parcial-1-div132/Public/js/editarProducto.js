document.addEventListener("DOMContentLoaded", () => {
  const id = obtenerIdDesdeUrl();
  if (id) {
    obtenerProducto(id);
  }

  const form = document.getElementById("formEditarProducto");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    actualizarProducto(id);
  });
});

//  Obtener ID desde URL
function obtenerIdDesdeUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

//  Traer producto por ID
function obtenerProducto(id) {
  fetch(`/api/productos/${id}`)
    .then(res => {
      if (!res.ok) throw new Error("No se pudo obtener el producto");
      return res.json();
    })
    .then(producto => cargarFormulario(producto))
    .catch(err => console.error(err));
}

//  Cargar datos en el formulario
function cargarFormulario(producto) {
  document.getElementById("nombre").value = producto.nombre;
  document.getElementById("precio").value = producto.precio;
  document.getElementById("categoria").value = producto.categoria;
  document.getElementById("subcategoria").value = producto.subcategoria;
  document.getElementById("img").value = producto.img;
  document.getElementById("activo").checked = producto.activo == 1;
  document.getElementById("destacado").checked = producto.destacado == 1;
}

//  Actualizar producto en el backend
function actualizarProducto(id) {
  const productoActualizado = {
    nombre: document.getElementById("nombre").value,
    precio: parseFloat(document.getElementById("precio").value),
    categoria: document.getElementById("categoria").value,
    subcategoria: document.getElementById("subcategoria").value,
    img: document.getElementById("img").value,
    activo: document.getElementById("activo").checked ? 1 : 0,
    destacado: document.getElementById("destacado").checked ? 1 : 0
  };

  fetch(`/api/productos/${id}`, {
    method: "PUT", // o PATCH si tu ruta es patch
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(productoActualizado)
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al actualizar producto");
      alert("Producto actualizado correctamente");
      window.location.href = "dashboard.html"; // Redirige al dashboard
    })
    .catch(err => console.error(err));
}
