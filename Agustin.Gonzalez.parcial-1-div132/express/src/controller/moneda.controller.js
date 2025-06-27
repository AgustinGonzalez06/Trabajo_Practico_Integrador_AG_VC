import monedaServices from '../services/moneda.services.js';

const getAllMonedas = async (req, res) => {
  try {
    const monedas = await monedaServices.getAllMonedas();
    res.json(monedas);
  } catch (error) {
    console.error('Error al obtener monedas:', error);
    res.status(500).json({ error: 'Error al obtener monedas' });
  }
};

const getMonedaById = async (req, res) => {
  try {
    const { id } = req.params;
    const moneda = await monedaServices.getMonedaById(id);
    if (!moneda) return res.status(404).json({ error: 'Moneda no encontrada' });
    res.json(moneda);
  } catch (error) {
    console.error('Error al obtener moneda:', error);
    res.status(500).json({ error: 'Error al obtener moneda' });
  }
};

const createMoneda = async (req, res) => {
  try {
    const monedaData = req.body;
    const nuevaMoneda = await monedaServices.createMoneda(monedaData);
    res.status(201).json(nuevaMoneda);
  } catch (error) {
    console.error('Error al crear moneda:', error);
    res.status(500).json({ error: 'Error al crear moneda' });
  }
};

const updateMoneda = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const success = await monedaServices.updateMoneda(id, data);
    if (!success) return res.status(404).json({ error: 'Moneda no encontrada' });
    res.json({ message: 'Moneda actualizada' });
  } catch (error) {
    console.error('Error al actualizar moneda:', error);
    res.status(500).json({ error: 'Error al actualizar moneda' });
  }
};

const deleteMoneda = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await monedaServices.deleteMoneda(id);
    if (!success) return res.status(404).json({ error: 'Moneda no encontrada' });
    res.json({ message: 'Moneda eliminada' });
  } catch (error) {
    console.error('Error al eliminar moneda:', error);
    res.status(500).json({ error: 'Error al eliminar moneda' });
  }
};

const getStock = async (req, res) => {
  try {
    const { id } = req.params;
    const stock = await monedaServices.getStockById(id);
    if (stock === null) return res.status(404).json({ error: 'Moneda no encontrada' });
    res.json({ stock });
  } catch (error) {
    console.error('Error al obtener stock:', error);
    res.status(500).json({ error: 'Error al obtener stock' });
  }
};

const changeStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;
    const success = await monedaServices.updateStock(id, cantidad);
    if (!success) return res.status(404).json({ error: 'Moneda no encontrada' });
    res.json({ message: 'Stock actualizado' });
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    res.status(500).json({ error: 'Error al actualizar stock' });
  }
};

export default {
  getAllMonedas,
  getMonedaById,
  createMoneda,
  updateMoneda,
  deleteMoneda,
  getStock,
  changeStock,
};
