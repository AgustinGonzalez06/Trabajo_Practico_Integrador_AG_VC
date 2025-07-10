import { getAdminByEmail, createAdmin } from '../../services/admin/admin.services.js';
import { getAllProductos, createProducto, getProductoById, toggleEstadoProducto } from '../../services/admin/productos.services.js';
import { obtenerVentas } from '../../services/admin/ventas.services.js';

import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

export const renderLoginAdmin = (req, res) => {
  res.render('admin/login-admin', { errorMsg: null });
};

export const loginAdminDesdeForm = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).render('admin/login-admin', { errorMsg: errores.array()[0].msg });
  }

  const { email, password } = req.body;

  try {
    const admin = await getAdminByEmail(email);
    if (!admin) return res.status(401).render('admin/login-admin', { errorMsg: 'Correo no registrado' });

    const esValida = await bcrypt.compare(password, admin.contraseña);
    if (!esValida) return res.status(401).render('admin/login-admin', { errorMsg: 'Contraseña incorrecta' });

    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).render('admin/login-admin', { errorMsg: 'Error del servidor' });
  }
};

export const renderRegistroAdmin = (req, res) => {
  res.render('admin/registro-admin', { errores: [], datos: {} });
};

export const crearAdminDesdeForm = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).render('admin/registro-admin', { errores: errores.array(), datos: req.body });
  }

  const { email, password } = req.body;

  try {
    await createAdmin({ email, contraseña: password });
    res.redirect('/admin/login');
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).render('admin/registro-admin', { errores: [{ msg: 'Email ya registrado' }], datos: req.body });
    }
    res.status(500).render('admin/registro-admin', { errores: [{ msg: 'Error inesperado' }], datos: req.body });
  }
};

export const renderDashboard = async (req, res) => {
  try {
    const productos = await getAllProductos();
    res.render('admin/dashboard', { productos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar dashboard');
  }
};

export const renderAgregarProducto = (req, res) => {
  res.render('admin/alta-producto', { errores: [], datos: {} });
};

export const agregarProducto = async (req, res) => {
  const errores = validationResult(req);
  const datos = req.body;
  if (req.file) datos.img = `/uploads/${datos.categoria}/${req.file.filename}`;

  if (!errores.isEmpty()) {
    return res.status(400).render('admin/alta-producto', { errores: errores.array(), datos });
  }

  try {
    await createProducto({
      nombre: datos.nombre,
      precio: datos.precio,
      categoria: datos.categoria,
      subcategoria: datos.subcategoria || '',
      img: datos.img || '',
      activo: true
    });
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).render('admin/alta-producto', { errores: [{ msg: 'Error al agregar producto' }], datos });
  }
};

export const renderVentas = async (req, res) => {
  try {
    const ventas = await obtenerVentas();
    res.render('admin/ventas', { ventas });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar ventas');
  }
};

export const renderEditarProducto = async (req, res) => {
  try {
    const producto = await getProductoById(req.params.id);
    if (!producto) return res.status(404).send('Producto no encontrado');

    res.render('admin/editar-producto', {
      datos: producto,
      errores: []
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar producto');
  }
};


export const toggleEstadoDesdeForm = async (req, res) => {
  try {
    await toggleEstadoProducto(req.params.id);
    res.redirect('/admin/productos');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cambiar estado');
  }
};
