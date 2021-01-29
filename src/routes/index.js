const express = require('express');
const app = express();

/* 
============================================================== 
<!-- rutas -->
 ==============================================================
*/

app.use('/api/usuarios', require('./users'));
app.use('/api/categorias', require('./categoria'));
app.use('/api/productos', require('./producto'));
app.use('/api/login', require('./auth'));

// obtener sola una categoria y producto
app.use('/api/categoria', require('./categoria'));
app.use('/api/producto', require('./producto'));

// busqueda
app.use('/api/busqueda', require('./search'));

module.exports = app;
