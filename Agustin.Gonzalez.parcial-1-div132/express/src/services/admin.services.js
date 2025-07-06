import pool from '../../db.js';
import bcrypt from 'bcrypt';

export const createAdmin = async ({ email, contraseña }) => {
  // Aquí generamos el hash
  const hash = await bcrypt.hash(contraseña, 10);

  const [result] = await pool.query(
    'INSERT INTO admins (email, contraseña) VALUES (?, ?)',
    [email, hash]
  );
  return result.insertId;
};

export const getAdminByEmail = async (email) => {
  const [rows] = await pool.query(
    'SELECT * FROM admins WHERE email = ?',
    [email]
  );
  return rows[0];
};


export async function obtenerVentas() {
  const query = `
    SELECT 
      v.id AS venta_id,
      v.cliente_nombre,
      v.fecha,
      v.total,
      p.nombre AS producto_nombre,
      dv.cantidad,
      dv.precio_unitario
    FROM venta v
    JOIN detalle_venta dv ON dv.venta_id = v.id
    JOIN productos p ON p.id = dv.producto_id
    ORDER BY v.fecha DESC, v.id;
  `;
  const [rows] = await pool.query(query);

  // Agrupar ventas y sus productos
  const ventasMap = new Map();

  for (const row of rows) {
    const {
      venta_id,
      cliente_nombre,
      fecha,
      total,
      producto_nombre,
      cantidad,
      precio_unitario,
    } = row;

    if (!ventasMap.has(venta_id)) {
      ventasMap.set(venta_id, {
        venta_id,
        cliente_nombre,
        fecha,
        total,
        productos: [],
      });
    }

    ventasMap.get(venta_id).productos.push({
      nombre: producto_nombre,
      cantidad,
      precio_unitario,
    });
  }

  return Array.from(ventasMap.values());
}