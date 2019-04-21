exports.injectMeshGenerator = function(target) {
	target.mesh = this[target.mesh];
}

exports.circle = function() {
	const geometry = new THREE.CircleGeometry( .2, 4, 3.14159/4);
	const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
	const circle = new THREE.Mesh( geometry, material );
	this.mesh = circle;
	return circle;
}