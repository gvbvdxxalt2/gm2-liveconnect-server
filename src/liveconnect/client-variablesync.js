
class ClientVariableSync {
    constructor (client) {
        this.client = client;
        this.handler = client.handler;
        this.variableMap = new Map();
        this.globalVariableMap = new Map();
        this.syncList = {
            local: [],
            global: []
        };
    }

    set (client, variable) {
        var {variableMap} = this;
        if (!variableMap.has(client)) {
            variableMap.set(client, new Map());
        }

        var clientMap = variableMap.get(client);
        clientMap.set(variable.name, variable.getValue());
    }

    clearSyncList() {
        var syncList = this.syncList;
        syncList.local = [];
        syncList.global = [];
    }

    sendSyncList() {
        var syncList = this.syncList;
        if (syncList.local.length > 0) {
            this.client.send({
                type: "updateLocalVars",
                variables: syncList.local
            });
        }
        if (syncList.global.length > 0) {
            //console.log(syncList.global);
            this.client.send({
                type: "updateGlobalVars",
                variables: syncList.global
            });
        }
    }

    setLocalSyncList (client) {
        var {variableMap} = this;
        if (!variableMap.has(client)) {
            variableMap.set(client, new Map());
        }
        var clientMap = variableMap.get(client);
        var clientID = client.id;
        var syncList = this.syncList;
        for (var varName of client.variables.keys()) {
            var variable = client.variables.get(varName);
            var value = variable.getValue();
            if (!clientMap.has(varName) || value !== clientMap.get(varName)) {
                clientMap.set(varName, value);
                syncList.local.push({
                    id: clientID,
                    name: varName,
                    value
                });
            }
        }
    }

    setGlobalSyncList() {
        var {globalVariableMap} = this;
        var {globalVariables} = this.handler;
        var syncList = this.syncList;
        for (var varName of globalVariables.keys()) {
            var variable = globalVariables.get(varName);
            var value = variable.getValue();
            if (!globalVariableMap.has(varName) || value !== globalVariableMap.get(varName)) {
                globalVariableMap.set(varName, value);
                syncList.global.push({
                    name: varName,
                    value
                });
            }
        }
    }

    removeClient (client) {
        var {variableMap} = this;
        if (!variableMap.has(client)) {
            return;
        }
        variableMap.delete(client);
    }
}

module.exports = ClientVariableSync;