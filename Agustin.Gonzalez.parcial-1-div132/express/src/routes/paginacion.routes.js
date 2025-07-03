import { Router } from 'express';
import { getProductosPaginados } from '../controller/paginacion.controller.js';

const router = Router();

router.get('/', getProductosPaginados);

export default router;
