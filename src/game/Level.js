const EventFunctions = require('./EventFunctions.js')

function initializeGameObjects(gameObjects, runtimeContext) {
    for (var i = gameObjects.length - 1; i >= 0; i--) {
        if (gameObjects[i].info && gameObjects[i].info.isDOM) {
            gameObjects[i].mixerContext = runtimeContext.mixerContext;
            this.domObjects.push(gameObjects[i]);
        } else {
            this.gameObjects.push(gameObjects[i]);
        }

        runtimeContext.addToScene(gameObjects[i]);

        gameObjects[i].instanceId || gameObjects[i].instanceId = this.numObjects;

        if (this.info && this.info.cameraLocked &&
            this.info.cameraLocked === gameObjects[i].instanceId) {
            gameObjects[i].cameraLocked = true;
        }
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
    initializeGameObjects.call(this, gameObjects, runtimeContext);
}
Level.prototype.schema = require('../../resources/levels/_LevelSchema.json');
Level.prototype.initializeGameObjects = initializeGameObjects;

module.exports = Level;