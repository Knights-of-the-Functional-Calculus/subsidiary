const GameObject = require('./GameObject.js');
const Level = require('./Level.js');
const EventFunctions = require('./EventFunctions.js');
const MeshGenerator = require('./MeshGenerator.js');
const request = require('request');
const assert = require('assert');

const Validator = require('jsonschema').Validator;
const validator = new Validator();
validator.addSchema(GameObject.prototype.schema);
validator.addSchema(Level.prototype.schema);
validator.addSchema(require('../../resources/events/_EventSpec.json'));

exports.importGameObject = function(filename) {
    const object = require(`../../${filename}`);
    validator.validate(object, '/GameObject', {
        throwError: true
    });
    EventFunctions.injectEventFunctions(object);
    MeshGenerator.injectMeshGenerator(object);
    return new GameObject(object);
}

exports.loadLevel = async function({
    levelName,
    url
}, runtimeContext) {
    let object;
    if (url) {
        object = await request.get(url);
    } else {
        object = require(`../../${levelName}`);
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
    console.log(level)
    return level;
}

exports.levelCache = {};

exports.fetchLevel = async function({
    current,
    levelName,
    url
}, runtimeContext) {
    if (current && this.levelCache[this.currentLevel]) {
        return this.levelCache[this.currentLevel];
    }
    return this.levelCache[levelName] || await this.loadLevel({
        levelName,
        url
    }, runtimeContext);
}

exports.addToScene = function(scene, actor) {
    console.log(actor);
    if (typeof actor.mesh === 'function')
        scene.add(actor.mesh());
    else
        scene.add(actor.mesh);
}