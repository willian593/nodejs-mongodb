/*
/api/upload
*/
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');
const { validarJWT, verificaTokenImg } = require('../middleware/validar-jwt');
const { fileUpload, retornaImg } = require('../controllers/upload-img');

const router = Router();

router.use(expressFileUpload());

router.put('/:tipo/:id', validarJWT, fileUpload);

router.get('/:tipo/:foto', verificaTokenImg, retornaImg);

module.exports = router;
