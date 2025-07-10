import express from 'express';
import upload from '../../middleware/multer.js';
import { body } from 'express-validator';

import {
  renderLoginAdmin,
  loginAdminDesdeForm,
  renderRegistroAdmin,
  crearAdminDesdeForm,
  renderDashboard,
  renderAgregarProducto,
  agregarProducto,
  renderVentas,
  renderEditarProducto,
  toggleEstadoDesdeForm
} from '../../controller/admin/admin.controller.js';

import { actualizarProductoDesdeForm } from '../../controller/admin/productos.controller.js';

const router = express.Router();

// Login admin
router.get('/login', renderLoginAdmin);
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Contraseña requerida'),
  ],
  loginAdminDesdeForm
);

// Registro admin
router.get('/registrar', renderRegistroAdmin);
router.post(
  '/registrar',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('Contraseña mínimo 6 caracteres'),
  ],
  crearAdminDesdeForm
);

// Dashboard general admin
router.get('/dashboard', renderDashboard);

// Agregar producto básico (desde admin)
router.get('/agregar', renderAgregarProducto);
router.post(
  '/agregar',
  upload.single('img'),
  [
    body('nombre').trim().isLength({ min: 3 }).withMessage('Nombre mínimo 3 caracteres'),
    body('precio').isFloat({ min: 1 }).withMessage('Precio debe ser mayor a 0'),
    body('categoria').isIn(['moneda', 'skin']).withMessage('Categoría inválida'),
  ],
  agregarProducto
);

// Editar producto básico
router.get('/editar/:id', renderEditarProducto);

router.post(
  '/editar/:id',
  upload.single('img'),
  [
    body('nombre').trim().isLength({ min: 3 }).withMessage('Nombre mínimo 3 caracteres'),
    body('precio').isFloat({ min: 1 }).withMessage('Precio debe ser mayor a 0'),
    body('categoria').isIn(['moneda', 'skin']).withMessage('Categoría inválida')
  ],
  actualizarProductoDesdeForm
);
router.post('/toggle-estado/:id', toggleEstadoDesdeForm);

// Ventas admin
router.get('/ventas', renderVentas);

export default router;
