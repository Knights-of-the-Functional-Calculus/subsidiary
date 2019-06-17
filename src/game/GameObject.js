const EventFunctions = require('./EventFunctions.js')

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