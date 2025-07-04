
export let productosGlobal = [];

export function setProductosGlobal(data) {
  productosGlobal = data;
}

export async function cargarDatos() {
  try {
    const res = await fetch('/api/productos/activos');
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const datos = await res.json();

    setProductosGlobal(datos); // ✅ actualiza la referencia

    return datos;
  } catch (error) {
    console.error("Error al cargar datos desde API:", error);
    return [];
  }
}