import mysql from 'mysql2/promise';

const DB_NAME = 'valoranttienda_db';

const config = {
  host: 'localhost',
  user: 'root',
  password: 'admin',
  multipleStatements: true
};


//se crea la bd con sus respectivas tablas y campos en caso de que no existan
//se insertan productos por defecto si la tabla productos esta vacia  
async function initDatabase() {
  let connection;

  try {
    connection = await mysql.createConnection(config);

    // Crear base de datos si no existe y usarla
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.query(`USE \`${DB_NAME}\``);

    // Crear tablas si no existen
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

    // Verificar si la tabla productos está vacía para insertar datos
    const [rows] = await connection.query('SELECT COUNT(*) AS count FROM productos');
    if (rows[0].count === 0) {
      const insertProductosSQL = `
        INSERT INTO productos (nombre, precio, categoria, subcategoria, img, activo, destacado) VALUES
        ('Vandal Araxys', 20, 'skin', 'deluxe', 'uploads/skins/Araxys_Vandal.webp', 1, 0),
        ('Vandal Evori Dreamwings', 25, 'skin', 'deluxe', 'uploads/skins/Evori_Dreamwings_Vandal.webp', 1, 0),
        ('Vandal Kuronami', 23, 'skin', 'deluxe', 'uploads/skins/Kuronami_Vandal.webp', 1, 0),
        ('Vandal Prime', 17, 'skin', 'deluxe', 'uploads/skins/prime_Vandal.webp', 1, 0),
        ('Vandal Reaver', 17, 'skin', 'deluxe', 'uploads/skins/Reaver_Vandal.webp', 1, 0),
        ('Vandal Singularity', 20, 'skin', 'deluxe', 'uploads/skins/Singularity_Vandal.webp', 1, 0),
        ('475 valorant points', 5, 'moneda', 'vp', 'uploads/monedas/475vp.jpg', 1, 0),
        ('1000 valorant points', 10, 'moneda', 'vp', 'uploads/monedas/1000vp.jpg', 1, 0),
        ('2050 valorant points', 20, 'moneda', 'vp', 'uploads/monedas/2050vp.jpg', 1, 0),
        ('3650 valorant points', 35, 'moneda', 'vp', 'uploads/monedas/3650vp.jpg', 1, 0),
        ('5350 valorant points', 50, 'moneda', 'vp', 'uploads/monedas/5350vp.jpg', 1, 0),
        ('11000 valorant points', 100, 'moneda', 'vp', 'uploads/monedas/11000vp.jpg', 1, 0),
        ('20 radiant points', 5, 'moneda', 'radiant', 'uploads/monedas/20r.jpg', 1, 0),
        ('40 radiant points', 10, 'moneda', 'radiant', 'uploads/monedas/40r.jpg', 1, 0),
        ('80 radiant points', 15, 'moneda', 'radiant', 'uploads/monedas/80r.jpg', 1, 0),
        ('750 riot points', 5, 'moneda', 'rp', 'uploads/monedas/750rp.png', 1, 0),
        ('1500 riot points', 10, 'moneda', 'rp', 'uploads/monedas/1500rp.png', 1, 0),
        ('2250 riot points', 15, 'moneda', 'rp', 'uploads/monedas/2250rp.png', 1, 0),
        ('3750 riot points', 25, 'moneda', 'rp', 'uploads/monedas/3750rp.png', 1, 0),
        ('7500 riot points', 50, 'moneda', 'rp', 'uploads/monedas/7500rp.png', 1, 0),
        ('120000 riot points', 80, 'moneda', 'rp', 'uploads/monedas/12000rp.png', 1, 0);
      `;
      await connection.query(insertProductosSQL);
      console.log('✅ Productos insertados correctamente');
    } else {
      console.log('ℹ️ La tabla productos ya contiene datos, no se insertaron nuevos.');
    }

    console.log('✅ Base de datos y tablas verificadas/creadas correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

// Ejecutar si se llama directamente
initDatabase();
