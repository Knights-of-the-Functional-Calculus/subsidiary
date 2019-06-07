const path = require('path');
const debug = require('debug')(path.basename(__filename));
const keycode = require('keycode');

exports.injectEventFunctions = function(target) {
    for (var i = target.events.length - 1; i >= 0; i--) {
        debug(`Injecting ${target.events[i]['func'] } into ${this}`);
        target.events[i]['func'] = this[target.events[i]['func']];
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
    	this.gameObject.camera.position[this.axis] = this.gameObject.mesh.position[this.axis] ;
    }
}

exports.toggle = function(event) {
    const keyCode = event.which;
    if (keyCode == keycode('t')) {
        this.visible = !this.visible;
        this.domElement && (this.domElement.hidden = !this.visible);
        this.mesh.visible = this.visible;
        this.mesh.traverse(child => {
            child.visible = this.visible;
        });
    }
}

exports.wasd = function(event) {
    if (this.state == 'moving') {
        return;
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
            break;
        case keycode(down):
            context.axis = 'y';
            context.b = this.mesh.position[context.axis] - displacement;
            break;
        case keycode(left):
            context.axis = 'x';
            context.b = this.mesh.position[context.axis] - displacement;
            break;
        case keycode(right):
            context.axis = 'x';
            context.b = this.mesh.position[context.axis] + displacement;
            break;
    }
    context.gameObject = this;
    this.thread[`lerp${this.name}`] = lerpFunc.bind(context);
}