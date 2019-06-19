const expect = require('chai').expect;
const sinon = require('sinon');
const mockery = require('mockery');
mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false
});


const sandbox = sinon.createSandbox();
const mockEventFunctions = require('../mocks/mockEventFunctions.js')(sandbox);
mockery.registerMock('./EventFunctions.js', mockEventFunctions);

const GameObject = require('../../src/game/GameObject.js');

describe('GameObject.js', () => {
    describe('Level', () => {

        afterEach(() => {
            sandbox.reset();
        });

        it('should initialize a level object', () => {
            const kwargs = {
                name: 'foo',
                instanceId: 'bar',
                obejctType: 'Character',
                events: [{}],
                info: {
                    bar: 'baz'
                },
                mesh: function() {},
                children: [],
            };

            const gameObject = new GameObject(kwargs);
            expect(gameObject.name).to.equal(kwargs.name);
            expect(gameObject.info).to.equal(kwargs.info);
            expect(gameObject.type).to.equal(kwargs.eventType);
            expect(typeof(gameObject.mesh)).to.equal('function');
            expect(gameObject.info).to.deep.equal(kwargs.info);
            expect(gameObject.children).to.deep.equal(kwargs.children);
            expect(gameObject.visible).to.be.true;
        });


        it('should initialize an invisible level object', () => {
            const kwargs = {
                name: 'foo',
                instanceId: 'bar',
                obejctType: 'Character',
                events: [{}],
                info: {
                    bar: 'baz'
                },
                mesh: function() {},
                children: [],
                visible: false,
            };

            const gameObject = new GameObject(kwargs);
            expect(gameObject.name).to.equal(kwargs.name);
            expect(gameObject.info).to.equal(kwargs.info);
            expect(gameObject.type).to.equal(kwargs.eventType);
            expect(typeof(gameObject.mesh)).to.equal('function');
            expect(gameObject.info).to.deep.equal(kwargs.info);
            expect(gameObject.children).to.deep.equal(kwargs.children);
            expect(gameObject.visible).to.be.false;

            expect(mockEventFunctions.addEvent.callCount).to.equal(kwargs.events.length);
        });
    });
});