import { getTicketByVentaId } from '../../services/api/ticket.services.js';

export async function obtenerTicket(req, res) {
  const { id } = req.params;
  try {
    const ticket = await getTicketByVentaId(id);

    if (!ticket || ticket.length === 0) {
      return res.status(404).json([]);
    }

    res.json(ticket);
  } catch (error) {
    console.error('Error en obtenerTicket:', error); // <--- Este log es clave
    res.status(500).json({ error: 'Error al generar el ticket' });
  }
}
