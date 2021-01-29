const express = require('express');
const app = express();

/* 
============================================================== 
<!-- rutas -->
 ==============================================================
*/

app.use('/api/usuarios', require('./users'));
app.use('/api/login', require('./auth'));
app.use('/api/categorias', require('./categoria'));
app.use('/api/productos', require('./producto'));

// obtener sola una categoria y producto
app.use('/api/categoria', require('./categoria'));
app.use('/api/producto', require('./producto'));

module.exports = app;
