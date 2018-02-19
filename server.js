const express = require('express');
const pg = require('pg');
const port = process.env.PORT || 4000;

const app = express();

app.get('*', (req, res) => {
  res.send({ message: 'Trace' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
