const bcrypt = require('bcrypt');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../model/users');

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

module.exports = {
  login,
};
