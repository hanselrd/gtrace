const express = require('express');
const port = process.env.PORT || 4000;
const models = require('./models');

const app = express();

app.get('*', async (req, res) => {
  const user = await models.User.findOne({ where: { id: 1 }, raw: true });
  res.send({ message: 'Trace', user });
});

models.sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
