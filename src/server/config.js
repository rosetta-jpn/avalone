var utils = require('../utils');

var Config = module.exports = function Config(options) {
  options = options || {};
  this.env = options.env || 'development';
  this.port = options.port || 8888;
  console.log('ENV:', this.env);
  console.log('PORT:', this.port);
}

utils.extend(Config.prototype, {
  isProduction: function () {
    return this.env === 'production';
  },
});
