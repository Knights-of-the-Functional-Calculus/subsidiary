const expect = require('chai').expect;
const sinon = require('sinon');
const mockery = require('mockery');
mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false
});

const sandbox = sinon.createSandbox();
const mockMeshGenerator = require('../mocks/mockMeshGenerator.js')(sandbox);
mockery.registerMock('./MeshGenerator.js', mockMeshGenerator);

const mockEventFunctions = require('../mocks/mockEventFunctions.js')(sandbox);
mockery.registerMock('./EventFunctions.js', mockEventFunctions);

const mockGameObject = require('../mocks/mockGameObject.js');
mockery.registerMock('./GameObject.js', mockGameObject);

const mockLevel = require('../mocks/mockLevel.js');
mockery.registerMock('./Level.js', mockLevel);

const ObjectImporter = require('../../src/game/ObjectImporter.js');

describe('ObjectImporter.js', () => {
    describe('importGameObject', () => {
        let objectImporterFunction;

        before(() => {
            objectImporterFunction = ObjectImporter.importGameObject.bind(ObjectImporter);
            sandbox.replace(ObjectImporter.validator, 'validate', sandbox.fake());
        });

        it('should validate a game object meta initialize the object', () => {
            const result = objectImporterFunction('resources/gameObjects/characters/MainCharacter.json');
            expect(ObjectImporter.validator.validate.calledOnce).to.be.true;
            expect(mockMeshGenerator.injectMeshGenerator.calledOnce).to.be.true;
            expect(mockEventFunctions.injectEventFunctions.calledOnce).to.be.true;
            expect(result.mock).to.equal('GameObject');
        });

        afterEach(() => {
            sandbox.reset();
        });

        after(() => {
            sandbox.restore();
        });
    });

    describe('loadLevel', function() {
        this.timeout(20000);
        let objectImporterFunction;

        before(() => {
            objectImporterFunction = ObjectImporter.loadLevel.bind(ObjectImporter);
            sandbox.replace(ObjectImporter.validator, 'validate', sandbox.fake());
            sandbox.replace(ObjectImporter, 'importGameObject', sandbox.fake.returns('bar'));
            sandbox.replace(mockMeshGenerator, 'injectMeshGenerator', sandbox.fake());
            sandbox.replace(ObjectImporter, 'addToScene', sandbox.fake());
        });

        it('should validate a level and initialize the object from a URL', async() => {
            const levelName = 'levelalpha';
            const url = 'https://raw.githubusercontent.com/j4qfrost/subsidiary/develop/resources/levels/levelalpha.json';
            const runtimeContext = {
                threads: []
            };
            const result = await objectImporterFunction({
                levelName,
                url
            }, runtimeContext);
            console.log(result)
            expect(ObjectImporter.validator.validate.calledOnce).to.be.true;
            result.gameObjects.forEach(gameObject => expect(gameObject).to.equal('bar'));
            expect(result.mock).to.equal('Level');
        });

        it('should validate a level and initialize the object from the resource directory', async() => {
            const levelName = 'levelalpha';
            const runtimeContext = {
                threads: []
            };
            const result = await objectImporterFunction({
                levelName
            }, runtimeContext);
            expect(ObjectImporter.validator.validate.calledOnce).to.be.true;
            result.gameObjects.forEach(gameObject => expect(gameObject).to.equal('bar'));
            expect(result.mock).to.equal('Level');
        });

        afterEach(() => {
            sandbox.reset();
        });

        after(() => {
            sandbox.restore();
        });
    });

    describe('fetchLevel', async() => {

        let objectImporterFunction;

        before(() => {
            objectImporterFunction = ObjectImporter.fetchLevel.bind(ObjectImporter);
            sandbox.replace(ObjectImporter, 'loadLevel', sandbox.fake.returns('baz'));
        });

        beforeEach(() => {
            ObjectImporter.levelCache = {
                foo: 'bar',
                foo2: 'bar2'
            };
        });

        it('should fetch current level from cache', async() => {
            ObjectImporter.currentLevel = 'foo';
            const result = await objectImporterFunction({
                current: true
            });

            expect(result).to.equal('bar');
        });

        it('should fetch some level from cache', async() => {
            const result = await objectImporterFunction({
                levelName: 'foo2',
            });

            expect(result).to.equal('bar2');
        });

        it('should load level', async() => {
            const result = await objectImporterFunction({
                levelName: 'baz',
            });
            expect(result).to.equal('baz');
        });

        afterEach(() => {
            sandbox.reset();
        });

        after(() => {
            sandbox.restore();
        });
    });

    describe('addToScene', () => {
        let objectImporterFunction, scene;

        before(() => {
            scene = {
                add: sandbox.spy()
            };
            objectImporterFunction = ObjectImporter.addToScene.bind(ObjectImporter);
            sandbox.replace(ObjectImporter, 'loadLevel', sandbox.fake.returns('baz'));
        });

        it('should add a mesh to the scene', () => {
            const actor = {
                mesh: {}
            }
            objectImporterFunction(scene, actor);
            expect(scene.add.calledOnce).to.be.true;
        });

        it('should call the object to generate a mesh and add it to the scene', () => {
            const actor = {
                mesh: sandbox.spy()
            }
            objectImporterFunction(scene, actor);
            expect(scene.add.calledOnce).to.be.true;
            expect(actor.mesh.calledOnce).to.be.true;
        });

        afterEach(() => {
            sandbox.reset();
        });

        after(() => {
            sandbox.restore();
        });
    });
});