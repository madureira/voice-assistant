const express = require('express');
const webpack = require('webpack');
const path = require('path');
const config = require('./webpack.config');
const app = express();

config.mode = 'development';
const compiler = webpack(config);

const instance = require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  writeToDisk: true,
});

app.use(instance);
app.use(require('webpack-hot-middleware')(compiler));

app.use('/assets', express.static(__dirname + '/public/assets'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/index.html'));
});

app.get('/carrinho', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/carrinho.html'));
});

app.get('/pedidos', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/pages/pedidos.html'));
});

app.listen(3000, () => {
  console.log('Voice Assistant is running on port 3000...');
});
