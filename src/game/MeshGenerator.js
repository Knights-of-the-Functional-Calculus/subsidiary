exports.injectMeshGenerator = function(target) {
    target.mesh = this[target.mesh];
}

exports.circle = function() {
    const geometry = new THREE.CircleGeometry(.2, 4, 3.14159 / 4);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffff00
    });
    const circle = new THREE.Mesh(geometry, material);
    this.mesh = circle;
    return circle;
}

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