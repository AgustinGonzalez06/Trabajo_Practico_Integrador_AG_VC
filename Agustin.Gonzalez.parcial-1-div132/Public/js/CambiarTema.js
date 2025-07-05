export function aplicarTemaCSS(nuevoTema) {
  const linkTema = document.getElementById("temaCSS");
  const icono = document.getElementById("iconoTema");
  const iconoBuscar = document.getElementById("search-toggle");
  const iconoCarrito = document.querySelector('#cart-button img');

  // Detectar la página para elegir base del css
  const pathname = window.location.pathname;
  let baseCssPath = "";

  if (pathname.includes("productos.html")) {
    baseCssPath = "css/stylesProd";
  } else if (pathname.includes("carrito.html")) {
    baseCssPath = "css/carrito";
  } else {
    // Por si usas otras páginas, poner un css por defecto
    baseCssPath = "css/stylesProd";
  }

  if (nuevoTema === "oscuro") {
    linkTema.setAttribute("href", `${baseCssPath}.css`);
    localStorage.setItem("tema", "oscuro");

    if (icono) icono.textContent = "light_mode";
    if (iconoBuscar) iconoBuscar.src = "img/buscarClaro.svg";
    if (iconoCarrito) iconoCarrito.src = "img/carritoClaro.svg";
  } else {
    linkTema.setAttribute("href", `${baseCssPath}Claro.css`);
    localStorage.setItem("tema", "claro");

    if (icono) icono.textContent = "dark_mode";
    if (iconoBuscar) iconoBuscar.src = "img/buscarOscuro.svg";
    if (iconoCarrito) iconoCarrito.src = "img/CarritoOscuro.svg";
  }
}
