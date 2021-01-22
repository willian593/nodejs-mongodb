const express = require('express');
const morgan = require('morgan');
const { dbConnection } = require('./conexion-mongo');

// crear servidor express
const app = express();

//Base de datos
dbConnection();

const port = process.env.PORT || 8080;
app.set('port', port);

/* 
============================================================== 
<!-- MIDDLEWARE -->
 ==============================================================
*/

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/* 
============================================================== 
<!-- rutas -->
 ==============================================================
*/

app.use('/api/usuarios', require('../src/routes/users'));

module.exports = app;
