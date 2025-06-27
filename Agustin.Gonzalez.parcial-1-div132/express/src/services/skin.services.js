import pool from '../../db.js';

// Obtener todas las skins
const getAllSkins = async () => {
  const [rows] = await pool.query('SELECT * FROM skins');
  return rows;
};

// Obtener una skin por ID
const getSkinById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM skins WHERE id = ?', [id]);
  return rows[0];
};

// Crear una nueva skin
const createSkin = async (req, res) => {
  try {
    const { categoria, nombre, precio, rareza, img, stock } = req.body;

    if (!categoria || !nombre || !rareza) {
      return res.status(400).json({ error: 'Campos "categoria", "nombre" y "rareza" son obligatorios.' });
    }

    if (typeof precio !== 'number' || precio < 0) {
      return res.status(400).json({ error: 'El campo "precio" debe ser un número mayor o igual a 0.' });
    }

    if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
      return res.status(400).json({ error: 'El campo "stock" debe ser un número mayor o igual a 0 si se proporciona.' });
    }

    const newSkin = await skinServices.createSkin({ categoria, nombre, precio, rareza, img, stock });
    res.status(201).json(newSkin);
  } catch (error) {
    console.error('Error al crear skin:', error);
    res.status(500).json({ error: 'Error al crear skin' });
  }
};

// Actualizar los datos de una skin
const updateSkin = async (req, res) => {
  try {
    const { categoria, nombre, precio, rareza, img, stock } = req.body;

    if (!categoria || !nombre || !rareza) {
      return res.status(400).json({ error: 'Campos "categoria", "nombre" y "rareza" son obligatorios.' });
    }

    if (typeof precio !== 'number' || precio < 0) {
      return res.status(400).json({ error: 'El campo "precio" debe ser un número mayor o igual a 0.' });
    }

    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ error: 'El campo "stock" debe ser un número mayor o igual a 0.' });
    }

    const { id } = req.params;
    const success = await skinServices.updateSkin(id, { categoria, nombre, precio, rareza, img, stock });
    if (!success) {
      return res.status(404).json({ error: 'Skin no encontrada' });
    }

    res.json({ message: 'Skin actualizada' });
  } catch (error) {
    console.error('Error al actualizar skin:', error);
    res.status(500).json({ error: 'Error al actualizar skin' });
  }
};


// Eliminar una skin por ID
const deleteSkin = async (id) => {
  const [result] = await pool.query('DELETE FROM skins WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

// Obtener el stock de una skin
const getStockById = async (id) => {
  const [rows] = await pool.query('SELECT stock FROM skins WHERE id = ?', [id]);
  return rows.length ? rows[0].stock : null;
};

// Actualizar stock (por ejemplo, restar o sumar cantidad)
const updateStock = async (id, cantidad) => {
  const [result] = await pool.query(
    'UPDATE skins SET stock = stock + ? WHERE id = ?',
    [cantidad, id]
  );
  return result.affectedRows > 0;
};

export {
  getAllSkins,
  getSkinById,
  createSkin,
  updateSkin,
  deleteSkin,
  getStockById,
  updateStock,
};
