import { initLogin } from './login.js';
import { inicializarEventos } from './eventos.js';

document.addEventListener("DOMContentLoaded", () => {
  const esLogin = initLogin();
  if (!esLogin) {
    inicializarEventos();
  }
});

// document.getElementById('btnAdmin').addEventListener('click', () => {
//   window.location.href = 'loginAdmin.html';
// });
