import express from 'express';
import { renderListaVentas } from '../../controller/admin/ventas.controller.js';

const router = express.Router();

router.get('/', renderListaVentas);  // /admin/ventas/

export default router;
