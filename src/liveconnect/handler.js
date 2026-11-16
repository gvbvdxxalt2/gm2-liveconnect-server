var {EventEmitter} = require("events");
var StandardSocket = require("../socket/standardsocket.js");
var Connections = require("./connections.js");

class ServerHandler extends EventEmitter {

    get EVENT_CLIENT_CONNECT () {
        return "connection";
    }
    get EVENT_CLIENT_DISCONNECT () {
        return "disconnect";
    }

    constructor (options) {
        super();
        this.stopped = false;
        this.Socket = StandardSocket;
        this.connections = new Connections(this);
        this.syncInterval = setInterval(this._handleLoop.bind(this), 1000/60);

        this.setOptions(options);

        this.start();
    }

    setOptions(options) {
        if (!options) {
            return;
        }
        
        if (typeof options.socket !== "undefined") {
            this.Socket = options.socket;
        }
    }

    handleConnection(...args) {
        var socket = new this.Socket(...args);
        this.connections.connectSocket(socket);
    }

    _handleLoop() {
        this.connections.doSync();
    }

    start() {
        if (this.stopped) {
            throw new Error("Can't start a server handler after it has been stopped");
        }

    }

    stop() {
        if (this.stopped) {
            return;
        }
        this.stopped = true;
        this.connections.disconnectAll();
        clearInterval(this.syncInterval);
    }

    dispose() {
        this.stop();
    }
}

module.exports = ServerHandler;