var Requirements = module.exports = {};

require('../../../src/utils/extensions');

Requirements.Models = require('../../../src/models/server');
Requirements.Observers = require('../../../src/observers');
Requirements.Server = {
  Config: require('../../../src/server/config'),
  Controller: require('../../../src/server/controller'),
}
Requirements.utils = require('../../../src/utils');

