
var Client = require("./client.js");
var {checkSocket} = require("./checksocket.js");
var {EventEmitter} = require("events");

class Connections {
    constructor (handler) {
        this.handler = handler;
        this.clients = [];
    }

    connectSocket (socket) {
        var error = checkSocket(socket);
        if (error) {
            throw new Error(error);
        }

        var client = new Client(this.handler, socket);
        
        this.clients.push(client);
    }

    doSync() {
        for (var client of this.clients) {
            client.doSync();
        }
    }

    disconnectAll () {

    }
}

module.exports = Connections;