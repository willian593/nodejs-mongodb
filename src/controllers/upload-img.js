const { response } = require('express');
const Usuario = require('../model/users');
const Producto = require('../model/producto');
const Categoria = require('../model/categoria');
const path = require('path');
const fs = require('fs'); //Borrar imagen repetida
const { v4: uuidv4 } = require('uuid');
const { updateImg } = require('../helpers/update-img');

/*
--------------------------------------------------------
actualizar imagen (Metodo put)
--------------------------------------------------------
*/

const fileUpload = async (req, res) => {
  const { tipo } = req.params;
  const { id } = req.params;

  try {
    // validar id
    const u = await Usuario.findById(id);
    const p = await Producto.findById(id);
    const c = await Categoria.findById(id);

    if (!u && !p && !c) {
      return res.status(400).json({
        info: false,
        mgs: `El ID: ${id}, no corresponde a ninguno encontrado en la DB`,
      });
    }

    // validar si existe un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        info: false,
        msg: 'No se a seleccionado ningun archivo',
      });
    }

    // validar tipo
    const tiposValidos = ['usuarios', 'categorias', 'productos'];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({
        info: false,
        mgs: 'El tipo no corresponde con: usuarios, categorias, productos',
      });
    }

    //procesar la img
    const file = req.files.img;
    const nameCortado = file.name.split('.');
    const extensionArchivo = nameCortado[nameCortado.length - 1];

    //validar extension
    const extensionesValidas = ['png', 'jpg', 'JPG', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
      return res.status(400).json({
        info: false,
        msg: `La extension de este archivo es: ${extensionArchivo}, por lo tanto no corresponde a una imagen`,
      });
    }

    // generar el nombre del archivo
    const nameFile = `${uuidv4()}.${extensionArchivo}`;

    // guardar la imagen
    const path = `./src/uploads/${tipo}/${nameFile}`;

    //mover la imagen al directorio
    file.mv(path, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          info: false,
          err,
        });
      }

      //Actualizar BD
      updateImg(tipo, id, nameFile, res);

      res.json({
        info: true,
        mgs: 'Archivo subido correctamente',
        nameFile,
      });
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
--------------------------------------------------------
obtiene imagen cuando va iniciar seccion (metodo get)
--------------------------------------------------------
*/

const retornaImg = (req, res) => {
  const { tipo } = req.params;
  const { foto } = req.params;

  const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    const pathImg = path.join(__dirname, `../uploads/no-img.png`);
    res.sendFile(pathImg);
  }
};

module.exports = {
  fileUpload,
  retornaImg,
};
