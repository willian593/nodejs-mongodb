const fs = require('fs');

const Usuario = require('../model/users');
const Producto = require('../model/producto');
const Categoria = require('../model/categoria');

// borrar la img
const deleteImg = (path) => {
  if (fs.existsSync(path)) {
    // borrar la imagen anterior
    fs.unlinkSync(path);
  }
};

const updateImg = async (tipo, id, nameFile, res) => {
  let pathViejo = '';

  switch (tipo) {
    case 'usuarios':
      const usuario = await Usuario.findById(id);
      // if (!usuario) {
      //   return res.status(400).json({
      //     info: false,
      //     msg: `No existe un usuario con ese ${id}`,
      //   });
      // }

      pathViejo = `./src/uploads/usuarios/${usuario.img}`;
      deleteImg(pathViejo);
      usuario.img = nameFile;
      await usuario.save();
      return true;

    case 'productos':
      const producto = await Producto.findById(id);
      // if (!producto) {
      //   console.log('No es un producto por id');
      //   return false;
      // }
      pathViejo = `./src/uploads/productos/${producto.img}`;
      deleteImg(pathViejo);
      producto.img = nameFile;
      await producto.save();
      return true;

    case 'categorias':
      const categoria = await Categoria.findById(id);
      // if (!categoria) {
      //   console.log('No es un categoria por id');
      //   return false;
      // }
      pathViejo = `./src/uploads/categorias/${categoria.img}`;
      deleteImg(pathViejo);
      categoria.img = nameFile;
      await categoria.save();
      return true;
  }
};

module.exports = {
  updateImg,
};
