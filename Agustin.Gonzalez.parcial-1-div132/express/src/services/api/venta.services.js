import pool from '../../config/db.js';

export async function crearVenta(clienteNombre, productos) {
  const conn = await pool.getConnection(); 


  try {
    await conn.beginTransaction();

    const total = productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

    const [ventaResult] = await conn.query(
      'INSERT INTO venta (cliente_nombre, total) VALUES (?, ?)',
      [clienteNombre, total]
    );

    const ventaId = ventaResult.insertId;

    for (const prod of productos) {
      await conn.query(
        `INSERT INTO detalle_venta 
        (venta_id, producto_id, cantidad, precio_unitario) 
        VALUES (?, ?, ?, ?)`,
        [ventaId, prod.id, prod.cantidad, prod.precio]
      );
    }

    await conn.commit();
    return { success: true, ventaId };

  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
