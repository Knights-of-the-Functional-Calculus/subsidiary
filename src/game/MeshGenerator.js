/**
 * Looks up desired mesh function and replaces the mesh property in the target object.
 * @function
 * @param {Object} target - The target objec tto inject the mesh function into.
 * @param {string} target.mesh - The name of the mesh function to lookup.
 */
exports.injectMeshGenerator = function(target) {
    if (typeof(target.mesh) === 'string')
        target.mesh = this[target.mesh] || (() => {});
}

/**
 * Forms a circular mesh and attaches it to bound context.
 * @function
 * @returns {Object} The circular THREE mesh object.
 */
exports.circle = function() {
    const geometry = new THREE.CircleGeometry(.2, 4, 3.14159 / 4);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffff00
    });
    const circle = new THREE.Mesh(geometry, material);
    this.mesh = circle;
    return circle;
}

/**
 * Creates a DOM element, generates a mesh from the element, attaches it to bound context
 * and stores information about the element.
 * @function
 * @returns {Object} The iframe mesh.
 */
exports.iframe = function() {
    const domElement = document.createElement('iframe');
    domElement.id = this.info.id;
    domElement.src = this.info.src;
    domElement.style = this.info.style;
    // create the plane
    const mixerPlane = new THREEx.HtmlMixer.Plane(this.mixerContext, domElement);
    mixerPlane.object3d.scale.multiplyScalar(2);
    this.mesh = mixerPlane.object3d;
    this.domElement = domElement;
    this.mesh.visible = this.visible;
    this.domElement.hidden = !this.visible;
    this.mesh.traverse(child => {
        child.visible = this.visible;
    });
    return mixerPlane.object3d;
}