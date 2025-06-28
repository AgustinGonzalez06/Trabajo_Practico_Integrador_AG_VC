import {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto
} from '../services/productos.services.js';

export const obtenerProductos = async (req, res) => {
  try {
    const productos = await getAllProductos();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
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

export const eliminarProducto = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteProducto(id);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
};