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