const path = require('path');
const debug = require('debug')(path.basename(__filename));
const keycode = require('keycode');
exports.schema = require('../../resources/events/_EventSpec.json');
const Validator = require('jsonschema').Validator;
const validator = new Validator();
validator.addSchema(exports.schema);

exports.injectEventFunctions = function(target) {
    for (var i = target.events.length - 1; i >= 0; i--) {
        debug(`Injecting ${target.events[i]['func'] } into ${this}`);
        if (this[target.events[i]['func']] && typeof target.events[i]['func'] === 'string') {
            // TODO: This is buggy, hangs
            validator.validate(target.events[i], '/Event');
            target.events[i]['func'] = this[target.events[i]['func']];
        } else {
            target.events[i]['func'] = () => {};
        }
    }
}

exports.addEvent = function({
    eventType,
    func,
    capture
}) {
    func = func.bind(this);
    document.addEventListener(eventType, func, capture);
}

exports.toggleVisibility = function(event) {
    const keyCode = event.which;
    if (keyCode === keycode('t')) {
        this.visible = !this.visible;
        typeof(this.domElement) === 'object' && (this.domElement.hidden = !this.visible);
        this.mesh.visible = this.visible;
        this.mesh.traverse(child => {
            child.visible = this.visible;
        });
    }
}

const lerpFunc = function(delta) {
    if (this.c >= 1) {
        delete this.gameObject.thread[`lerp${this.gameObject.name}`];
        this.gameObject.state = 'idle';
    }
    this.a = this.gameObject.mesh.position[this.axis];
    this.c += delta * 15;
    this.gameObject.mesh.position[this.axis] = THREE.Math.lerp(this.a, this.b, this.c);
    if (this.gameObject.cameraLocked) {
        this.gameObject.camera.position[this.axis] = this.gameObject.mesh.position[this.axis];
    }
}

exports.wasd = function(event) {
    if (this.state === 'moving') {
        return this.currentDirection;
    }
    const displacement = 0.2;
    this.state = 'moving';
    const keyCode = event.which;
    const {
        up,
        down,
        left,
        right
    } = this.info.movement;
    const context = {
        c: 0
    };

    switch (keyCode) {
        case keycode(up):
            context.axis = 'y';
            context.b = this.mesh.position[context.axis] + displacement;
            this.currentDirection = 'up';
            break;
        case keycode(down):
            context.axis = 'y';
            context.b = this.mesh.position[context.axis] - displacement;
            this.currentDirection = 'down';
            break;
        case keycode(left):
            context.axis = 'x';
            context.b = this.mesh.position[context.axis] - displacement;
            this.currentDirection = 'left';
            break;
        case keycode(right):
            context.axis = 'x';
            context.b = this.mesh.position[context.axis] + displacement;
            this.currentDirection = 'right';
            break;
    }
    context.gameObject = this;
    this.thread[`lerp${this.name}`] = lerpFunc.bind(context);
}