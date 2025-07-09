//cambia el tema de la página entre claro y oscuro, guardando la preferencia en localStorage
// y aplicando el CSS correspondiente

function aplicarTemaCSS(tema) {
  const linkTema = document.getElementById('temaCSS');
  if (tema === 'oscuro') {
    linkTema.href = '/css/stylesProd.css';
    document.getElementById("iconoTema").textContent = "light_mode";
  } else {
    linkTema.href = '/css/stylesProdclaro.css';
    document.getElementById("iconoTema").textContent = "dark_mode";
  }
  localStorage.setItem("tema", tema);
}

document.addEventListener("DOMContentLoaded", () => {
  const temaGuardado = localStorage.getItem("tema");
  aplicarTemaCSS(temaGuardado === 'oscuro' ? 'oscuro' : 'claro');

  const btnTema = document.getElementById("btnTema");
  const iconoTema = document.getElementById("iconoTema");

  if (btnTema && iconoTema) {
    btnTema.addEventListener("click", () => {
      const temaActual = localStorage.getItem("tema");
      const nuevoTema = temaActual === "oscuro" ? "claro" : "oscuro";
      aplicarTemaCSS(nuevoTema);
    });
  }
});