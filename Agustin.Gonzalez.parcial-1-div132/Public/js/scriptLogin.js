const usuarios = [
  { usuario: "agustin", contraseña: "1234" },
  { usuario: "maria", contraseña: "abcd" },
  { usuario: "juan", contraseña: "pass123" }
];

function login(event) {
  event.preventDefault(); 

  const inputUsuario = document.getElementById("usuario").value;
  const inputContraseña = document.getElementById("contraseña").value;

  
  const usuarioValido = usuarios.find(u => 
    u.usuario === inputUsuario && u.contraseña === inputContraseña
  );

  if (usuarioValido) {
    window.location.href = "MI.html";
  } else {
    
    alert("Usuario o contraseña incorrectos");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginForm").addEventListener("submit", login);
});