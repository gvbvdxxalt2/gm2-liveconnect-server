var {StandardSocket, ServerHandler} = require("../src/");
var ws = require("ws");
var wss = new ws.WebSocketServer({port:2356});
var handler = new ServerHandler();
wss.on("connection", (ws) => handler.handleConnection(ws));