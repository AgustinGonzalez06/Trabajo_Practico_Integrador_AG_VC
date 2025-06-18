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

  // 2) Mostrar resumen de la compra 
  const total = carrito
    .reduce((sum, item) => sum + item.precio * item.cantidad, 0)
    .toFixed(2);

  const confirmMsg = `Vas a comprar ${carrito.length} artículo(s) por un total de $${total}.\n\n¿Querés continuar?`;
  if (!window.confirm(confirmMsg)) {
    return; // si el usuario cancela, no sigue
  }


  // Simulamos un delay 
  setTimeout(() => {
    //  1) Guardardamos los productos comprados en el usuario (localStorage)
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);

      // Si no tiene productos aún, crear el array
      if (!user.productos) {
        user.productos = [];
      }

      // Agregar los productos del carrito al usuario
      user.productos = user.productos.concat(carrito);

      // Actualizar el user en localStorage
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      console.warn("No se encontró usuario en localStorage.");
    }

    // 2) Vaciar carrito
    carrito = [];
    guardarCarrito();
    renderizarCarrito();

    //  3) Confirmación
    alert("¡Compra confirmada! Gracias por tu compra.");
  }, 500);
}