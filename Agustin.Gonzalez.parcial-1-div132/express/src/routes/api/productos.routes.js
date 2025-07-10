import { Router } from 'express';

import {
  obtenerProductos,
  obtenerProductosActivos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  deshabilitarProductoController,
  getProductosInactivos
} from '../../controller/api/productos.controller.js';

const router = Router();

router.get('/', obtenerProductos);
router.get('/activos', obtenerProductosActivos);
router.get('/:id', obtenerProducto);

router.post('/', crearProducto);
router.put('/:id', actualizarProducto);
router.delete('/:id', deshabilitarProductoController);

router.get('/inactivos', getProductosInactivos);

export default router;
