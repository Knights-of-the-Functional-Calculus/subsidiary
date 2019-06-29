const path = require('path');
const debug = require('debug')(path.basename(__filename));

const request = require('request');

const compose = require('docker-compose');
const dockerCLI = require('docker-cli-js');
const Docker = dockerCLI.Docker;

const docker = new Docker();

function rawPrint(output) {
    debug(String.raw `${output.err}`);
}

exports.inspect = function(container) {
    return docker.command(`inspect ${container}`);
}

exports.webRequestHeadContainer = function(container, options) {

    return new Promise((resolve, reject) => {
        exports.inspect(container).then((meta) => {
            const ports = meta.object[0].NetworkSettings.Ports;
            const portKeys = Object.keys(ports);
            if (ports[portKeys[0]]) {
                const {
                    HostIp,
                    HostPort
                } = ports[portKeys[0]][0];
                request.head(Object.assign({
                    url: `http://${HostIp}:${HostPort}`
                }, options), (err, response) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(response);
                })

            } else {
                resolve({});
            }
        })
    })
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