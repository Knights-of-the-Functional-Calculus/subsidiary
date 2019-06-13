const expect = require('chai').expect;
const jsf = require('json-schema-faker');
const keycode = require('keycode');
const sinon = require('sinon');

THREE = require('../mocks/mockTHREE.js');
jsf.option('alwaysFakeOptionals', true);
// const GameObject 
const EventFunctions = require('../../src/game/EventFunctions.js');
const eventSpec = require('../../resources/events/_EventSpec.json');

describe('EventFunctions.js', () => {
    describe('injectEventsFunctions', () => {
        let target;
        before(() => {
            target = {};
            target.events = [];
            target.events.push(jsf.generate(eventSpec));
            target.events.push(jsf.generate(eventSpec));
            target.events.push(jsf.generate(eventSpec));
        });
        it('should check that function names are replaced with functions', () => {
            EventFunctions.injectEventFunctions(target);
            target.events.forEach(event => expect(event.func).to.be.a('function'));
        });
    });

    describe('toggleVisibility', () => {
        const eventName = 'toggleVisibility';
        let context, eventFunction;
        beforeEach(() => {
            context = {};
            context.visible = false;
            context.mesh = {
                traverse: sinon.spy()
            };
            context.domElement = {};
            eventFunction = EventFunctions['toggleVisibility'].bind(context);
        });

        it('should toggle the visibility of a game object', () => {
            const event = {
                which: keycode('t')
            };
            eventFunction(event);
            expect(context.mesh.traverse.calledOnce).to.be.true;
            expect(context.visible).to.equal(true);
            expect(context.mesh.visible).to.equal(true);
            expect(context.domElement.hidden).to.equal(false);
        });
    });

    describe('wasd', () => {
        const eventName = 'wasd';
        let context, eventFunction;
        const movementUnit = 0.2;
        const timestep = 0.02;
        beforeEach(() => {
            context = {};
            context.name = 'foo';
            context.info = {};
            context.info.movement = {
                up: 'w',
                left: 'a',
                down: 's',
                right: 'd'
            };
            context.mesh = {};
            context.mesh.position = {
                x: 0,
                y: 0
            };
            context.thread = {};
            eventFunction = EventFunctions['wasd'].bind(context);
        });

        it('should do nothing if the game object is already moving', () => {
            context.currentDirection = 'foo';
            const event = {
                which: 'bar'
            };
            context.state = 'moving';
            expect(eventFunction(event)).to.equal(context.currentDirection);
        });

        it(`should set a thread function that moves the game object up`, () => {
            const event = {
                which: keycode(context.info.movement.up)
            };

            eventFunction(event);
            expect(context.thread[`lerp${context.name}`]).to.not.be.undefined;
            let currentPosition = {
                x: 0,
                y: 0
            };
            let t = 0;
            while (context.thread[`lerp${context.name}`]) {
                context.thread[`lerp${context.name}`](timestep);
                t += timestep * 15;
                currentPosition.y = (1- t)  * currentPosition.y + movementUnit * t;
                expect(context.mesh.position).to.deep.equal(currentPosition);
            }
        });

        it(`should set a thread function that moves the game object left`, () => {
            const event = {
                which: keycode(context.info.movement.left)
            };

            eventFunction(event);
            expect(context.thread[`lerp${context.name}`]).to.not.be.undefined;
            let currentPosition = {
                x: 0,
                y: 0
            };
            let t = 0;
            while (context.thread[`lerp${context.name}`]) {
                context.thread[`lerp${context.name}`](timestep);
                t += timestep * 15;
                currentPosition.x = (1- t)  * currentPosition.x - movementUnit * t;
                expect(context.mesh.position).to.deep.equal(currentPosition);
            }
        });

        it(`should set a thread function that moves the game object down`, () => {
            const event = {
                which: keycode(context.info.movement.down)
            };

            eventFunction(event);
            expect(context.thread[`lerp${context.name}`]).to.not.be.undefined;
            let currentPosition = {
                x: 0,
                y: 0
            };
            let t = 0;
            while (context.thread[`lerp${context.name}`]) {
                context.thread[`lerp${context.name}`](timestep);
                t += timestep * 15;
                currentPosition.y = (1- t)  * currentPosition.y - movementUnit * t;
                expect(context.mesh.position).to.deep.equal(currentPosition);
            }
        });

        it(`should set a thread function that moves the game object right`, () => {
            const event = {
                which: keycode(context.info.movement.right)
            };

            eventFunction(event);
            expect(context.thread[`lerp${context.name}`]).to.not.be.undefined;
            let currentPosition = {
                x: 0,
                y: 0
            };
            let t = 0;
            while (context.thread[`lerp${context.name}`]) {
                context.thread[`lerp${context.name}`](timestep);
                t += timestep * 15;
                currentPosition.x = (1- t)  * currentPosition.x + movementUnit * t;
                expect(context.mesh.position).to.deep.equal(currentPosition);
            }
        });
    });
});