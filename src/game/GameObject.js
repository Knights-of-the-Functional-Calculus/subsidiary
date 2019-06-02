function GameObject(args) {
    const {
    	name,
    	objectType,
        events,
        info,
        mesh,
        children,
        visible
    } = args;
    this.name = name;
    this.type = objectType;
    this.mesh = mesh.bind(this);
    this.info = info;
    this.children = children;
    this.visible =  visible === undefined || visible;

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

GameObject.prototype.schema = require('../../resources/gameObjects/_GameObjectSchema.json');

module.exports = GameObject;