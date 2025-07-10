import initDatabase from './express/src/config/initDB.js';
await initDatabase();
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

import adminRoutes from './express/src/routes/admin/admin.routes.js';
import productosRoutes from './express/src/routes/admin/productos.routes.js';
import ventasRoutes from './express/src/routes/admin/ventas.routes.js';
import ventaRoutes from './express/src/routes/api/venta.routes.js';
import ticketRoutes from './express/src/routes/api/ticket.routes.js';

// Cargar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Configuración
const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'express', 'src', 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.use('/admin', adminRoutes);
app.use('/admin/productos', productosRoutes);
app.use('/admin/ventas', ventasRoutes);
app.use('/api/venta', ventaRoutes);
app.use('/tickets', ticketRoutes);
app.use('/api/productos', productosRoutes);

// Ruta pública de login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'loginUser.html'));
});

// Servidor
app.listen(PORT, () => {
  console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
});
