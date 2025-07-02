import {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deshabilitarProducto
} from '../services/productos.services.js';


import {
  createAdmin
} from '../services/admin.services.js';

import bcrypt from 'bcrypt';

// =================== RENDER DE VISTAS ===================

export const renderDashboard = async (req, res) => {
  const productos = await getAllProductos();
  res.render('admin/dashboard', { productos });
};

export const renderProductos = async (req, res) => {
  const productos = await getAllProductos();
  res.render('admin/productos', { productos });
};

export const renderAgregarProducto = (req, res) => {
  res.render('admin/agregar-producto');
};

export const renderEditarProducto = async (req, res) => {
  const producto = await getProductoById(req.params.id);
  res.render('admin/editar-producto', { producto });
};

export const renderRegistroAdmin = (req, res) => {
  res.render('admin/registro-admin');
};

// =================== PRODUCTO CRUD ===================

export const agregarProductoDesdeForm = async (req, res) => {
  const producto = {
    ...req.body,
    activo: req.body.activo ? 1 : 0,
    destacado: req.body.destacado ? 1 : 0
  };
  await createProducto(producto);
  res.redirect('/admin/productos');
};

export const eliminarProductoDesdeForm = async (req, res) => {
  await deshabilitarProducto(req.params.id);  // cambiar llamada aquí
  res.redirect('/admin/productos');
};
export const actualizarProductoDesdeForm = async (req, res) => {
  const updated = {
    ...req.body,
    activo: req.body.activo ? 1 : 0,
    destacado: req.body.destacado ? 1 : 0
  };
  await updateProducto(req.params.id, updated);
  res.redirect('/admin/productos');
};

// =================== ADMIN CREACIÓN ===================

export const crearAdminDesdeForm = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Pasamos la contraseña plana para que el servicio la hashee
    await createAdmin({ email, contraseña: password });
    res.redirect('/admin/login');
  } catch (error) {
    console.error('Error al crear admin:', error);
    res.status(500).render('admin/registro-admin', { errorMsg: 'Error al registrar el administrador' });
  }
};
