function Level(object) {
    this.mock = 'Level';
    this.gameObjects = object.gameObjects;
}

Level.prototype.schema = require('../../resources/levels/_LevelSchema.json');

module.exports = Level;