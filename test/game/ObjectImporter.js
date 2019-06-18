const expect = require('chai').expect;
const sinon = require('sinon');
const mockery = require('mockery');
mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false
});

const sandbox = sinon.sandbox.create();
const mockMeshGenerator = require('../mocks/mockMeshGenerator.js')(sandbox);
mockery.registerMock('./MeshGenerator.js', mockMeshGenerator);

const mockEventFunctions = require('../mocks/mockEventFunctions.js')(sandbox);
mockery.registerMock('./EventFunctions.js', mockEventFunctions);

const mockGameObject = require('../mocks/mockGameObject.js');
mockery.registerMock('./GameObject.js', mockGameObject);


const ObjectImporter = require('../../src/game/ObjectImporter.js');

describe('ObjectImporter.js', () => {
    describe('importGameObject', () => {
        let objectImporterFunction;

        before(() => {
            objectImporterFunction = ObjectImporter.importGameObject;
            sandbox.replace(ObjectImporter.validator, 'validate', sandbox.fake());
        });

        it('should validate a game object meta initialize the object', () => {
            const result = objectImporterFunction('resources/gameObjects/characters/MainCharacter.json');
            expect(ObjectImporter.validator.validate.calledOnce).to.be.true;
            expect(mockMeshGenerator.injectMeshGenerator.calledOnce).to.be.true;
            expect(mockEventFunctions.injectEventFunctions.calledOnce).to.be.true;
            expect(result.mock).to.be.true;
        });

        afterEach(() => {
            sandbox.reset();
        });

        after(() => {
            sandbox.restore();
        });
    });

    describe('loadLevel', () => {

        it('should validate a level schema and initialize the object', () => {

        });
    });

    describe('fetchLevel', async() => {

        it('should fetch a level from cache', async() => {

        });

        // TODO: think about fetching mechanisms
        it('should fetch a level from a url', async() => {

        });
    });

    describe('addToScene', () => {

        it('should add a mesh to the scene', () => {

        });

        it('should call the object to generate a mesh and add it to the scene', () => {

        });
    });
});