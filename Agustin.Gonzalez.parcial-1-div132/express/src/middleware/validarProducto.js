import { body, validationResult } from 'express-validator';

export const validarProducto = [
  // Validar nombre: requerido, 3 a 100 caracteres
  body('nombre')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('El nombre debe tener entre 3 y 100 caracteres'),

  // Validar categoría: solo 'moneda' o 'skin'
  body('categoria')
    .isIn(['moneda', 'skin'])
    .withMessage('Categoría inválida'),

  // Validar subcategoría según categoría seleccionada
  body('subcategoria')
    .custom((value, { req }) => {
      const cat = req.body.categoria;
      const monedas = ['vp', 'rp', 'radiant'];
      const skins = ['selecta', 'deluxe', 'premium', 'ultra', 'exclusive'];

      if (cat === 'moneda' && !monedas.includes(value)) {
        throw new Error('Subcategoría inválida para Moneda');
      }
      if (cat === 'skin' && !skins.includes(value)) {
        throw new Error('Subcategoría inválida para Skin');
      }
      return true;
    }),

  // Validar precio: entero positivo
  body('precio')
    .isInt({ min: 1 })
    .withMessage('El precio debe ser un número entero positivo')
    .custom((value, { req }) => {
      const sub = req.body.subcategoria;
      const precio = parseInt(value, 10);

      // Reglas de precio por subcategoría
      if (sub === 'selecta' && precio !== 8) {
        throw new Error('Precio para Selecta debe ser 8');
      }
      if (sub === 'deluxe' && precio !== 12) {
        throw new Error('Precio para Deluxe debe ser 12');
      }
      if (sub === 'premium' && precio !== 17) {
        throw new Error('Precio para Premium debe ser 17');
      }
      if (sub === 'ultra' && (precio < 20 || precio > 40)) {
        throw new Error('Precio para Ultra debe estar entre 20 y 40');
      }
      if (sub === 'exclusive' && (precio < 45 || precio > 70)) {
        throw new Error('Precio para Exclusive debe estar entre 45 y 70');
      }
      return true;
    }),

  // Opcional: Validar imagen si quieres, por ejemplo que exista
  body('img').custom((value, { req }) => {
    if (!req.file && !req.body.img) {
      // No hay archivo ni valor previo
      throw new Error('Debe subir una imagen');
    }
    return true;
  }),

  // Middleware para manejar errores
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      // Pasa errores al controlador o renderiza acá
      return res.status(400).render('admin/agregarProducto', {
        errores: errores.array(),
        datos: req.body,
      });
    }
    next();
  },
];
