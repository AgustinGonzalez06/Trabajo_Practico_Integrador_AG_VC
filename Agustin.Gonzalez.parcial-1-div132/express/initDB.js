import mysql from 'mysql2/promise';

const DB_NAME = 'valoranttienda_db';

const config = {
  host: 'localhost',
  user: 'root',
  password: 'admin',
  multipleStatements: true
};

async function initDatabase() {
  try {
    const connection = await mysql.createConnection(config);

    // Crear base de datos si no existe
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.query(`USE \`${DB_NAME}\``);

    // Crear tablas
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) NOT NULL UNIQUE,
        contrasenia VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        precio INT NOT NULL,
        categoria ENUM('moneda', 'skin') NOT NULL,
        subcategoria VARCHAR(50),
        img VARCHAR(255),
        activo TINYINT(1) DEFAULT 1,
        destacado TINYINT(1) DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS venta (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cliente_nombre VARCHAR(100) NOT NULL,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        total DECIMAL(10,2) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS detalle_venta (
        id INT AUTO_INCREMENT PRIMARY KEY,
        venta_id INT NOT NULL,
        producto_id INT NOT NULL,
        cantidad INT NOT NULL,
        precio_unitario DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (venta_id) REFERENCES venta(id) ON DELETE CASCADE,
        FOREIGN KEY (producto_id) REFERENCES productos(id)
      );
    `);

    console.log('✅ Base de datos y tablas verificadas/creadas correctamente');
    await connection.end();
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
  }
}

// Ejecutar si se llama directamente
initDatabase();
