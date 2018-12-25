const request = require('request');

const ipcRenderer = require('electron').ipcRenderer;
const renderer = new THREE.WebGLRenderer({
  alpha: true,
});
renderer.autoClear = false;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const updateFcts = [];
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45,
    window.innerWidth / window.innerHeight,
    0.01, 1000);
camera.position.z = 3;

// ////////////////////////////////////////
//    create THREEx.HtmlMixer           //
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

// create the iframe element
const url = 'http://0.0.0.0:3000';
const domElement = document.createElement('iframe');
domElement.id = 'console';
domElement.src = url;
domElement.style.border = 'none';
// create the plane
const mixerPlane = new THREEx.HtmlMixer.Plane(mixerContext, domElement);
mixerPlane.object3d.scale.multiplyScalar(2);
scene.add(mixerPlane.object3d);

// //////////////////////////////////
//    Camera Controls             //
// ////////////////////////////////
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

const keycode = require('keycode');
// ///////////////////////////
//    key events           //
// /////////////////////////
document.addEventListener('keydown', onDocumentKeyDown, false);
domElement.addEventListener('keydown', onConsoleKeyDown, false);
/**
 * @param {Object} event
 */
function onDocumentKeyDown(event) {
  const keyCode = event.which;
  if (keyCode == keycode('T')) {
    domElement.hidden = false;
  }
};
/**
 * @param {Object} event
 */
function onConsoleKeyDown(event) {
  const keyCode = event.which;
  if (keyCode == keycode('Esc')) {
    console.log('pressed');
    domElement.hidden = true;
  }
};

window.addEventListener('resize', onResize, false);
// //////////////////////////////////
//    render the scene            //
// ////////////////////////////////
ipcRenderer.on('load-event', function(event, store) {
  if (process.env.DEV) {
    console.log('Waiting for wetty...');
  }
  const checkWettyReadiness = function() {
    if (process.env.DEV) {
      console.log('...');
    }
    setTimeout(function() {
      request
          .head(url)
          .on('response', function(response) {
            if (process.env.DEV) {
              console.log('Adding render functions...');
            }
            // render the css3d
            updateFcts.push(function(delta, now) {
              // NOTE: it must be after camera mode
              mixerContext.update(delta, now);
            });
          })
          .on('error', checkWettyReadiness);
    }, 2000);
  };
  checkWettyReadiness();
});

// render the webgl
updateFcts.push(function() {
  renderer.render(scene, camera);
});

// //////////////////////////////
//    loop runner             //
// ////////////////////////////
let lastTimeMsec = null;
requestAnimationFrame(function animate(nowMsec) {
  // keep looping
  requestAnimationFrame(animate);
  // measure time
  lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;

  const deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
  lastTimeMsec = nowMsec;
  // call each update function
  updateFcts.forEach(function(updateFn) {
    updateFn(deltaMsec / 1000, nowMsec / 1000);
  });
});
