import { initLogin } from './login.js';
import { inicializarEventos } from './eventos.js';

//si el login se completo, inicializa los eventos de la pagina
document.addEventListener("DOMContentLoaded", () => {
  const esLogin = initLogin();
  if (!esLogin) {
    inicializarEventos();
  }
});



// document.getElementById('btnAdmin').addEventListener('click', () => {
//   window.location.href = 'loginAdmin.html';
// });
