import express from 'express';
import { confirmarCompra } from '../controller/venta.controller.js';

const router = express.Router();

router.post('/comprar', confirmarCompra);

export default router;
