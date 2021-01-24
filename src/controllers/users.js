const { response } = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../model/users');

/* 
=========================== 
<!-- OBTENER USUARIOS -->
 ===========================
*/
const getUsers = async (req, res = response) => {
  const desde = Number(req.query.desde) || 0;
  const mostrar = Number(req.query.mostrar) || 5;

  const [usuarios, total] = await Promise.all([
    Usuario.find({ state: true }, 'first_name state email') // solo quiero q aparesca el nombre
      .skip(desde)
      .limit(mostrar)
      .sort({ first_name: 1 })
      .collation({ locale: 'en', strength: 2 }),

    Usuario.countDocuments({ state: true }),
  ]);
  res.json({
    info: true,
    usuarios,
    total,
  });
};

/* 
=========================== 
<!-- CREAR USUARIOS -->
 ===========================
*/
const createUsers = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const usuario = new Usuario(req.body);

    //ENCRIPTAR CONTRASEÑA
    const encriptar = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, encriptar);

    // SAVE DB
    await usuario.save();

    res.json({
      info: true,
      usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      info: false,
      error: error.message,
    });
  }
};
/* 
=========================== 
<!-- ACTUALIZAR USUARIOS -->
 ===========================
*/
const updateUsers = async (req, res = response) => {
  const { id } = req.params;
  try {
    // validar si existe id
    const userDB = await Usuario.findById(id);
    if (!userDB) {
      return res.status(400).json({
        info: false,
        msg: `No existe un usuario con ese id ${id}`,
      });
    }

    // Actualizar en la DB

    const {
      password,
      google,
      facebook,
      twitter,
      instgram,
      email,
      ...camposUpdate
    } = req.body;

    // validar existe email

    if (userDB.email !== email) {
      const existEmail = await Usuario.findOne({ email });
      const correo = req.body.email;

      if (existEmail) {
        return res.status(404).json({
          ok: false,
          msg: `Ya existe un usuario con este email ${correo}`,
        });
      }
    }

    // actualizar datos
    const userActualizado = await Usuario.findByIdAndUpdate(id, camposUpdate, {
      new: true,
      runValidators: true,
    });
    res.json({
      info: true,
      user: userActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      info: false,
      error: error.message,
    });
  }
};

/* 
=========================== 
<!-- ELIMINAR USUARIOS -->
 ===========================
*/
const deleteUsers = async (req, res = response) => {
  const { first_name } = req.body;
  const { id } = req.params;
  try {
    // validar si existe id
    const userDB = await Usuario.findById(id);
    if (!userDB) {
      return res.status(400).json({
        ok: false,
        msg: `No existe un usuario con ese id ${id}`,
      });
    }
    // Elimina el usurio de la DB
    // await Usuario.findByIdAndDelete(id);
    const changeState = {
      state: false,
    };
    const userUpdate = await Usuario.findByIdAndUpdate(id, changeState, {
      new: true,
    });

    // respuesta correcta
    res.json({
      info: true,
      user: {
        first_name: userUpdate.first_name,
        state: userUpdate.state,
      },
      msg: 'Se cambio el state a false',
      // msg: `El usuario ${first_name} fue eliminado`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      info: false,
      msg: 'Error inesperado',
    });
  }
};

module.exports = {
  getUsers,
  createUsers,
  updateUsers,
  deleteUsers,
};
