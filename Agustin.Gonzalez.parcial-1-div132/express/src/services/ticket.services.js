import pool from '../../db.js';


export async function getTicketByVentaId(ventaId) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        dv.venta_id,
        v.fecha,
        p.nombre AS producto,
        dv.precio_unitario,
        dv.cantidad,
        dv.subtotal
      FROM detalle_venta dv
      JOIN productos p ON dv.producto_id = p.id
      JOIN venta v ON dv.venta_id = v.id
      WHERE dv.venta_id = ?
    `, [ventaId]);

    return rows;
  } catch (error) {
    console.error('Error en getTicketByVentaId:', error);
    throw error;
  }
}