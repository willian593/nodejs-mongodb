const { response } = require('express');
const Usuario = require('../model/users');
const Categoria = require('../model/categoria');
const Producto = require('../model/producto');

/*
=================================================
BUSQUEDA todo
=================================================
*/
const getTodo = async (req, res = response) => {
  const { busqueda } = req.params;
  const regex = new RegExp(busqueda, 'i');

  const [usuarios, categorias, productos] = await Promise.all([
    //Usuario.find().or => buscar en el campo: nombre y email
    Usuario.find().or([{ first_name: regex }, { email: regex }]),
    Categoria.find({ descripcion: regex }),
    Producto.find({ nombre: regex }),
  ]);

  res.json({
    ok: true,
    usuarios,
    categorias,
    productos,
  });
};

/*
=================================================
BUSQUEDA POR coleccion
=================================================
*/

const getDocumentosColeccion = async (req, res = response) => {
  const { tabla } = req.params;
  const { busqueda } = req.params;
  const regex = new RegExp(busqueda, 'i');

  let data = [];
  switch (tabla) {
    case 'usuarios':
      data = await Usuario.find({ first_name: regex });
      break;

    case 'productos':
      data = await Producto.find({ nombre: regex });
      break;

    case 'categorias':
      data = await Categoria.find({ descripcion: regex });
      break;

    default:
      return res.status(400).json({
        ok: false,
        msg: 'La tabla tiene que ser /usuarios/productos/categorias',
      });
  }

  res.json({
    ok: true,
    resultados: data,
  });
};

module.exports = {
  getTodo,
  getDocumentosColeccion,
};
