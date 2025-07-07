export let productosGlobal = [];

export function setProductosGlobal(data) {
  productosGlobal = data;
}

export async function cargarDatos() {
  try {
    const res = await fetch('/api/productos/activos');
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const datos = await res.json();

    setProductosGlobal(datos);
    return datos;
  } catch (error) {
    console.warn("Error al cargar desde API, intento cargar desde JSON local:", error);
    try {
      const backupRes = await fetch('/productos.json');
      if (!backupRes.ok) throw new Error(`Error backup ${backupRes.status}`);
      const backupDatos = await backupRes.json();

      setProductosGlobal(backupDatos);
      return backupDatos;
    } catch (backupError) {
      console.error("Error al cargar datos desde JSON local:", backupError);
      return [];
    }
  }
}
