import './initDB.js'; //  Ejecuta el archivo al inicio
import express from "express";
import multer from 'multer';
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { body, validationResult } from "express-validator";
import fs from 'fs';

// import skinRoutes from './src/routes/skin.routes.js';
// import monedasRouter from './src/routes/moneda.routes.js';
import productosRouter from './src/routes/productos.routes.js';
import ventaRoutes from './src/routes/venta.routes.js';
import ticketsRouter from './src/routes/ticket.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import paginacionRouter from './src/routes/paginacion.routes.js';

import { 
  getAllProductos, 
  deshabilitarProducto, 
  createProducto, 
  getProductoById, 
  updateProducto 
} from './src/services/productos.services.js';

import {
  renderRegistroAdmin,
  crearAdminDesdeForm,
  renderListaVentas
} from './src/controller/admin.controller.js';

import { getAdminByEmail } from './src/services/admin.services.js';
import bcrypt from 'bcrypt';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configuración
app.set("PORT", 5000);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

// Middleware
app.use(express.static(path.join(__dirname, '..', 'Public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas API
// app.use('/api/skins', skinRoutes);
// app.use('/api/monedas', monedasRouter);
app.use('/api/productos', productosRouter);
app.use('/api/paginacion', paginacionRouter);
app.use('/api/venta', ventaRoutes);
app.use('/tickets', ticketsRouter);
app.use('/', adminRoutes);
// Página de login de usuario
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'loginUser.html'));
});

// Página de login para administradores (renderiza EJS)
app.get('/admin/login', (req, res) => {
  res.render('admin/login', { errorMsg: '' });
});

app.get('/admin/dashboard', async (req, res) => {
  try {
    const productos = await getAllProductos();
    res.render('admin/dashboard', { productos });
  } catch (error) {
    console.error('Error al mostrar dashboard:', error);
    res.status(500).send('Error al cargar el dashboard');
  }
});

// POST del login admin
app.post('/admin/login', async (req, res) => {
  console.log('Datos recibidos:', req.body);
  const { email, password } = req.body;

  try {
    const admin = await getAdminByEmail(email);

    if (!admin) {
      return res.render('admin/login', { errorMsg: 'Correo no registrado' });
    }

    const esValida = await bcrypt.compare(password, admin.contraseña);

    if (!esValida) {
      return res.render('admin/login', { errorMsg: 'Contraseña incorrecta' });
    }

    // Login exitoso
    return res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error en login admin:', error);
    return res.status(500).render('admin/login', { errorMsg: 'Error en el servidor' });
  }
});

// Ruta para deshabilitar un producto (poner activo = false)
app.post('/admin/deshabilitar/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await deshabilitarProducto(id);
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error al deshabilitar producto:', error);
    res.status(500).send('Error al deshabilitar producto');
  }
});

// Formulario para editar producto
app.get('/admin/editar/:id', async (req, res) => {
  try {
    const producto = await getProductoById(req.params.id);
    if (!producto) return res.status(404).send('Producto no encontrado');
    res.render('admin/editar-producto', { errores: [], datos: producto });
  } catch (error) {
    console.error('Error al cargar producto para editar:', error);
    res.status(500).send('Error al cargar formulario de edición');
  }
});

// Configuración almacenamiento multer con subcarpetas por categoría
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const basePath = path.join(__dirname, '..', 'public', 'uploads');
    const categoria = req.body.categoria;
    const uploadPath = path.join(basePath, categoria);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// Enviar datos editados con multer
app.post(
  '/admin/editar/:id',
  upload.single('img'),
  [
    body('nombre').trim().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    body('precio').isFloat({ min: 1 }).withMessage('El precio debe ser mayor a 0'),
    body('categoria').isIn(['moneda', 'skin']).withMessage('Categoría inválida'),
  ],
  async (req, res) => {
    const errores = validationResult(req);
    const id = req.params.id;
    const datos = req.body;

    if (req.file) {
      datos.img = `/uploads/${datos.categoria}/${req.file.filename}`;
    }

    if (!errores.isEmpty()) {
      return res.status(400).render('admin/editar-producto', {
        errores: errores.array(),
        datos: { ...datos, id },
      });
    }

    try {
      await updateProducto(id, datos);
      res.redirect('/admin/dashboard');
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).send('Error al actualizar producto');
    }
  }
);

// Alta de producto con validación y multer para imagen
app.get('/admin/agregar', (req, res) => {
  res.render('admin/alta-producto', { errores: [], datos: {} });
});

app.post(
  '/admin/agregar',
  upload.single('img'),
  [
    body('nombre').trim().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    body('precio').isFloat({ min: 1 }).withMessage('El precio debe ser mayor a 0'),
    body('categoria').isIn(['moneda', 'skin']).withMessage('Categoría inválida'),
  ],
  async (req, res) => {
    const errores = validationResult(req);
    const datos = req.body;

    if (req.file) {
      datos.img = `/uploads/${datos.categoria}/${req.file.filename}`;
    }

    if (!errores.isEmpty()) {
      return res.status(400).render('admin/alta-producto', {
        errores: errores.array(),
        datos,
      });
    }

    try {
      const nuevoProducto = {
        nombre: datos.nombre,
        precio: datos.precio,
        categoria: datos.categoria,
        subcategoria: datos.subcategoria || '',
        img: datos.img || '',
        activo: true,
      };
      await createProducto(nuevoProducto);
      res.redirect('/admin/dashboard');
    } catch (error) {
      console.error('Error al agregar producto:', error);
      res.status(500).send('Error al agregar producto');
    }
  }
);

// Registro de administradores
app.get('/admin/registrar', renderRegistroAdmin);
app.post('/admin/registrar', crearAdminDesdeForm);

// Inicio del servidor
app.listen(app.get("PORT"), () => {
  console.log(`Servidor corriendo en http://localhost:${app.get("PORT")}`);
});
