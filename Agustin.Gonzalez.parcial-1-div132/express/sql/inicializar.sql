-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS valoranttienda_db;
USE valoranttienda_db;

-- Crear la tabla productos
CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio INT NOT NULL,
  categoria ENUM('moneda', 'skin') NOT NULL,
  subcategoria VARCHAR(50),
  img VARCHAR(255),
  activo BOOLEAN DEFAULT TRUE,
  destacado BOOLEAN DEFAULT FALSE
);
