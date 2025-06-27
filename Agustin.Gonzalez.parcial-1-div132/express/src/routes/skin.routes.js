import express from 'express';
import skinController from '../controller/skin.controller.js';

const router = express.Router();

// Leer todas las skins
router.get('/skins', skinController.getAllSkins);

// Leer una skin por ID
router.get('/skins/:id', skinController.getSkinById);

// Crear una nueva skin
router.post('/skins', skinController.createSkin);

// Actualizar todos los campos de una skin existente
router.put('/skins/:id', skinController.updateSkin);

// Eliminar una skin
router.delete('/skins/:id', skinController.deleteSkin);

// Obtener stock de una skin
router.get('/skins/:id/stock', skinController.getStock);

// Modificar stock (positiva o negativamente)
router.patch('/skins/:id/stock', skinController.changeStock);

export default router;
