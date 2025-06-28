export function initLogin() {
  const pathname = window.location.pathname;
  if (pathname === "/" || pathname.includes("loginUser")) {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const inputUsuario = document.getElementById("nombre").value;
        if (inputUsuario) {
          window.location.href = "productos.html";
        } else {
          alert("Ingrese su nombre");
        }
      });
    }
    return true;  // Indica que estamos en la página de login
  }
  return false; // No es la página login
}