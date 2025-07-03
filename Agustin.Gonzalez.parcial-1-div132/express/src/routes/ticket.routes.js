import { Router } from 'express';
import { obtenerTicket } from '../controller/ticket.controller.js';

const router = Router();

router.get('/:id', obtenerTicket); // id = venta_id

export default router;
