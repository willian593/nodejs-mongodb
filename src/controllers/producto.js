const { response } = require('express');
const bcrypt = require('bcrypt');
const Producto = require('../model/producto');

/* 
=========================== 
<!-- OBTENER TODOS PRODUCTOS  -->
 ===========================
*/
const getProductos = async (req, res = response) => {
  const desde = Number(req.query.desde) || 0;
  const mostrar = Number(req.query.mostrar) || 5;

  const [productos, total] = await Promise.all([
    Producto.find({ disponible: true }).skip(desde).limit(mostrar),

    Producto.countDocuments({ disponible: true }),
  ]);
  res.json({
    info: true,
    productos,
    total,
  });
};

/* 
=========================== 
<!-- OBTENER SOLO UN PRODCUTO  -->
 ===========================
*/

const getProducto = async (req, res) => {
  const { id } = req.params;

  try {
    // validar si existe id
    const producto = await Producto.findById(id)
      .populate('usuario ', 'first_name img')
      .populate('categoria', 'descripcion -usuario');
    if (!producto) {
      return res.status(400).json({
        info: false,
        msg: `No existe un usuario con ese id ${id}`,
      });
    }
    res.json({
      info: true,
      producto,
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
<!-- CREAR PRODUCTO -->
 ===========================
*/
const createProducto = async (req, res = response) => {
  /*
    uid biene del token 
    */
  const { uid } = req;

  const producto = new Producto({
    usuario: uid,
    categoria: req.body,
    ...req.body,
  });

  const { nombre } = req.body;

  try {
    const existProducto = await Producto.findOne({ nombre });
    if (existProducto) {
      return res.status(400).json({
        info: false,
        msg: 'Este producto ya esta registrada',
      });
    }
    await producto.save();
    res.json({
      info: true,
      producto,
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
<!-- ACTUALIZAR PRODUCTO -->
 ===========================
*/
const updateProducto = async (req, res = response) => {
  const { id } = req.params;
  try {
    // validar si existe id
    const ProductoDB = await Producto.findById(id);
    if (!ProductoDB) {
      return res.status(400).json({
        info: false,
        msg: `No existe un usuario con ese id ${id}`,
      });
    }

    // Actualizar en la DB
    const { categoria, usuario, ...camposUpdate } = req.body;

    // actualizar datos
    const ProductoAct = await Producto.findByIdAndUpdate(id, camposUpdate, {
      new: true,
      runValidators: true,
    });
    res.json({
      info: true,
      ProductoAct,
      mgs: 'Producto actualizado',
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
<!-- ELIMINAR PRODUCTO -->
 ===========================
*/
const deleteProducto = async (req, res = response) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    // validar si existe id
    const productoDB = await Producto.findById(id);
    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        msg: `No existe un producto con ese id ${id}`,
      });
    }
    // Elimina el usurio de la DB
    // await Categoria.findByIdAndDelete(id);

    const changeDisponi = {
      disponible: false,
    };

    const productoUpdate = await Producto.findByIdAndUpdate(id, changeDisponi, {
      new: true,
    });

    // respuesta correcta
    res.json({
      info: true,
      producto: {
        nombre: productoUpdate.nombre,
        disponible: productoUpdate.disponible,
      },
      msg: `El producto ${nombre} ha sido eliminado`,
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
  getProductos,
  getProducto,
  createProducto,
  updateProducto,
  deleteProducto,
};
