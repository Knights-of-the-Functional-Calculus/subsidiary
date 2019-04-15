function Character(args) {
    this.characterInfo = {hello: 'world'};
    const {
        document,
        terminal,
        events,
        object3D
    } = args;
    this.characterInfo.object3D = object3D;

	 this.addCharacterEvents = (doc, terminal, events) => {
	    events.forEach(({
	        type,
	        func,
	        capture
	    }) => {
	        if (type === 'terminal')
	            func = func.bind(terminal);
	        func = func.bind(this);
	        doc.addEventListener(type, func, capture);
	    });
	}

    this.addCharacterEvents(document, terminal, events);
}

module.exports = Character;