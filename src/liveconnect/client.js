
var {EventEmitter} = require("events");

class Client {
    constructor (handler, socket) {
        this.handler = handler;
        this.connections = handler.connections;
        
    }
}