// middleware/validarLoginAdmin.js
export const validarLoginAdmin = (req, res, next) => {
  const { email, password } = req.body;
  const errores = [];

  if (!email || !email.trim()) {
    errores.push({ msg: 'El email es obligatorio.' });
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errores.push({ msg: 'Debe ingresar un email válido.' });
  }

  if (!password || password.length < 6) {
    errores.push({ msg: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  if (errores.length > 0) {
    return res.status(400).render('admin/login', {
      errorMsg: errores.map(e => e.msg).join(' | ')
    });
  }

  next();
};
