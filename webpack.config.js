const path = require('path');

module.exports = {
  entry: './src/index.js',
  output:{
    path: path.resolve(__dirname, 'public/assets/js'),
    publicPath: '/public/',
    filename: 'voice-assistant.min.js'
  }
};
