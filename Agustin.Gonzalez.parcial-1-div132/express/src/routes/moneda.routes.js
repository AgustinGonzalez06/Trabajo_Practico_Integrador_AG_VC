import express from 'express';
import monedaController from '../controller/moneda.controller.js';

const router = express.Router();

// CRUD completo
router.get('/monedas', monedaController.getAllMonedas);
router.get('/monedas/:id', monedaController.getMonedaById);
router.post('/monedas', monedaController.createMoneda);
router.put('/monedas/:id', monedaController.updateMoneda);
router.delete('/monedas/:id', monedaController.deleteMoneda);

// Manejo de stock
router.get('/monedas/:id/stock', monedaController.getStock);
router.patch('/monedas/:id/stock', monedaController.changeStock);

export default router;
