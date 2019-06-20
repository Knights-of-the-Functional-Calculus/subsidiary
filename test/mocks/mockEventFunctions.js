module.exports = sandbox => {
    return {
        addEvent: sandbox.spy(),
        injectEventFunctions: sandbox.spy()
    }
}