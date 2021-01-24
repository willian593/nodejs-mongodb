const jwt = require('jsonwebtoken');
const Usuario = require('../model/users');

const validarJWT = async (req, res, next) => {
  // leer token
  const token = await req.header('x-token');
  if (!token) {
    return res.status(401).json({
      info: false,
      msg: 'No hay token en la petición (headers)',
    });
  }
  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = uid;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      info: false,
      msg: 'Token no valido',
    });
  }
};

/*
SOLO EL 'ADMIN_ROLE' PUEDE ACTUALIZAR EL ROLE
*/

const validarADMIN_ROLE = async (req, res, next) => {
  const { uid } = req;

  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        info: false,
        msg: 'Usuario no existe',
      });
    }
    if (usuarioDB.role !== 'ADMIN_ROLE') {
      return res.status(403).json({
        info: false,
        msg: 'No tienes permiso para crear usuarios',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: `Pongase en contacto con el administrador`,
    });
  }
};

/*
validarMismoUser.- permite actualizar sus 
propipios datos 
*/
const validarMismoUser = async (req, res, next) => {
  const uid = req.uid;
  const id = req.params.id;

  try {
    const usuarioDb = await Usuario.findById(uid);
    if (!usuarioDb) {
      return res.status(404).json({
        ok: false,
        msg: `usuario no existe`,
      });
    }
    if (usuarioDb.role === 'ADMIN_ROLE' || uid === id) {
      next();
    } else {
      return res.status(403).json({
        ok: false,
        msg: `No tienes permiso para cambiar el ROLE de este usuario`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: `Pongase en contacto con el administrador`,
    });
  }
};
module.exports = {
  validarJWT,
  validarADMIN_ROLE,
  validarMismoUser,
};
/*
validarJWT.- proteger rutas mediante token
*/
