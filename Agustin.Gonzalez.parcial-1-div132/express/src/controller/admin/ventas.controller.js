// ventas.controller.js
import { obtenerVentas } from '../../services/admin/ventas.services.js';

export const renderListaVentas = async (req, res) => {
  try {
    const ventas = await obtenerVentas();
    res.render('admin/ventas', { ventas });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar ventas');
  }
};
