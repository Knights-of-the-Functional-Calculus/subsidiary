const path = require('path');
const debug = require('debug')(path.basename(__filename));
const error = require('debug')(`${path.basename(__filename)}:error`);
debug.enabled = '*'

const ObjectImporter = require('./src/game/ObjectImporter.js');

const request = require('request');
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

const runtimeContext = {};
runtimeContext.camera = camera;
runtimeContext.threads = threads;
runtimeContext.mixerContext = mixerContext;
runtimeContext.scene = scene;
runtimeContext.threads = threads;


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

ipcRenderer.on('reload-event', async(event, store) => {
    const level = await ObjectImporter.fetchLevel(store.levelRequest, runtimeContext).catch(err => {
        error(err);
    });
    if (!level) {
        error('Failed to fetch level.');
        return 1;
    }
    const domObjects = level.domObjects
    for (let i = domObjects.length - 1; i >= 0; i--) {
        request.head({
            url: domObjects[i].info.src
        }, (err, response) => {
            //TODO: Check to see if this etag is recurring
            if (err) {
                error(err);
                return;
            }
            if (response.headers.etag === domObjects[i].info.etag) {
                runtimeContext.dockerDone = runtimeContext.dockerDone || domObjects[i].info.dockerDone;
                // This forces element refresh.
                domObjects[i].domElement.src = domObjects[i].domElement.src;
                if (!threads[0].renderDOM3d) {
                    threads[0].renderDOM3d = function(delta, now) {
                        // NOTE: it must be after camera mode
                        mixerContext.update(delta, now);
                    }
                }
            }
        });
    }
});

ipcRenderer.on('load-event', (event, store) => {
    process.env.DEV = store.DEV;
    if (process.env.DEV) {
        debug('Adding render functions...');
    }
    // render the css3d
    threads[0].renderDOM3d = function(delta, now) {
        // NOTE: it must be after camera mode
        mixerContext.update(delta, now);
    };
    const levelRequest = {
        levelName: 'levelalpha'
    }
    ObjectImporter.loadLevel(levelRequest, Object.assign(runtimeContext, store)).catch(err => {
        error(err);
    });
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
    if (runtimeContext.dockerDone) {
        setTimeout(requestAnimationFrame.bind(null, runGame), 20);
    } else {
        setTimeout(requestAnimationFrame.bind(null, loading), 1000);
    }
}
requestAnimationFrame(loading);