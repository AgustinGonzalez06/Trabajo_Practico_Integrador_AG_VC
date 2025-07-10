import pool from '../../config/db.js';

export async function getProductosPaginadosService(page, limit) {
  const offset = (page - 1) * limit;

  // Parseo de seguridad
  const limitNum = parseInt(limit);
  const offsetNum = parseInt(offset);

  // Consulta SQL
  const [productos] = await pool.query(
    'SELECT * FROM productos LIMIT ? OFFSET ?',
    [limitNum, offsetNum]
  );

  // Total de productos
  const [totalRows] = await pool.query('SELECT COUNT(*) as total FROM productos');
  const total = totalRows[0].total;
  const totalPages = Math.ceil(total / limitNum);

  return {
    page,
    limit: limitNum,
    total,
    totalPages,
    productos
  };
}
