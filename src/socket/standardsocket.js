
var {EventEmitter} = require("events");

class StandardSocket extends EventEmitter {
    constructor (ws) {
        super();
        this.ws = ws;
        this._closed = false;

        this._initListeners();
    }

    _initListeners() {
        this.ws.on("close", this._handleClose.bind(this));
        this.ws.on("message", this._handleMessage.bind(this));
    }

    _handleClose() {
        this.ws = null;
        this.disconnect();
    }

    _handleMessage(data, isBinary) {
        if (isBinary) {
            this.emit("msgviolation");
            return;
        }
        var dataString = ""+data;
        if (!dataString.startsWith("{")) {
            this.emit("msgviolation");
            return;
        }
        var json = {};
        try{
            json = JSON.parse(dataString);
        }catch(e){
            this.emit("msgviolation");
            return;
        }

        this.emit("recieve", json);
    }

    disconnect () {
        if (this.ws) {
            try{
                this.ws.close();
            }catch(e){}
            this.ws = null;
        }
        if (this._closed) {
            return;
        }
        this._closed = true;
        this.emit("disconnect");
    }

    transmitJSON (json) {
        if (!this.ws) {
            return;
        }
        this.ws.send(JSON.stringify(json));
    }
}

module.exports = StandardSocket;