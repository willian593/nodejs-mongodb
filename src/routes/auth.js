/*
/api/login/
*/
const { Router } = require('express');

const { login, googleSignupIn } = require('../controllers/auth');

const router = Router();

router.post('/', login);

router.post('/google', googleSignupIn);

module.exports = router;
