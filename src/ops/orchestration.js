const debug = require('debug')(__filename);

const compose = require('docker-compose');

function rawPrint(output) {
  debug(String.raw`${output.err}`);
}

exports.runContainer = function(container, options = {}) {
  return compose.upOne(container, options)
      .then(rawPrint);
};

exports.runContainers = function(options = {}) {
  return compose.upAll(options)
      .then(rawPrint);
};

exports.stopContainers = function(options = {}) {
  return compose.stop(options)
      .then(rawPrint);
};

exports.dropContainers = function(options = {}) {
  return compose.down(options)
      .then(rawPrint);
};