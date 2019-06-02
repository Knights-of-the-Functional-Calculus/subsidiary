function LevelObject(args) {
    const {
        name,
        gameObjects,
        events,
        info,
    } = args;
    this.name = name;
    this.info = info;
    this.gameObjects = [];
    this.domObjects = [];
    this.numObjects = 0;
    this.initializeGameObjects = function(gameObjects, runtimeContext) {
        for (var i = gameObjects.length - 1; i >= 0; i--) {
            if (gameObjects[i].info && gameObjects[i].info.isDOM) {
                gameObjects[i].mixerContext = runtimeContext.mixerContext;
                this.domObjects.push(gameObjects[i]);
            } else {
                this.gameObjects.push(gameObjects[i]);
            }
            if (!gameObject.instanceId) {
                gameObjects[i].instanceId = this.numObjects;
            }
            if (this.info && this.info.cameraLocked &&
                this.info.cameraLocked === gameObjects[i].instanceId) {
                gameObjects[i].cameraLocked = true;
            }
            this.numObjects++;
        }
    }

    this.addEvents = (events) => {
        events.forEach(({
            eventType,
            func,
            capture
        }) => {
            func = func.bind(this);
            document.addEventListener(eventType, func, capture);
        });
    }
    this.addEvents(events);
}
LevelObject.prototype.schema = require('../../resources/levels/_LevelSchema.json');

module.exports = LevelObject;