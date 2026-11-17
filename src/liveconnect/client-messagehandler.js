
var ViolationMessages = require("./violationmessages.js");
var Variable = require("./variable.js");

class ClientMessageHandler {
    constructor (client) {
        this.client = client;
        this.connections = client.connections;
    }

    setVariable(name, value) {
        if (!this.client.variables.has(name)) {
            var variable = Variable.createVariable(name, value);
            this.client.variables.set(name, variable);
            return;
        }

        var variable = this.client.variables.get(name);
        variable.set(value);
    }

    handleViolation (violation) {
        this.client.send({
            type: "violationDisconnect",
            violation,
        });
        this.client.disconnect();
    }

    handleMessageViolation () {
        this.handleViolation(ViolationMessages.SOCKET);
    }

    handleMessage(json) {
        if (json.type == "sendUpdateLocalVars") {
            return this.handleUpdateLocalVars(json);
        }
        if (json.type == "globalEventSend") {
            return this.handleGlobalEventSend(json);
        }

        return this.handleViolation(ViolationMessages.SOCKET_UNKNOWN_MESSAGE);
    }

    handleUpdateLocalVars({ variables }) {
        if (
          typeof variables !== "object" ||
          !Array.isArray(variables)
        ) {
            return this.handleViolation(ViolationMessages.BAD_MESSAGE_CALL);
        }

        for (var variable of variables) {
            if (typeof variable !== "object") {
                return this.handleViolation(ViolationMessages.BAD_MESSAGE_CALL);
            }
            if (
                typeof variable.name !== "string" ||
                typeof variable.value == "undefined" ||
                typeof variable.id !== "string"
            ) {
                return this.handleViolation(ViolationMessages.BAD_MESSAGE_CALL);
            }

            if (variable.id == this.client.id) {
                this.setVariable(variable.name, variable.value);
                this.client.sync.set(this.client, this.client.variables.get(variable.name));
            } else {
                var client = this.connections.findClientByID(variable.id);
                if (client) {
                    client.messageHandler.setVariable(variable.name, variable.value);
                }
            }
        }
    }

    handleGlobalEventSend(globalEventData) {
        if (
            typeof globalEventData.name !== "string" ||
            typeof globalEventData.value !== "undefined"
        ) {
            return this.handleViolation(ViolationMessages.BAD_MESSAGE_CALL);
        }
        this.connections.sendGlobalEvent(this.client, globalEventData.name, globalEventData.value);
    }
}

module.exports = ClientMessageHandler;