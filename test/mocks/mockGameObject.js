function GameObject() {
    this.mock = 'GameObject';
}

GameObject.prototype.schema = require('../../resources/gameObjects/_GameObjectSchema.json');

module.exports = GameObject;