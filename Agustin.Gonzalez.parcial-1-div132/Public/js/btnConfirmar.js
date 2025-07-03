// 1) Selecciono el botón
const btnConfirmar = document.getElementById("confirm-purchase-btn");

if (btnConfirmar) {
  btnConfirmar.addEventListener("click", confirmPurchase);
}

function confirmPurchase() {
  if (carrito.length === 0) {
    alert("No hay productos en el carrito.");
    return;
  }

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0).toFixed(2);

  const confirmMsg = `Vas a comprar ${carrito.length} artículo(s) por un total de $${total}.\n\n¿Querés continuar?`;
  if (!window.confirm(confirmMsg)) return;

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  if (!user) {
    alert("Debes iniciar sesión para comprar.");
    return;
  }

  fetch("/api/venta/comprar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      clienteNombre: user.nombre,
      productos: carrito.map(p => ({
        id: p.id,
        cantidad: p.cantidad,
        precio: p.precio
      }))
    }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.ventaId) {
        alert("¡Compra confirmada!");
        carrito = [];
        guardarCarrito();
        renderizarCarrito();
      } else {
        alert("Error al procesar la compra.");
      }
    })
    .catch(err => {
      console.error("Error:", err);
      alert("Hubo un problema con la compra.");
    });
}
