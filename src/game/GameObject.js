const EventFunctions = require('./EventFunctions.js')

/**
 * Represents a game object.
 * @constructor
 * @param {Object} kwargs - The argument object provided.
 * @param {string} kwargs.name - The game object name.
 * @param {string} kwargs.instanceId - The instance id.
 * @param {string} kwargs.objectType - The object type.
 * @param {Object} kwargs.info - Miscellaneous meta data about the level.
 * @param {Object[]} kwargs.children - See GameObjects.js for detailed description.
 * @param {Object[]} kwargs.events - See EventFunctions.js for detailed description.
 * @param {function} kwargs.mesh - The mesh generating function.
 * @param {boolean} kwargs.visible - Toggles the visiblility of the object.
 */
function GameObject(kwargs) {
    const {
        name,
        instanceId,
        objectType,
        events,
        info,
        mesh,
        children,
        visible,
    } = kwargs;
    this.name = name;
    this.instanceId = instanceId;
    this.type = objectType;
    this.mesh = mesh.bind(this);
    this.info = info;
    this.children = children;
    this.visible = visible === undefined || visible;

    events.forEach(EventFunctions.addEvent.bind(this));
}

GameObject.prototype.schema = require('../../resources/gameObjects/_GameObjectSchema.json');

module.exports = GameObject;