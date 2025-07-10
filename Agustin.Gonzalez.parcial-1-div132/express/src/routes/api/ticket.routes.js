import { Router } from 'express';
import { obtenerTicket } from '../../controller/api/ticket.controller.js';


const router = Router();

router.get('/:id', obtenerTicket); // id = venta_id

export default router;
