
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

    sendGlobalEvent (sourceClient, name, value) {
        var sourceID = "[SERVER]";
        if (sourceClient) {
            sourceID = sourceClient.id;
        }

        var message = {
            type: "globalEvent",
            id: sourceID,
            name: ""+name,
            value,
        };
        this.clients.forEach((client) => client.send(message));
    }

    sendLocalEvent (sourceClient, targetID, name, value) {
        var sourceID = "[SERVER]";
        if (sourceClient) {
            sourceID = sourceClient.id;
        }

        var targetClient = this.findClientByID(targetID);
        if (!targetClient) {
            return;
        }

        var message = {
            type: "localEvent",
            id: sourceID,
            name: ""+name,
            value,
        };
        targetClient.send(message);
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