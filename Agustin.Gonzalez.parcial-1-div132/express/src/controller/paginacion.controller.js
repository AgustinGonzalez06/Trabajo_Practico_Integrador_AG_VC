import { getProductosPaginadosService } from '../services/paginacion.services.js';

export async function getProductosPaginados(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const resultado = await obtenerProductosPaginados(page, limit);

    res.json({
      page: page,
      totalPages: resultado.totalPages,
      productos: resultado.productos,
    });

  } catch (error) {
    console.error("Error en getProductosPaginados:", error);
    res.status(500).json({ error: "Error al obtener productos paginados" });
  }
}