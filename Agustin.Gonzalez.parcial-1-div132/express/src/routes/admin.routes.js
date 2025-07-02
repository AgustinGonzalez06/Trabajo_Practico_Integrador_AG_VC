// adminRoutes.js
import express from 'express';
import {
  renderProductos,
  renderAgregarProducto,
  agregarProductoDesdeForm,
  eliminarProductoDesdeForm,
  renderEditarProducto,
  actualizarProductoDesdeForm
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/admin/productos', renderProductos);
router.get('/admin/productos/agregar', renderAgregarProducto);
app.get('/admin/dashboard', renderDashboard);
router.post('/admin/productos/agregar', agregarProductoDesdeForm);
router.get('/admin/productos/editar/:id', renderEditarProducto);
router.post('/admin/productos/editar/:id', actualizarProductoDesdeForm);
router.post('/admin/productos/eliminar/:id', eliminarProductoDesdeForm);

export default router;
