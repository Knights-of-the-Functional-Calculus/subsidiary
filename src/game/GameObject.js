function GameObject(args) {
    const {
    	name,
    	type,
        events,
        info,
        mesh
    } = args;
    this.name = name;
    this.type = type;
    this.mesh = mesh.bind(this);
    this.info = info;

	 this.addEvents = (events) => {
	    events.forEach(({
	        type,
	        func,
	        capture
	    }) => {
	        func = func.bind(this);
	        document.addEventListener(type, func, capture);
	    });
	}

    this.addEvents(events);
}

module.exports = GameObject;