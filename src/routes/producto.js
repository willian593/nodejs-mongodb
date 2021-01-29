/*
/api/productos/
*/
const { Router } = require('express');
const router = Router();
const {
  getProductos,
  getProducto,
  createProducto,
  updateProducto,
  deleteProducto,
} = require('../controllers/Producto');

const {
  validarJWT,
  validarADMIN_ROLE,
  validarMismoUser,
} = require('../middleware/validar-jwt');

router.get('/', validarJWT, getProductos);
router.get('/:id', validarJWT, getProducto);
router.post('/', [validarJWT], createProducto);
router.put('/:id', [validarJWT], updateProducto);
router.delete('/:id', [validarJWT], deleteProducto);

module.exports = router;
