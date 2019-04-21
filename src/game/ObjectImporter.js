const GameObject = require('./GameObject.js');
const EventFunctions = require('./EventFunctions.js');
const SpriteGenerator = require('./MeshGenerator.js');

exports.importGameObject = function(filename) {
	const object = require(`../../${filename}`);
	EventFunctions.injectEventFunctions(object);
	console.log(object);
	SpriteGenerator.injectMeshGenerator(object);
	console.log(object);
	return new GameObject(object);
}

exports.addToScene = function(scene, actor) {
	console.log(actor);
	scene.add(actor.mesh());
}