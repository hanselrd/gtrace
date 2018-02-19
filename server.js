const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const models = require('./models');

const app = express();
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/graphql', async (req, res) => {
  // const user = await models.User.findOne({ where: { id: 1 }, raw: true });
  // res.send({ message: 'Trace', user });
  const users = await models.User.findAll({ raw: true });
  res.send({ message: 'Trace', users });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

models.sequelize.sync({ force: true }).then(() => {
  const server = app.listen(process.env.PORT || 4000, () => {
    console.log(`Server running on port ${server.address().port}`);
  });
});
