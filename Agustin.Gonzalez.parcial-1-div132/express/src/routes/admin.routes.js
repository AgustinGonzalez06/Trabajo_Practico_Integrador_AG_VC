// adminRoutes.js
import express from 'express';
import {
  renderProductos,
  renderDashboard,
  renderAgregarProducto,
  agregarProductoDesdeForm,
  eliminarProductoDesdeForm,
  renderEditarProducto,
  actualizarProductoDesdeForm,
  toggleEstadoDesdeForm
} from '../controller/admin.controller.js';

const router = express.Router();

router.get('/admin/productos', renderProductos);
router.get('/admin/productos/agregar', renderAgregarProducto);
router.get('/admin/dashboard', renderDashboard);
router.post('/admin/productos/agregar', agregarProductoDesdeForm);
router.post('/admin/toggle-estado/:id', toggleEstadoDesdeForm);
router.get('/admin/productos/editar/:id', renderEditarProducto);
router.post('/admin/productos/editar/:id', actualizarProductoDesdeForm);
router.post('/admin/productos/eliminar/:id', eliminarProductoDesdeForm);

export default router;
