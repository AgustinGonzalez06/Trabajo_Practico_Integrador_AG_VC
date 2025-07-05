export function aplicarTemaCSS(opcion) {
  const linkTema = document.getElementById("temaCSS");

  if (opcion === "oscuro") {
    linkTema.setAttribute("href", "css/stylesProd.css");
    localStorage.setItem("tema", "oscuro");
  } else if (opcion === "claro") {
    linkTema.setAttribute("href", "claro.css");
    localStorage.setItem("tema", "claro");
  }

  // Oculta el menú después de elegir
  const menu = document.getElementById("menuTema");
  menu.classList.add("hidden");
}