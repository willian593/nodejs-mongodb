require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const app = express();

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

app.get('/', (req, res) => {
  res.json('Hello World!');
});

app.post('/usuario', (req, res) => {
  const body = req.body;
  if (body.nombre === undefined) {
    res.status(400).json({
      info: false,
      msg: 'El nombre es necesario',
    });
  } else {
    res.json({
      msg: 'post usuario',
      body,
    });
  }
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
