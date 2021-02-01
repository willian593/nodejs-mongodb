require('dotenv').config();

const app = require('./app');

app.listen(app.get('port'), () => {
  console.log(
    `⚡️[server]: Example app listening at http://localhost:${app.get('port')}`
  );
});
