/*
   ruta: api/busqueda/
*/
const { Router } = require('express');
const { validarJWT } = require('../middleware/validar-jwt');

const { getTodo, getDocumentosColeccion } = require('../controllers/search');

const router = Router();

router.get('/:busqueda', validarJWT, getTodo);

router.get('/coleccion/:tabla/:busqueda', validarJWT, getDocumentosColeccion);

module.exports = router;
