import {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deshabilitarProducto,
  getProductosActivos
} from '../../services/admin/productos.services.js';


// Controladores para manejar las rutas de productos
// Estos controladores interactúan con los servicios para realizar operaciones CRUD sobre productos
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await getAllProductos();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};


export const obtenerProductosActivos = async (req, res) => {
  try {
    const productos = await getProductosActivos();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos activos' });
  }
};

export const obtenerProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await getProductoById(id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};

export const crearProducto = async (req, res) => {
  try {
    const productos = Array.isArray(req.body) ? req.body : [req.body];
    const resultados = [];

    for (const producto of productos) {
      const nuevo = await createProducto(producto);
      resultados.push(nuevo);
    }

    res.status(201).json(resultados);
  } catch (error) {
    console.error('ERROR en crearProducto:', error);
    res.status(500).json({ error: 'Error al insertar productos' });
  }
};

export const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    await updateProducto(id, req.body);
    res.json({ mensaje: 'Producto actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
};

export const deshabilitarProductoController = async (req, res) => {
  const { id } = req.params;
  try {
    await deshabilitarProducto(id);
    res.json({ mensaje: 'Producto deshabilitado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al deshabilitar el producto' });
  }
};

export const getProductosInactivos = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, precio, descripcion FROM productos WHERE activo = ?',
      [0]
    );
    if (rows.length === 0) {
      return res.status(204).send();
    }
    res.json(rows);
  } catch (err) {
    console.error('Error al leer productos inactivos:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


