var Requirements = module.exports = {};

require('../../../src/utils/extensions');

Requirements.Client = {
  App: require('../../../src/client/app'),
}

Requirements.Core = {
  Models: require('../../../src/models/core'),
}

Requirements.Server = require('../../server/helpers/requirements');

