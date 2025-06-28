import pool from '../../db.js';

// Obtener todos los productos
export const getAllProductos = async () => {
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

// Eliminar (soft delete) un producto
export const deleteProducto = async (id) => {
  await pool.query('UPDATE productos SET activo = FALSE WHERE id = ?', [id]);
};