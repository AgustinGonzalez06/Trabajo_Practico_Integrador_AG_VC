// document.addEventListener('DOMContentLoaded', () => {
//   fetch('/api/productos/inactivos')
//     .then(res => {
//       if (res.status === 204) {
//         document.getElementById('lista-productos').textContent = 'No hay productos inactivos.';
//         return [];
//       }
//       if (!res.ok) throw new Error(`Error ${res.status}`);
//       return res.json();
//     })
//     .then(productos => {
//       const ul = document.getElementById('lista-productos');
//       productos.forEach(p => {
//         const li = document.createElement('li');
//         li.textContent = `${p.nombre} — $${p.precio} (ID: ${p.id})`;
//         ul.appendChild(li);
//       });
//     })
//     .catch(err => {
//       console.error(err);
//       alert('No se pudieron cargar los productos inactivos.');
//     });
// });


// eso de arriba es para los productos inactivos


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formAltaProducto");

  // Cambiar inputs según tipo seleccionado
  const radios = document.getElementsByName("tipoImg");
  radios.forEach(radio => {
    radio.addEventListener("change", toggleInputImagen);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    crearProducto();
  });
});

//  Mostrar u ocultar inputs según el tipo de imagen
function toggleInputImagen() {
  const tipoSeleccionado = document.querySelector("input[name='tipoImg']:checked").value;
  document.getElementById("inputUrl").style.display = tipoSeleccionado === "url" ? "block" : "none";
  document.getElementById("inputFile").style.display = tipoSeleccionado === "file" ? "block" : "none";
}

//  Crear producto
function crearProducto() {
    const tipoImg = document.querySelector("input[name='tipoImg']:checked").value;

if (tipoImg === "url") {
    //  Enviar como JSON con URL de imagen
    const nuevoProducto = {
    nombre: document.getElementById("nombre").value,
    precio: parseFloat(document.getElementById("precio").value),
    categoria: document.getElementById("categoria").value,
    subcategoria: document.getElementById("subcategoria").value,
    img: document.getElementById("imgUrl").value,
    activo: document.getElementById("activo").checked ? 1 : 0,
    destacado: document.getElementById("destacado").checked ? 1 : 0
    };

    fetch("/api/productos", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoProducto)
    })
        .then(res => {
        if (!res.ok) throw new Error("Error al crear producto");
        alert("Producto agregado correctamente");
        window.location.href = "dashboard.html";
        })
        .catch(err => console.error(err));

    } else {
    //  Enviar como FormData para subir archivo
    const formData = new FormData();
    formData.append("nombre", document.getElementById("nombre").value);
    formData.append("precio", document.getElementById("precio").value);
    formData.append("categoria", document.getElementById("categoria").value);
    formData.append("subcategoria", document.getElementById("subcategoria").value);
    formData.append("img", document.getElementById("imgFile").files[0]);
    formData.append("activo", document.getElementById("activo").checked ? 1 : 0);
    formData.append("destacado", document.getElementById("destacado").checked ? 1 : 0);

    fetch("/api/productos", {
        method: "POST",
        body: formData
    })
        .then(res => {
        if (!res.ok) throw new Error("Error al crear producto");
        alert("Producto agregado correctamente");
        window.location.href = "dashboard.html";
        })
        .catch(err => console.error(err));
    }
}
