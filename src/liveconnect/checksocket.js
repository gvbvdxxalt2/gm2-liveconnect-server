
function checkSocket(socket) {
    if (typeof socket.on !== "function") {
        return "Provided socket doesn't have valid on function.";
    }
    if (typeof socket.once !== "function") {
        return "Provided socket doesn't have valid once function.";
    }
    if (typeof socket.disconnect !== "function") {
        return "Provided socket doesn't have valid disconnect function.";
    }
    if (typeof socket.transmitJSON !== "function") {
        return "Provided socket doesn't have valid transmitJSON function.";
    }
    return null;
}

module.exports = {
    checkSocket
};