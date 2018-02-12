const express = require('express');
const path = require('path');
const app = express();

app.use('/static', express.static(__dirname + '/public/assets'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/index.html'));
});

app.get('/carrinho', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/carrinho.html'));
});

app.listen(3000, () => {
  console.log('Voice Assistant is running on port 3000...');
});
