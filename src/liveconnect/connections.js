
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

        this.sendUserIDsToClients();
    }

    doSync() {
        for (var client of this.clients) {
            client.doSync();
        }
    }

    sendUserIDsToClients() {
        var json = {
            type: "updateUserlist",
            users: this.clients.map((client) => client.id),
        };
        this.clients.forEach((client) => client.send(json));
    }

    findClientByID(targetID) {
        return this.clients.find((client) => client.id == targetID);
    }

    _handleDisconnect(client) {
        this.clients = this.clients.filter((c) => client !== c);
        this.sendUserIDsToClients();
    }

    disconnectAll () {
        this.clients.forEach((client) => client.disconnect());
    }
}

module.exports = Connections;