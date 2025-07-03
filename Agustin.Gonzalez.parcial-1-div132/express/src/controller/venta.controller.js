import { crearVenta } from '../services/venta.services.js';

export async function confirmarCompra(req, res) {
    console.log("BODY recibido:", req.body);
  const { clienteNombre, productos } = req.body;

  if (!clienteNombre || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

try {
    const resultado = await crearVenta(clienteNombre, productos);
    res.status(201).json({ mensaje: "Compra realizada", ...resultado });
  } catch (error) {
    console.error("❌ Error en confirmarCompra:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
