const EventFunctions = require('./EventFunctions.js');

function _setCameraFocus(gameObject) {
    if (this.info && this.info.cameraLocked === gameObject.instanceId) {
        gameObject.cameraLocked = true;
    }
}

function _initializeGameObjects(runtimeContext, gameObjects) {
    for (var i = gameObjects.length - 1; i >= 0; i--) {
        if (gameObjects[i].info && gameObjects[i].info.isDOM) {
            gameObjects[i].mixerContext = runtimeContext.mixerContext;
            this.domObjects.push(gameObjects[i]);
        } else {
            this.gameObjects.push(gameObjects[i]);
        }

        runtimeContext.addToScene(gameObjects[i]);

        gameObjects[i].instanceId || (gameObjects[i].instanceId = this.numObjects);
        _setCameraFocus.call(this, gameObjects[i]);

        this.numObjects++;
    }
}

/**
 * Represents a level.
 * @constructor
 * @param {Object} kwargs - The argument object provided.
 * @param {string} kwargs.name - The level name.
 * @param {Object} kwargs.info - Miscellaneous meta data about the level.
 * @param {Object[]} kwargs.gameObjects - See GameObjects.js for detailed description.
 * @param {Object[]} kwargs.events - See EventFunctions.js for detailed description.
 * @param {Object} runtimeContext - The runtime context responsible for passing globals.
 */
function Level(kwargs, runtimeContext) {
    const {
        name,
        gameObjects,
        events,
        info,
    } = kwargs;
    this.name = name;
    this.info = info;
    this.gameObjects = [];
    this.domObjects = [];
    this.numObjects = 0;
    events.forEach(EventFunctions.addEvent.bind(this));
    _initializeGameObjects.call(this, runtimeContext, gameObjects);
}
Level.prototype.schema = require('../../resources/levels/_LevelSchema.json');
Level.prototype.setCameraFocus = _setCameraFocus;
Level.prototype.initializeGameObjects = _initializeGameObjects;

module.exports = Level;