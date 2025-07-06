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
  toggleEstadoDesdeForm,
  crearAdminDesdeForm,
  loginAdminDesdeForm,
  renderListaVentas
} from '../controller/admin.controller.js';
import { validarProducto} from '../middleware/validarProducto.js';
import { validarLoginAdmin } from '../middleware/validarLoginAdmin.js';
import { validarRegistroAdmin } from '../middleware/validarRegistroAdmin.js';


const router = express.Router();

router.get('/admin/productos', renderProductos);
router.get('/admin/productos/agregar', renderAgregarProducto);
router.get('/admin/dashboard', renderDashboard);
router.get('/admin/ventas', renderListaVentas);



router.post('/admin/productos/agregar', validarProducto, agregarProductoDesdeForm);
router.post('/admin/registrar', validarRegistroAdmin, crearAdminDesdeForm);


router.post('/admin/productos/editar/:id', validarProducto, actualizarProductoDesdeForm);

router.post('/admin/login', validarLoginAdmin, loginAdminDesdeForm);

router.post('/admin/toggle-estado/:id', toggleEstadoDesdeForm);
router.get('/admin/productos/editar/:id', renderEditarProducto);
router.post('/admin/productos/eliminar/:id', eliminarProductoDesdeForm);



export default router;
