import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'valoranttienda_db', // si aún no existe, se puede crear en otro archivo
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;