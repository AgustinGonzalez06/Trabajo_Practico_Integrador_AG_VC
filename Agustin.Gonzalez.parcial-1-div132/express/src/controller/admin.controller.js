import {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deshabilitarProducto,
  toggleEstadoProducto
} from '../services/productos.services.js';

import { obtenerVentas } from '../services/admin.services.js';

import { getAdminByEmail } from '../services/admin.services.js'; // Asegurate de tener esta función

import { validationResult } from 'express-validator';

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


// =================== PRODUCTO CRUD ===================

export const validarProducto = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).render('admin/agregar-producto', {
      errores: errores.array(),
      datos: req.body
    });
  }
  next();
};

export const agregarProductoDesdeForm = async (req, res) => {
  const producto = {
    ...req.body,
    activo: req.body.activo ? 1 : 0,
    destacado: req.body.destacado ? 1 : 0,
    img: req.file ? `/uploads/${req.body.categoria}/${req.file.filename}` : ''
  };

  try {
    await createProducto(producto);
    res.redirect('/admin/productos');
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).send("Error al agregar producto");
  }
};
export const eliminarProductoDesdeForm = async (req, res) => {
  await deshabilitarProducto(req.params.id);  // cambiar llamada aquí
  res.redirect('/admin/productos');
};
export const actualizarProductoDesdeForm = async (req, res) => {
  try {
    const updated = {
      ...req.body,
      activo: req.body.activo ? 1 : 0,
      destacado: req.body.destacado ? 1 : 0
    };

    // Si subieron archivo, actualizar campo img con la ruta correcta
    if (req.file) {
      updated.img = `/uploads/${req.file.filename}`; // o como armes la ruta
    }

    await updateProducto(req.params.id, updated);
    res.redirect('/admin/productos');
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).send("Error al actualizar producto");
  }
};

export const toggleEstadoDesdeForm = async (req, res) => {
   const { id } = req.params;

   try {
     await toggleEstadoProducto(id);  // Esta función alterna entre activo/inactivo
     res.redirect('/admin/dashboard');
   } catch (error) {
     console.error('Error al cambiar el estado del producto:', error);
     res.status(500).send('Error al cambiar estado');
   }
 };

// =================== ADMIN CREACIÓN ===================


export const loginAdminDesdeForm = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await getAdminByEmail(email);
    if (!admin) {
      return res.status(401).render('admin/login-admin', {
        errorMsg: 'Correo no registrado',
      });
    }

    const esValida = await bcrypt.compare(password, admin.contraseña);
    if (!esValida) {
      return res.status(401).render('admin/login-admin', {
        errorMsg: 'Contraseña incorrecta',
      });
    }

    // Autenticación exitosa: podés guardar el admin en la sesión si usás express-session
    // req.session.admin = admin;

    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error en login admin:', error);
    res.status(500).render('admin/login-admin', {
      errorMsg: 'Error del servidor al iniciar sesión',
    });
  }
};

// Para el render inicial (sin errores)
export const renderRegistroAdmin = (req, res) => {
  res.render('admin/registro-admin', { datos: {} });
};

// Para cuando hay errores, envías los datos enviados por el usuario para rellenar el formulario
export const crearAdminDesdeForm = async (req, res) => {
  const { email, password } = req.body;

  // Puedes hacer aquí validaciones previas si querés
  const errores = [];
  if (!email || !email.trim()) errores.push({ msg: 'Email obligatorio' });
  if (!password || password.length < 6) errores.push({ msg: 'La contraseña debe tener al menos 6 caracteres.' });

  if (errores.length > 0) {
    return res.status(400).render('admin/registro-admin', {
      errores,
      datos: { email }
    });
  }

  try {
    await createAdmin({ email, contraseña: password });
    res.redirect('/admin/login');
  } catch (error) {
    console.error('Error al crear admin:', error);

    // Manejo error de duplicado (MySQL error code: ER_DUP_ENTRY)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).render('admin/registro-admin', {
        errores: [{ msg: 'El email ya está registrado, ingrese otro.' }],
        datos: { email }
      });
    }

    // Otros errores generales
    res.status(500).render('admin/registro-admin', {
      errores: [{ msg: 'Error inesperado al registrar el administrador.' }],
      datos: { email }
    });
  }
};


export async function renderListaVentas(req, res) {
  try {
    let ventas = await obtenerVentas();

    // Convertir total a número
    ventas = ventas.map(v => ({
      ...v,
      total: Number(v.total)  // o parseFloat(v.total)
    }));

    res.render("admin/ventas", { ventas });
  } catch (error) {
    console.error("Error al renderizar lista de ventas:", error);
    res.status(500).send("Error al cargar ventas");
  }
}