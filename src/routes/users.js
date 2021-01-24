/*
/api/usuarios/
*/
const { Router } = require('express');
const router = Router();
const {
  getUsers,
  createUsers,
  updateUsers,
  deleteUsers,
} = require('../controllers/users');

const {
  validarJWT,
  validarADMIN_ROLE,
  validarMismoUser,
} = require('../middleware/validar-jwt');

router.get('/', validarJWT, getUsers);
router.post('/', [validarJWT], createUsers);
router.put('/:id', [validarJWT, validarMismoUser], updateUsers);
router.delete('/:id', [validarJWT, validarADMIN_ROLE], deleteUsers);

module.exports = router;
