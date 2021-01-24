const jwt = require('jsonwebtoken');

const generarJWT = (uid) => {
  const jwtScret = process.env.JWT_SECRET;
  console.log(jwtScret);
  return new Promise((resolve, reject) => {
    const payload = {
      uid,
    };
    jwt.sign(payload, jwtScret, { expiresIn: '12h' }, (err, token) => {
      if (err) {
        console.log(err);
        reject('No se puede generar el JWT');
      } else {
        resolve(token);
      }
    });
  });
};

module.exports = {
  generarJWT,
};
