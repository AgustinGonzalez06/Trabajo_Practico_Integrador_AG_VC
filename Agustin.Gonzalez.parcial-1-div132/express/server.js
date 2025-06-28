import skinRoutes from './src/routes/skin.routes.js';
import monedasRouter from './src/routes/moneda.routes.js';
import productosRouter from './src/routes/productos.routes.js'; // ⬅️ nuevo import
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set("PORT", 5000);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.json());

// Rutas API
app.use('/api/productos', productosRouter); // ⬅️ nueva ruta unificada

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'loginUser.html'));
});

app.listen(app.get("PORT"), () => {
  console.log(`Server corriendo en http://localhost:${app.get("PORT")}`);
});
