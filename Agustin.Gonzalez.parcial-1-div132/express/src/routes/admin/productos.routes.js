import express from 'express';
import upload from '../../middleware/multer.js';
import { body } from 'express-validator';

import {
  renderProductos,
  renderAgregarProducto,
  agregarProductoDesdeForm,
  renderEditarProducto,
  actualizarProductoDesdeForm,
  eliminarProductoDesdeForm,
  toggleEstadoDesdeForm,
  obtenerProductosActivos
} from '../../controller/admin/productos.controller.js';

const router = express.Router();

router.get('/', renderProductos);                    // /admin/productos/
router.get('/agregar', renderAgregarProducto);       // /admin/productos/agregar
router.post(
  '/agregar',
  upload.single('img'),
  [
    body('nombre').trim().isLength({ min: 3 }).withMessage('Nombre mínimo 3 caracteres'),
    body('precio').isFloat({ min: 1 }).withMessage('Precio debe ser mayor a 0'),
    body('categoria').isIn(['moneda', 'skin']).withMessage('Categoría inválida'),
  ],
  agregarProductoDesdeForm
);

router.get('/activos', obtenerProductosActivos);

router.get('/editar/:id', renderEditarProducto);
router.post(
  '/editar/:id',
  upload.single('img'),
  [
    body('nombre').trim().isLength({ min: 3 }).withMessage('Nombre mínimo 3 caracteres'),
    body('precio').isFloat({ min: 1 }).withMessage('Precio debe ser mayor a 0'),
    body('categoria').isIn(['moneda', 'skin']).withMessage('Categoría inválida'),
  ],
  actualizarProductoDesdeForm
);

router.post('/eliminar/:id', eliminarProductoDesdeForm);
router.post('/admin/toggle-estado/:id', toggleEstadoDesdeForm);


export default router;
