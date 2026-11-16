
function generateID() {
    var characters = "abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()";
    var random = "";
    var randomLength = Math.random()*35;
    var i = 0;
    while (i < randomLength) {
        var rand = Math.floor(Math.random()*characters.length-2);
        if (rand < 0) {
            rand = 0;
        }
        random += characters[rand];
        i += 1;
    }

    var dateCharacters = "#*%@!]<>AlE;";
    var now = "" + Date.now();
    var date = "";
    var i = 0;
    while (i < now.length) {
        date += dateCharacters[+now[i]];
        i += 1;
    }

    return random + "z" + date;
}

module.exports = generateID;