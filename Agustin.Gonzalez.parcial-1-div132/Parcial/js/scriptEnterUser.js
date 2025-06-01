
function login(event) {
  event.preventDefault(); 

  const inputUsuario = document.getElementById("nombre").value;

  if (inputUsuario) {
    window.location.href = "index.html";
  } else {
    
    alert("Ingrese su nombre");
  }
}
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginForm").addEventListener("submit", login);
});