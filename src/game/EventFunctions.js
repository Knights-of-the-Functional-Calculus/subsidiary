const keycode = require('keycode');

exports.injectEventFunctions = function(target) {
	for (var i = target.events.length - 1; i >= 0; i--) {
		target.events[i]['func'] = this[target.events[i]['func'] ];
	}
}

exports.wasd = function(event) {
    const keyCode = event.which;
    const {
        up,
        down,
        left,
        right
    } = this.info.movement;
    switch (keyCode) {
        case keycode(up):
            this.mesh.position.y++;
            break;
        case keycode(down):
            this.mesh.position.y--;
            break;
        case keycode(left):
            this.mesh.position.x--;
            break;
        case keycode(right):
            this.mesh.position.x++;
            break;
    }
    console.log(this.mesh.position)
}

function onDocumentKeyDown(event) {
    const keyCode = event.which;
    if (keyCode == keycode('T')) {
        domElement.hidden = false;
    }
    console.log(this.characterInfo)
};
function onConsoleKeyDown(event) {
    const keyCode = event.which;
    if (keyCode == keycode('Esc')) {
        console.log('pressed');
        domElement.hidden = true;
    }
};
