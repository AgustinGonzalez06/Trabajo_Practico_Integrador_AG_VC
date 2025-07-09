const params = new URLSearchParams(window.location.search);
const ventaId = params.get("ventaId");


// Inicia un temporizador de 30 segundos para salir automáticamente
// Si el usuario no interactúa con la página en ese tiempo, se redirige a la página principal
// y se eliminan los datos del usuario y carrito de localStorage.
function iniciarTemporizador(duracion) {
  const timerElement = document.getElementById("timer");
  let tiempo = duracion;

  const intervalo = setInterval(() => {
    timerElement.textContent = tiempo;
    tiempo--;

    if (tiempo < 0) {
      clearInterval(intervalo);
      salir(); // Llama la función para salir automáticamente
    }
  }, 1000);
}


// Función para salir del ticket y redirigir al usuario a la página principal
// y eliminar los datos del usuario y carrito de localStorage.
function salir() {
  //Elimina el usuario y otros datos de localStorage
  localStorage.removeItem("user");
  localStorage.removeItem("carrito"); // si guardas carrito

  // Redirige a http://localhost:5000/
  window.location.href = "http://localhost:5000";
}

if (!ventaId) {
  alert("No se encontró el ticket.");
  window.location.href = "productos.html";
}

// Carga el ticket desde el servidor y muestra los detalles en la página
// Si el ticket no existe o está vacío, redirige al usuario a la página de productos
async function cargarTicket() {
  try {
    const res = await fetch(`/tickets/${ventaId}`);
    const data = await res.json();

    if (!data || data.length === 0) {
      alert("El ticket no existe o está vacío.");
      window.location.href = "productos.html";
      return;
    }

    const userObj = JSON.parse(localStorage.getItem("user"));
    const usuario = userObj ? userObj.nombre : "Cliente";

    let total = 0;

    const fecha = data[0].fecha;
    const ventaID = data[0].venta_id;
    
    const container = document.getElementById("ticketContainer");
    container.innerHTML = 
    `<p><strong>ValorantTienda</strong></p>
    <p><strong>Cliente:</strong> ${usuario}</p>
    <p><strong>Venta ID:</strong> ${ventaID}</p>
    <p><strong>fecha :</strong> ${fecha}</p>
    <table border="1" cellspacing="0" cellpadding="5">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio Unitario</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(item => {
            total += Number(item.subtotal) || 0;
            return `
              <tr>
                <td>${item.producto}</td>
                <td>$${Number(item.precio_unitario).toFixed(2)}</td>
                <td>${item.cantidad}</td>
                <td>$${Number(item.subtotal).toFixed(2)}</td>
              </tr>
            `;
            }).join("")}
        </tbody>
      </table>
      <h3>Total: $${total.toFixed(2)}</h3>`;
  } catch (error) {
    console.error("Error cargando ticket:", error);
  }
}


// Función para descargar el ticket como PDF
// Utiliza la librería html2pdf para convertir el contenido del ticket a PDF
function descargarPDF() {
  const ticket = document.getElementById("ticketContainer");
  html2pdf()
    .set({
      margin: 0.5,
      filename: "ticket.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    })
    .from(ticket)
    .save();
}

document.addEventListener("DOMContentLoaded", () => {
  cargarTicket();

  const botonPDF = document.getElementById("btnPDF");
  if (botonPDF) botonPDF.addEventListener("click", descargarPDF);

  const botonSalir = document.getElementById("btnSalir");
  if (botonSalir) botonSalir.addEventListener("click", salir);


  iniciarTemporizador(30);
});