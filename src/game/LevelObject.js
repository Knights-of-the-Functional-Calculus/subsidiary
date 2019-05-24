function LevelObject(args) {
    const {
        name,
        gameObjects,
        events,
        info,
    } = args;
    this.name = name;
    this.gameObjects = gameObjects;
    this.info = info;

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

module.exports = LevelObject;