import mysql from 'mysql2/promise';

const init = async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin'
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS valoranttienda_db`);
    await connection.query(`USE valoranttienda_db`);

    await connection.query(`
    CREATE TABLE IF NOT EXISTS skins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(100) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    rareza VARCHAR(100),
    img VARCHAR(255),
    stock INT DEFAULT 0
  );
`);

    await connection.query(`
    CREATE TABLE IF NOT EXISTS monedas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(100) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    precio INT DEFAULT 0 NOT NULL,
    img VARCHAR(255),
    stock INT DEFAULT 0
  );
`);

    console.log("✅ Base de datos y tablas creadas");
  } catch (err) {
    console.error("❌ Error al crear la base:", err);
  } finally {
    await connection.end();
  }
};

init();