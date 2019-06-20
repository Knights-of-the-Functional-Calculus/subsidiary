const GameObject = require('./GameObject.js');
const Level = require('./Level.js');
const EventFunctions = require('./EventFunctions.js');
const path = require('path');
const debug = require('debug')(path.basename(__filename));

const MeshGenerator = require('./MeshGenerator.js');
const request = require('request-promise-native');
const assert = require('assert');

const Validator = require('jsonschema').Validator;
const validator = new Validator();
validator.addSchema(GameObject.prototype.schema);
validator.addSchema(Level.prototype.schema);
validator.addSchema(require('../../resources/events/_EventSpec.json'));

/**
 * @namespace
 * @property {Object} validator - Exposed validator used for object descriptors.
 * @property {Object} levelCache - Cached levels.
 */
exports.validator = validator;
exports.levelCache = {};

/**
 * Imports the game object description, validates it, and initializes. the object
 * @function
 * @param {string} filename - The descriptor file to import.
 * @returns {Object} A new game object.
 */
exports.importGameObject = function(filename) {
    const object = require(`../../${filename}`);
    validator.validate(object, '/GameObject', {
        throwError: true
    });
    EventFunctions.injectEventFunctions(object);
    MeshGenerator.injectMeshGenerator(object);
    debug(`${object.name} imported`);
    return new GameObject(object);
}

/**
 * Imports the level object description, validates it, and initializes the object. The level is cached.
 * @function
 * @param {Object} runtimeContext - The context in which to grab global runtime data.
 * @param {Object[]} runtimeContext.threads - The array of available working threads.
 * @param {Object} identifier - The information about where to find the level descriptor.
 * @param {string} identifier.levelName - The name of the level. May be used to import the level.
 * @param {string} identifier.url - If the level descriptor is at a remote location, request for it.
 * @returns {Object} A new level object.
 */
exports.loadLevel = async function(runtimeContext, {
    levelName,
    url
}) {
    let object;
    if (url) {
        object = await request({
            uri: url,
            json: true
        });
    } else {
        object = require(path.join('../../resources/levels/', `${levelName}.json`));
    }

    validator.validate(object, '/Level', {
        throwError: true
    });
    EventFunctions.injectEventFunctions(object);
    for (var i = object.gameObjects.length - 1; i >= 0; i--) {
        if (typeof(object.gameObjects[i]) === 'string') {
            object.gameObjects[i] = this.importGameObject(object.gameObjects[i]);
            // TODO: Think more on how to leverage threads
            object.gameObjects[i].thread = runtimeContext.threads[0];
            // TODO: multiple cameras?
            object.gameObjects[i].camera = runtimeContext.camera;
        } else if (object.gameObjects[i].mesh !== 'object' || object.gameObjects[i].mesh !== 'function') {
            MeshGenerator.injectMeshGenerator(object.gameObjects[i]);
        }
    }

    runtimeContext.addToScene = this.addToScene.bind(this, runtimeContext.scene);
    const level = new Level(object, runtimeContext);
    if (!this.currentLevel) {
        this.currentLevel = level.name;
    }
    this.levelCache[level.name] = level;
    debug(`${level.name} loaded`);
    return level;
}

/**
 * Checks the cache before attempting to load the level from a descriptor.
 * @function
 * @param {Object} runtimeContext - The context in which to grab global runtime data.
 * @param {Object} identifier - The information about where to find the level descriptor.
 * @param {string} identifier.current - Flag to make function check for and return the current level.
 * @param {string} identifier.levelName - The name of the level. May be used to import the level.
 * @param {string} identifier.url - If the level descriptor is at a remote location, request for it.
 * @returns {Object} A level object.
 */
exports.fetchLevel = async function(runtimeContext, {
    current,
    levelName,
    url
}) {
    if (current && this.levelCache[this.currentLevel]) {
        return this.levelCache[this.currentLevel];
    }
    return this.levelCache[levelName] || await this.loadLevel(runtimeContext, {
        levelName,
        url
    });
}

/**
 * Adds some mesh object to a THREEjs scene.
 * @function
 * @param {Object} scene - The THREEjs scene.
 * @param {Object} actor - The object containing the mesh.
 */
exports.addToScene = function(scene, actor) {
    debug(`${actor.name} added to ${scene}`);
    if (typeof actor.mesh === 'function')
        scene.add(actor.mesh());
    else
        scene.add(actor.mesh);
}