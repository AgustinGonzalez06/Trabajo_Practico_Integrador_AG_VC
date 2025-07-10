import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import adminRoutes from './express/src/routes/admin/admin.routes.js';
import productosRoutes from './express/src/routes/admin/productos.routes.js';
import ventasRoutes from './express/src/routes/admin/ventas.routes.js';
import ventaRoutes from './express/src/routes/api/venta.routes.js';
import ticketRoutes from './express/src/routes/api/ticket.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set('PORT', 5000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'express', 'src', 'views'));

app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/tickets', ticketRoutes);

// Rutas
app.use('/admin', adminRoutes);         // Admin login, registro, dashboard, productos básicos, ventas
app.use('/admin/productos', productosRoutes);  // CRUD avanzado productos
app.use('/admin/ventas', ventasRoutes);         // Ventas admin
app.use('/api/venta', ventaRoutes);     // API de venta (confirmar compra)
app.use('/', productosRoutes);

app.use('/api/productos', productosRoutes);

// Ruta pública de login usuario (si tienes)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Public', 'loginUser.html'));
});

app.listen(app.get('PORT'), () => {
  console.log(`Servidor corriendo en http://localhost:${app.get('PORT')}`);
});
