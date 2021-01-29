/*
/api/categorias/
*/
const { Router } = require('express');
const router = Router();
const {
  getCategorys,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/Category');

const {
  validarJWT,
  validarADMIN_ROLE,
  validarMismoUser,
} = require('../middleware/validar-jwt');

router.get('/', validarJWT, getCategorys);
router.get('/:id', validarJWT, getCategory);
router.post('/', [validarJWT], createCategory);
router.put('/:id', [validarJWT, validarMismoUser], updateCategory);
router.delete('/:id', [validarJWT, validarADMIN_ROLE], deleteCategory);

module.exports = router;
