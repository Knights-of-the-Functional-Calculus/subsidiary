const expect = require('chai').expect;
const sinon = require('sinon');
const mockery = require('mockery');
mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false
});


const sandbox = sinon.sandbox.create();
mockery.registerMock('./EventFunctions.js', require('../mocks/mockEventFunctions.js')(sandbox));

const Level = require('../../src/game/Level.js');

describe('Level.js', () => {
    describe('Level.prototype.setCameraFocus', () => {
        let context, leveFunction;
        before(() => {
            context = {};
            context.info = {
                cameraLocked: 'foo'
            }
            levelFunction = Level.prototype.setCameraFocus.bind(context);
        });

        it('should set camera to follow the game object', () => {
            const gameObject = {
                instanceId: 'foo'
            };
            levelFunction(gameObject);
            expect(gameObject.cameraLocked).to.be.true;
        });

        it('should not set camera to follow the game object', () => {
            const gameObject = {
                instanceId: 'bar'
            };
            levelFunction(gameObject);
            expect(gameObject.cameraLocked).to.be.undefined;
        });
    });

    describe('Level.prototype.initializeGameObjects', () => {
        let context, leveFunction, runtimeContext;
        before(() => {
            context = {};
            runtimeContext = {};
            runtimeContext.mixerContext = 'foo';
            runtimeContext.addToScene = sandbox.spy();
            levelFunction = Level.prototype.initializeGameObjects.bind(context, runtimeContext);
        });

        beforeEach(() => {
            context.domObjects = [];
            context.gameObjects = [];
            context.numObjects = 0;
        });

        afterEach(() => {
            sandbox.reset();
        });

        it('should push game objects to the gameObjects array add them to the scene', () => {
            const gameObjects = [];
            gameObjects.push({});
            levelFunction(gameObjects);
            expect(context.numObjects).to.equal(gameObjects.length);
            expect(context.gameObjects).to.deep.equal(gameObjects);
            expect(runtimeContext.addToScene.callCount).to.equal(gameObjects.length);
            for (var i = 0; i < context.gameObjects.length; i++) {
                expect(context.gameObjects[i].instanceId).to.equal(i);
            }
        });

        it('should push game objects to the gameObjects array add them to the scene', () => {
            const gameObjects = [];
            gameObjects.push({
                info: {
                    isDOM: true
                }
            });
            levelFunction(gameObjects);
            expect(context.numObjects).to.equal(gameObjects.length);
            expect(context.domObjects).to.deep.equal(gameObjects);
            expect(runtimeContext.addToScene.callCount).to.equal(gameObjects.length);
            for (var i = 0; i < context.domObjects.length; i++) {
                expect(context.domObjects[i].instanceId).to.equal(i);
                expect(context.domObjects[i].mixerContext).to.equal('foo');
            }
        });
    });

    describe('Level', () => {

        afterEach(() => {
            sandbox.reset();
        });

        it('should initialize a level object', () => {
            const kwargs = {
                name: 'foo',
                gameObjects: [],
                events: [{}],
                info: 'bar'
            };

            const level = new Level(kwargs);
            expect(level.name).to.equal(kwargs.name);
            expect(level.info).to.equal(kwargs.info);
            expect(level.gameObjects).to.deep.equal([]);
            expect(level.domObjects).to.deep.equal([]);
            expect(level.numObjects).to.equal(kwargs.gameObjects.length);
        });
    });
});