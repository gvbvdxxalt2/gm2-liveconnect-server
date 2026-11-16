var {EventEmitter} = require("events");

class GM2LiveConnectServerHandler extends EventEmitter {
    constructor (options) {
        this.stopped = false;

        this.setOptions(options);
    }

    setOptions(options) {
        if (!options) {
            return;
        }

    }

    stop() {

    }

    dispose() {
        this.stop();
    }
}

module.exports = GM2LiveConnectServerHandler;