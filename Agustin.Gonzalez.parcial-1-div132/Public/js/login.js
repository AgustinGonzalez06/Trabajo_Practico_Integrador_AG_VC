export function initLogin() {
  const pathname = window.location.pathname;
  if (pathname === "/" || pathname.includes("loginUser")) {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const inputUsuario = document.getElementById("nombre").value.trim();
        const errorMsg = document.getElementById("errorMsg");
        if (inputUsuario) {
          errorMsg.textContent = "";
          localStorage.setItem("user", JSON.stringify({ nombre: inputUsuario }));
          window.location.href = "productos.html";
        } else {
          errorMsg.textContent = "Ingrese su nombre";
        }
      });
    }
    return true;  // Indica que estamos en la página de login
  }
  return false; // No es la página login
}
