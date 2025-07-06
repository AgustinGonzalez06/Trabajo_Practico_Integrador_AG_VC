

document.addEventListener('DOMContentLoaded', () => {
  const categoriaSelect = document.getElementById('categoria');
  const subcategoriaSelect = document.getElementById('subcategoria');
  const precioInput = document.getElementById('precio');

  if (!categoriaSelect || !subcategoriaSelect || !precioInput) return;

  const subcategoriasPorCategoria = {
    moneda: ['vp', 'rp', 'radiant'],
    skin: ['selecta', 'deluxe', 'premium', 'ultra', 'exclusive']
  };

  const preciosPorSubcategoria = {
    selecta: 8,
    deluxe: 12,
    premium: 17,
    ultra: 20,      // para rango, valida en backend
    exclusive: 45   // para rango, valida en backend
  };

  function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  function actualizarSubcategorias() {
    const categoria = categoriaSelect.value;
    const opciones = subcategoriasPorCategoria[categoria] || [];
    subcategoriaSelect.innerHTML = '';

    if (opciones.length === 0) {
      const option = document.createElement('option');
      option.text = 'Seleccione categoría primero';
      option.disabled = true;
      option.selected = true;
      subcategoriaSelect.add(option);
      precioInput.value = '';
      return;
    }

    opciones.forEach(subcat => {
      const option = document.createElement('option');
      option.value = subcat;
      option.text = capitalizar(subcat);
      subcategoriaSelect.add(option);
    });

    // Intenta mantener la selección previa si existe y coincide
    const prevSubcat = subcategoriaSelect.getAttribute('data-selected');
    if (prevSubcat && opciones.includes(prevSubcat)) {
      subcategoriaSelect.value = prevSubcat;
    } else {
      subcategoriaSelect.selectedIndex = 0;
    }

    actualizarPrecio();
  }

  function actualizarPrecio() {
    const subcat = subcategoriaSelect.value;
    if (preciosPorSubcategoria[subcat]) {
      precioInput.value = preciosPorSubcategoria[subcat];
    } else {
      precioInput.value = '';
    }
  }

  categoriaSelect.addEventListener('change', actualizarSubcategorias);
  subcategoriaSelect.addEventListener('change', actualizarPrecio);

  // Inicializar
  actualizarSubcategorias();
});
