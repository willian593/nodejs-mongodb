const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');

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

// habilitar la carpeta public, necesitamos importar el path
app.use(express.static(path.resolve(__dirname, '../src/public')));

app.use(helmet());
app.use(helmet.hidePoweredBy());
app.disable('x-powered-by');

/* 
============================================================== 
<!-- Configuracion global de rutas -->
 ==============================================================
*/

app.use(require('../src/routes/index'));

module.exports = app;
