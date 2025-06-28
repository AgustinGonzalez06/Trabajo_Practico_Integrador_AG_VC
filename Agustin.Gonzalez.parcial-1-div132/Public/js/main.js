import { initLogin } from './login.js';
import { inicializarEventos } from './eventos.js';

document.addEventListener("DOMContentLoaded", () => {
  const esLogin = initLogin();
  if (!esLogin) {
    inicializarEventos();
  }
});