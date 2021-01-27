const bcrypt = require('bcrypt');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../model/users');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // verificar email
    const existEmail = await Usuario.findOne({ email });
    if (!existEmail) {
      return res.status(404).json({
        info: false,
        mgs: 'Correo electrónico no encontrado',
      });
    }

    // verificar contraseña
    const validarPass = bcrypt.compareSync(password, existEmail.password);
    if (!validarPass) {
      return res.status(400).json({
        info: false,
        msg: 'Contraseña no valida',
      });
    }

    // generar el token JWT
    const token = await generarJWT(existEmail.id);

    res.json({
      info: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      info: false,
      msg: 'Comuniquese con el administrador',
    });
  }
};

/*
=====================================
          Google signup in
=====================================
*/

const googleSignupIn = async (req, res) => {
  const googleToken = req.body.token;
  try {
    const { name, email, picture } = await googleVerify(googleToken);
    // const googleUser = await googleVerify(googleToken);

    // validar email de google si existe
    const usuarioDB = await Usuario.findOne({ email });
    let usuario;
    if (!usuarioDB) {
      // si no existe creo uno
      // nuevo con la info de google
      usuario = new Usuario({
        first_name: name,
        email,
        password: '@@@',
        img: picture,
        google: true,
      });
    } else {
      // si existe usuario
      usuario = usuarioDB;
      usuario.google = true;
    }
    // save DB
    await usuario.save();
    // generar el token JWT
    const token = await generarJWT(usuario.id);
    res.json({
      info: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      info: false,
      msg: 'El token no es correcto',
    });
  }
};

module.exports = {
  login,
  googleSignupIn,
};
