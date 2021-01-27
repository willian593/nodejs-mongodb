const express = require('express');
const morgan = require('morgan');
const { dbConnection } = require('./conexion-mongo');
const path = require('path');

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

// habilitar la carpeta public, necesitamos importar el path
app.use(express.static(path.resolve(__dirname, '../src/public')));

/* 
============================================================== 
<!-- Configuracion global de rutas -->
 ==============================================================
*/

app.use(require('../src/routes/index'));

module.exports = app;
