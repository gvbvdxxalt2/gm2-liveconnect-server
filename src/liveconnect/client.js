
var {EventEmitter} = require("events");
var generateID = require("./id-generator.js");
var ClientVariableSync = require("./client-variablesync.js");
var ClientMessageHandler = require("./client-messagehandler.js");

class Client extends EventEmitter {
    constructor (handler, socket) {
        super();
        this.connected = true;
        this.handler = handler;
        this.socket = socket;
        this.id = generateID();
        this.connections = handler.connections;
        this.variables = new Map();
        this.sync = new ClientVariableSync(this);
        this.messageHandler = new ClientMessageHandler(this);

        this.init();
    }

    send (json) {
        if (this.connected) {
            this.socket.transmitJSON(json);
        }
    }
    
    init () {
        this.socket.on("recieve", this._handleReceiveJSON.bind(this));
        this.socket.once("msgviolation", this._handleMessageViolation.bind(this));
        this.socket.once("disconnect", this._handleDisconnect.bind(this));
        var id = this.id;
        this.doSync();
        this.send({type: "newID", id});
    }

    _handleDisconnect() {
        this.connected = false;
        this.connections._handleDisconnect(this);
        this.handler.emit(this.handler.EVENT_CLIENT_DISCONNECT);
    }

    _handleReceiveJSON(json) {
        this.messageHandler.handleMessage(json);
    }

    _handleMessageViolation () {
        this.messageHandler.handleMessageViolation();
    }

    disconnect() {
        this.socket.disconnect();
    }

    doSync () {
        this.sync.clearSyncList();
        for (var client of this.connections.clients) {
            this.sync.setLocalSyncList(client);
        }
        this.sync.sendSyncList();
    }
}

module.exports = Client;