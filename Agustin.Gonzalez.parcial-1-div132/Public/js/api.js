export let productosGlobal = [];

export async function cargarDatos() {
  try {
    const res = await fetch('/api/productos');
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const datos = await res.json();

    productosGlobal = datos;

    return datos;
  } catch (error) {
    console.error("Error al cargar datos desde API:", error);
    return [];
  }
}