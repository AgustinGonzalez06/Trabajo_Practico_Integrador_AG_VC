// productos.controller.js
import {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deshabilitarProducto,
  toggleEstadoProducto,
  getProductosActivos
} from '../../services/admin/productos.services.js';

import { validationResult } from 'express-validator';

// Mostrar lista productos (admin)
export const renderProductos = async (req, res) => {
  try {
    const productos = await getAllProductos();
    res.render('admin/dashboard', { productos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar productos');
  }
};

export const obtenerProductosActivos = async (req, res) => {
  try {
    const productos = await getProductosActivos();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos activos:', error);
    res.status(500).json({ error: 'Error al obtener productos activos' });
  }
};



// Mostrar formulario agregar producto
export const renderAgregarProducto = (req, res) => {
  res.render('admin/agregar-producto', { errores: [], datos: {} });
};

// Validar producto (middleware)
export const validarProducto = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).render('admin/agregar-producto', {
      errores: errores.array(),
      datos: req.body,
    });
  }
  next();
};


// Agregar producto desde form
export const agregarProductoDesdeForm = async (req, res) => {
  try {
    const producto = {
      ...req.body,
      activo: req.body.activo ? 1 : 0,
      destacado: req.body.destacado ? 1 : 0,
      img: req.file ? `/uploads/${req.body.categoria}/${req.file.filename}` : ''
    };

    await createProducto(producto);
    res.redirect('/admin/productos');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar producto');
  }
};

// Mostrar formulario editar producto
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

// Actualizar producto desde form
export const actualizarProductoDesdeForm = async (req, res) => {
  try {
    const actualizado = {
      ...req.body,
      activo: req.body.activo ? 1 : 0,
      destacado: req.body.destacado ? 1 : 0,
    };

    if (req.file) {
      actualizado.img = `/uploads/${req.body.categoria}/${req.file.filename}`;
    }

    await updateProducto(req.params.id, actualizado);
    res.redirect('/admin/productos');
  } catch (error) {
    console.error(error);

    // En caso de error, renderizá la vista enviando los datos y los errores
    res.status(500).render('admin/editar-producto', {
      datos: {
        ...req.body,
        id: req.params.id,
        img: req.file ? `/uploads/${req.body.categoria}/${req.file.filename}` : '',
      },
      errores: [{ msg: 'Error al actualizar producto' }],
    });
  }
};




// Eliminar (deshabilitar) producto
export const eliminarProductoDesdeForm = async (req, res) => {
  try {
    await deshabilitarProducto(req.params.id);
    res.redirect('/admin/productos');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar producto');
  }
};

// Cambiar estado activo/inactivo
export const toggleEstadoDesdeForm = async (req, res) => {
  try {
    await toggleEstadoProducto(req.params.id);
    res.redirect('/admin/productos');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cambiar estado');
  }
};
