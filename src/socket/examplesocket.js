
var {EventEmitter} = require("events");

class ExampleSocket extends EventEmitter {
    constuctor () {
        /* Do any setup here */

        /**
         * Events that need to be used:
         * 
         * 1. disconnect:
         *  Notifies the server that this socket is disconnected,
         *  when the server calls the function disconnect(),
         *  it should also emit this event to let the server know it successfully disconnected the socket.
         * 
         * 2. recieve:
         *  Notifies the server a JSON message was sent,
         *  pass a JSON object to it containing the parsed message.
         *  Should be emitted like: this.emit("recieve", decodedJsonMessage)
         * 
         * 3. msgviolation:
         *  Notifies the server to disconnect the client as it might be an abusive socket.
         *  Emmited when the message can't be parsed, or doesn't match expected content.
         */
    }

    /**
     * This is called when the server wants to disconnect the socket.
     * EMIT THE DISCONNECT EVENT HERE SYNCRONUSLY TO PREVENT PROBLEMS.
     */
    disconnect () {
        this.emit("disconnect"); //Always include this somewhere or trigger it immediately after calling disconnect.
    }

    /**
     * Called when the server wants to send a message to this socket.
     * @param {Object} json The JSON object message the server wants to send to this socket.
     */
    transmitJSON (json) {
        /* Send the JSON object to the socket, use JSON.stringify() */
    }
}