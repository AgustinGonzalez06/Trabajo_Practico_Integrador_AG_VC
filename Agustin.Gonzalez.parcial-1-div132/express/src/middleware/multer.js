// middleware/multer.js
import multer from 'multer';
import path from 'path';

// Configuración del storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Carpeta base donde guardar
    cb(null, path.join('Public', 'uploads', req.body.categoria || 'otros'));
  },
  filename: function (req, file, cb) {
    // Nombre archivo: timestamp + original name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filtro para solo aceptar imágenes
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Solo imágenes son permitidas'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB máximo
});

export default upload;
