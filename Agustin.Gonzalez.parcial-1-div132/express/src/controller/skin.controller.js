import * as skinServices from '../services/skin.services.js';

const getAllSkins = async (req, res) => {
  try {
    const skins = await skinServices.getAllSkins();
    res.json(skins);
  } catch (error) {
    console.error('Error al obtener skins:', error);
    res.status(500).json({ error: 'Error al obtener skins' });
  }
};

const createSkin = async (req, res) => {
  try {
    const skinData = req.body;
    const newSkin = await skinServices.createSkin(skinData);
    res.status(201).json(newSkin);
  } catch (error) {
    console.error('Error al crear skin:', error);
    res.status(500).json({ error: 'Error al crear skin' });
  }
};

const getStock = async (req, res) => {
  try {
    const { id } = req.params;
    const stock = await skinServices.getStockById(id);
    if (stock === null) {
      return res.status(404).json({ error: 'Skin no encontrada' });
    }
    res.json({ stock });
  } catch (error) {
    console.error('Error al obtener stock:', error);
    res.status(500).json({ error: 'Error al obtener stock' });
  }
};

const changeStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body; // puede ser negativo o positivo
    const success = await skinServices.updateStock(id, cantidad);
    if (!success) {
      return res.status(404).json({ error: 'Skin no encontrada' });
    }
    res.json({ message: 'Stock actualizado' });
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    res.status(500).json({ error: 'Error al actualizar stock' });
  }
};

const getSkinById = async (req, res) => {
  try {
    const { id } = req.params;
    const skin = await skinServices.getSkinById(id);
    if (!skin) {
      return res.status(404).json({ error: 'Skin no encontrada' });
    }
    res.json(skin);
  } catch (error) {
    console.error('Error al obtener skin:', error);
    res.status(500).json({ error: 'Error al obtener skin' });
  }
};

const updateSkin = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const success = await skinServices.updateSkin(id, updatedData);
    if (!success) {
      return res.status(404).json({ error: 'Skin no encontrada' });
    }
    res.json({ message: 'Skin actualizada' });
  } catch (error) {
    console.error('Error al actualizar skin:', error);
    res.status(500).json({ error: 'Error al actualizar skin' });
  }
};

const deleteSkin = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await skinServices.deleteSkin(id);
    if (!success) {
      return res.status(404).json({ error: 'Skin no encontrada' });
    }
    res.json({ message: 'Skin eliminada' });
  } catch (error) {
    console.error('Error al eliminar skin:', error);
    res.status(500).json({ error: 'Error al eliminar skin' });
  }
};


export default {
  getAllSkins,
  getSkinById,
  createSkin,
  updateSkin,
  deleteSkin,
  getStock,
  changeStock,
};
