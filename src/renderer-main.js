const request = require('request');
const ObjectImporter = require('./src/game/ObjectImporter.js');

const ipcRenderer = require('electron').ipcRenderer;
const renderer = new THREE.WebGLRenderer({
    alpha: true,
});
renderer.autoClear = false;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const threads = [{}];
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45,
    window.innerWidth / window.innerHeight,
    0.01, 1000);
camera.position.z = 3;

// ////////////////////////////////////////
//    create THREEx.HtmlMixer      //
// //////////////////////////////////////
const mixerContext = new THREEx.HtmlMixer.Context(renderer, scene, camera);
// handle window resize for mixerContext
window.addEventListener('resize', function() {
    mixerContext.rendererCss.setSize(window.innerWidth, window.innerHeight);
}, false);
// /////////////////////////////////////////////////////
//    mixerContext configuration and dom attachement
// ////////////////////////////////////////////////////
// set up rendererCss
const rendererCss = mixerContext.rendererCss;
rendererCss.setSize(window.innerWidth, window.innerHeight);
// set up rendererWebgl
const rendererWebgl = mixerContext.rendererWebgl;
const css3dElement = rendererCss.domElement;
css3dElement.style.position = 'absolute';
css3dElement.style.top = '0px';
css3dElement.style.width = '100%';
css3dElement.style.height = '100%';
document.body.appendChild(css3dElement);

const webglCanvas = rendererWebgl.domElement;
webglCanvas.style.position = 'absolute';
webglCanvas.style.top = '0px';
webglCanvas.style.width = '100%';
webglCanvas.style.height = '100%';
webglCanvas.style.pointerEvents = 'none';
css3dElement.appendChild(webglCanvas);

// ////////////////////////////////////////////////
//    create a Plane for THREEx.HtmlMixer       //
// //////////////////////////////////////////////

const player = ObjectImporter.importGameObject('resources/characters/MainCharacter.json');
player.camera = camera;
player.cameraLocked = true;
player.thread = threads[0];
ObjectImporter.addToScene(scene, player);

const terminal = ObjectImporter.importGameObject('resources/widgets/Terminal.json');
terminal.mixerContext = mixerContext;
ObjectImporter.addToScene(scene, terminal);

// render the webgl
threads[0].renderWebGL = function() {
    renderer.render(scene, camera);
};


// ////////////////////////////////
//    handle resize             //
// //////////////////////////////
/**
 */
function onResize() {
    // notify the renderer of the size change
    renderer.setSize(window.innerWidth, window.innerHeight);
    // update the camera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}


window.addEventListener('resize', onResize, false);
// //////////////////////////////////
//    render the scene            //
// ////////////////////////////////
let loadEventStore = null;
ipcRenderer.on('load-event', function(event, store) {
    if (process.env.DEV) {
        console.log('Adding render functions...');
    }
    // render the css3d
    threads[0].renderCss3d = function(delta, now) {
        // NOTE: it must be after camera mode
        mixerContext.update(delta, now);
    };
    loadEventStore = store;
    console.log(store)
});

// //////////////////////////////
//    loop runner             //
// ////////////////////////////
let lastTimeMsec = null;
function runGame(nowMsec) {
    // keep looping
    requestAnimationFrame(runGame);
    // measure time
    lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;

    const deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
    lastTimeMsec = nowMsec;
    // call each update function
    Object.keys(threads[0]).forEach(function(updateFn) {
        threads[0][updateFn](deltaMsec / 1000, nowMsec / 1000);
    });
}
function loading(nowMsec) {
  if (loadEventStore) {
    requestAnimationFrame(runGame);
  }
  else {
    setTimeout(requestAnimationFrame.bind(null,loading), 1000);
  }
}
requestAnimationFrame(loading);
