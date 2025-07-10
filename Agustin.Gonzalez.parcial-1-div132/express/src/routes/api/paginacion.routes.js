import { Router } from 'express';
import { getProductosPaginados } from '../../controller/api/paginacion.controller.js';

const router = Router();

router.get('/', getProductosPaginados);

export default router;
