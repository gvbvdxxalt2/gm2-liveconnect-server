var {EventEmitter} = require("events");
var StandardSocket = require("../socket/standardsocket.js");
var Connections = require("./connections.js");
var Variable = require("./variable.js");

class ServerHandler extends EventEmitter {

    get EVENT_CLIENT_CONNECT () {
        return "connection";
    }
    get EVENT_CLIENT_DISCONNECT () {
        return "disconnect";
    }

    constructor (options) {
        super();

        this.connections = new Connections(this);
        this.globalVariables = new Map();

        this.setOptionDefaults();
        this.setOptions(options);

        this.start();
    }

    setGlobalVariable(varName, value, serverWriteOnly = false) {
        var name = ""+varName;
        var variable = this._newOrExistingGlobal(name, value);
        if (!!serverWriteOnly) {
            variable.locked = Variable.LOCK_MODE_LOCKED_CLIENTS;
        }
        variable.setServer(value);
    }

    _newOrExistingGlobal(name, value) {
        var variable = null;
        if (this.globalVariables.has(name)) {
            variable = this.globalVariables.get(name);
        } else {
            variable = Variable.createVariable(name, value);
            this.globalVariables.set(name, variable);
        }
        return variable;
    }

    setOptionDefaults () {
        this.stopped = false;
        this.Socket = StandardSocket;
        this.updateRate = 50; //This is at 50 because 60 seems to weaker servers slow.
    }

    setOptions(options) {
        if (!options) {
            return;
        }
        
        if (typeof options.socket !== "undefined") {
            this.Socket = options.socket;
        }
        if (typeof options.updateRate == "number") {
            this.updateRate = options.updateRate;
        }
        
        var globalVars = options.lockedGlobalVariables;
        if (typeof globalVars == "object") {
            for (var name of Object.keys(globalVars)) {
                var value = globalVars[name];
                this.setGlobalVariable(name, value, true);
            }
        }
    }

    handleConnection(...args) {
        if (this.stopped) {
            return;
        }
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
        this.syncInterval = setInterval(this._handleLoop.bind(this), 1000/this.updateRate);
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