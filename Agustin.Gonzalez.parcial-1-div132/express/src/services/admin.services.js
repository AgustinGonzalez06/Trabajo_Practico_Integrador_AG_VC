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

