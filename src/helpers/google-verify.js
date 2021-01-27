const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_ID);

const googleVerify = async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_ID,
  });
  const payload = ticket.getPayload();

  console.log(payload);
  const { name, email, picture } = payload;
  return { name, email, picture };

  //   return {
  //     nombre: payload.name,
  //     email: payload.email,
  //     password: '@@@',
  //     img: payload.picture,
  //     google: true,
  //   };
};

module.exports = {
  googleVerify,
};
