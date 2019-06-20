const expect = require('chai').expect;
const sinon = require('sinon');

const keycode = require('keycode');

THREE = require('../../built/three.min.js');
CSS3DObject = require('../../built/CSS3DRenderer.js');
THREEx = require('../../built/threex.htmlmixer.js');
document = {};
// const GameObject 
const MeshGenerator = require('../../src/game/MeshGenerator.js');

describe('MeshGenerator.js', () => {
    describe('injectMeshGenerator', () => {
        let target;
        before(() => {
            target = {
                mesh: 'foo'
            };
        });
        it('should check that function names are replaced with functions', () => {
            MeshGenerator.injectMeshGenerator(target);
            expect(target.mesh).to.be.a('function');
        });
    });

    describe('circle', () => {
        const meshName = 'circle';
        let context, meshFunction;
        beforeEach(() => {
            context = {};
            meshFunction = MeshGenerator['circle'].bind(context);
        });

        it('should generate a simple circle mesh', () => {
            expect(meshFunction()).to.be.an('object');
            expect(context.mesh).to.be.an('object');
        });
    });

    describe('iframe', () => {
        const meshName = 'iframe';
        let context, meshFunction;
        beforeEach(() => {
            document = {};
            document.createElement = () => {
                return {};
            }
            context = {};
            context.visible = true;
            context.mixerContext = {
                cssFactor: 1
            }
            context.info = {
                id: 'foo',
                src: 'bar',
                style: 'baz',
            }
            meshFunction = MeshGenerator['iframe'].bind(context);
        });

        it('generate an iframe mesh and attach elments to the gameobject', () => {
            expect(meshFunction()).to.be.an('object');
            expect(context.mesh).to.be.an('object');
            expect(context.domElement).to.be.an('object')
            expect(context.mesh.visible).to.be.true;
            expect(context.domElement.hidden).to.be.false;
        });
    });
});