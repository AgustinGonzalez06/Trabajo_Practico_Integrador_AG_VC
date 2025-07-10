import pool from '../../config/db.js';

// Obtener todos los productos
export const getAllProductos = async () => {
  const [rows] = await pool.query('SELECT * FROM productos');
  return rows;
};
// Obtener productos activos para la tienda
export const getProductosActivos = async () => {
  const [rows] = await pool.query('SELECT * FROM productos WHERE activo = TRUE');
  return rows;
};

// Obtener un producto por ID
export const getProductoById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
  return rows[0];
};

// Crear un nuevo producto
export const createProducto = async (producto) => {
  const {
    nombre,
    precio,
    categoria,
    subcategoria,
    img,
    activo = true
  } = producto;

  const [result] = await pool.query(
    `INSERT INTO productos (nombre, precio, categoria, subcategoria, img, activo)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nombre, precio, categoria, subcategoria, img, activo]
  );

  return { id: result.insertId, ...producto };
};
// Actualizar un producto existente
export const updateProducto = async (id, producto) => {
  const [result] = await pool.query('UPDATE productos SET ? WHERE id = ?', [producto, id]);
  return result;
};

// Deshabilitar producto: cambiar activo a false
export const deshabilitarProducto = async (id) => {
  await pool.query(
    'UPDATE productos SET activo = false WHERE id = ?',
    [id]
  );
};

export const toggleEstadoProducto = async (id) => {
  const [rows] = await pool.query('SELECT activo FROM productos WHERE id = ?', [id]);
  if (rows.length === 0) throw new Error('Producto no encontrado');

  const nuevoEstado = rows[0].activo ? 0 : 1;

  await pool.query('UPDATE productos SET activo = ? WHERE id = ?', [nuevoEstado, id]);
};