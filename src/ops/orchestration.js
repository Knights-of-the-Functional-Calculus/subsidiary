const compose = require('docker-compose');


exports.runContainer = function(container, options = {}) {
  return compose.upOne(container, options)
      .then((obj) => JSON.stringify(obj, 0, 2))
      .then(console.log);
};

exports.runContainers = function(options = {}) {
  return compose.upAll(options)
      .then((obj) => JSON.stringify(obj, 0, 2))
      .then(console.log);
};

exports.stopContainers = function(options = {}) {
  return compose.stop(options)
      .then((obj) => JSON.stringify(obj, 0, 2))
      .then(console.log);
};

exports.dropContainers = function(options = {}) {
  return compose.down(options)
      .then((obj) => JSON.stringify(obj, 0, 2))
      .then(console.log);
};
