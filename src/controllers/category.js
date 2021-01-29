const { response } = require('express');
const bcrypt = require('bcrypt');
const Categoria = require('../model/categoria');

/* 
=========================== 
<!-- OBTENER TODOS CATEGORIAS  -->
 ===========================
*/
const getCategorys = async (req, res = response) => {
  // const desde = Number(req.query.desde) || 0;
  // const mostrar = Number(req.query.mostrar) || 5;

  const [categorias, total] = await Promise.all([
    Categoria.find({}),
    // .skip(desde)
    // .limit(mostrar)

    Categoria.countDocuments({}),
  ]);
  res.json({
    info: true,
    categorias,
    total,
  });
};

/* 
=========================== 
<!-- OBTENER SOLO UNA CATEGORIAS  -->
 ===========================
*/

const getCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // validar si existe id
    const categoria = await Categoria.findById(id);
    if (!categoria) {
      return res.status(400).json({
        info: false,
        msg: `No existe un usuario con ese id ${id}`,
      });
    }
    res.json({
      info: true,
      categoria,
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
<!-- CREAR USUARIOS -->
 ===========================
*/
const createCategory = async (req, res = response) => {
  /*
    uid biene del token 
    */
  const { uid } = req;

  const categoria = new Categoria({
    usuario: uid,
    ...req.body,
  });

  const { descripcion } = req.body;

  try {
    const existCategory = await Categoria.findOne({ descripcion });
    if (existCategory) {
      return res.status(400).json({
        info: false,
        msg: 'La categoria ya esta registrada',
      });
    }
    await categoria.save();
    res.json({
      info: true,
      categoria,
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
<!-- ACTUALIZAR CATEGORIAS -->
 ===========================
*/
const updateCategory = async (req, res = response) => {
  const { id } = req.params;
  try {
    // validar si existe id
    const categoryDB = await Categoria.findById(id);
    if (!categoryDB) {
      return res.status(400).json({
        info: false,
        msg: `No existe un usuario con ese id ${id}`,
      });
    }

    // Actualizar en la DB
    const { usuario, email, ...camposUpdate } = req.body;

    // validar existe email
    if (categoryDB.email !== email) {
      const existEmail = await Categoria.findOne({ email });
      const { email } = req.body;

      if (existEmail) {
        return res.status(404).json({
          info: false,
          msg: `Ya existe un usuario con este email ${email}`,
        });
      }
    }

    // actualizar datos
    const categoryAct = await Categoria.findByIdAndUpdate(id, camposUpdate, {
      new: true,
      runValidators: true,
    });
    res.json({
      info: true,
      categoria: categoryAct,
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
const deleteCategory = async (req, res = response) => {
  const { id } = req.params;
  const { descripcion } = req.body;
  try {
    // validar si existe id
    const categoriaDB = await Categoria.findById(id);
    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        msg: `No existe una categoria con ese id ${id}`,
      });
    }
    // Elimina el usurio de la DB
    await Categoria.findByIdAndDelete(id);

    // respuesta correcta
    res.json({
      info: true,
      msg: `La categoria ${descripcion} eliminada`,
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
  getCategorys,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
