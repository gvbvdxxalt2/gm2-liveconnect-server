
var {EventEmitter} = require("events");
var Variable = require("./variable.js");
var generateID = require("./id-generator.js");
var ClientVariableSync = require("./client-variablesync.js");

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

        this.init();
    }

    send (json) {
        if (this.connected) {
            this.socket.transmitJSON(json);
        }
    }
    
    init () {
        this.socket.once("disconnect", this._handleDisconnect.bind(this));
        var id = this.id;
        this.doSync();
        this.send({type: "newID", id});
    }

    _handleDisconnect() {
        this.connected = false;
        this.handler.emit(this.handler.EVENT_CLIENT_CONNECT);
    }

    doSync () {
        this.sync.clearSyncList();
        for (var client of this.connections.clients) {
            if (client !== this) {
                this.sync.setLocalSyncList(client);
            }
        }
        this.sync.sendSyncList();
    }
}

module.exports = Client;