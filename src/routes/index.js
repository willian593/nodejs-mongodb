const express = require('express');
const app = express();

/* 
============================================================== 
<!-- rutas -->
 ==============================================================
*/

app.use('/api/usuarios', require('./users'));
app.use('/api/login', require('./auth'));

module.exports = app;
