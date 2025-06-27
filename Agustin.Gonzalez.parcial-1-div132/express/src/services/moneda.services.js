import pool from '../../db.js';

// Obtener todas las monedas
const getAllMonedas = async () => {
  const [rows] = await pool.query('SELECT * FROM monedas');
  return rows;
};

// Obtener una moneda por ID
const getMonedaById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM monedas WHERE id = ?', [id]);
  return rows[0];
};

// Crear una nueva moneda
const createMoneda = async (req, res) => {
  try {
    const { categoria, nombre, precio, img, stock } = req.body;

    if (!categoria || !nombre) {
      return res.status(400).json({ error: 'Campos "categoria" y "nombre" son obligatorios.' });
    }

    if (typeof precio !== 'number' || precio < 0) {
      return res.status(400).json({ error: 'El campo "precio" debe ser un número mayor o igual a 0.' });
    }

    if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
      return res.status(400).json({ error: 'El campo "stock" debe ser un número mayor o igual a 0 si se proporciona.' });
    }

    const nuevaMoneda = await monedaServices.createMoneda({ categoria, nombre, precio, img, stock });
    res.status(201).json(nuevaMoneda);
  } catch (error) {
    console.error('Error al crear moneda:', error);
    res.status(500).json({ error: 'Error al crear moneda' });
  }
};

// Actualizar una moneda
const updateMoneda = async (req, res) => {
  try {
    const { categoria, nombre, precio, img, stock } = req.body;

    if (!categoria || !nombre) {
      return res.status(400).json({ error: 'Campos "categoria" y "nombre" son obligatorios.' });
    }

    if (typeof precio !== 'number' || precio < 0) {
      return res.status(400).json({ error: 'El campo "precio" debe ser un número mayor o igual a 0.' });
    }

    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ error: 'El campo "stock" debe ser un número mayor o igual a 0.' });
    }

    const { id } = req.params;
    const success = await monedaServices.updateMoneda(id, { categoria, nombre, precio, img, stock });
    if (!success) return res.status(404).json({ error: 'Moneda no encontrada' });

    res.json({ message: 'Moneda actualizada' });
  } catch (error) {
    console.error('Error al actualizar moneda:', error);
    res.status(500).json({ error: 'Error al actualizar moneda' });
  }
};

// Eliminar una moneda
const deleteMoneda = async (id) => {
  const [result] = await pool.query('DELETE FROM monedas WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

// Obtener stock
const getStockById = async (id) => {
  const [rows] = await pool.query('SELECT stock FROM monedas WHERE id = ?', [id]);
  return rows.length ? rows[0].stock : null;
};

// Modificar stock
const updateStock = async (id, cantidad) => {
  const [result] = await pool.query(
    'UPDATE monedas SET stock = stock + ? WHERE id = ?',
    [cantidad, id]
  );
  return result.affectedRows > 0;
};

export default {
  getAllMonedas,
  getMonedaById,
  createMoneda,
  updateMoneda,
  deleteMoneda,
  getStockById,
  updateStock,
};
