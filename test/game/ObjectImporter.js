const expect = require('chai').expect;
const sinon = require('sinon');
const mockery = require('mockery');
mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false
});

const MeshGenerator = require('../../src/game/ObjectImporter.js');


describe('ObjectImporter.js', () => {
    describe('importGameObject', () => {

        it('should validate a game object meta initialize the object', () => {

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