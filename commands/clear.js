const music = require('../js/music')

module.exports.run = (bot, msg) => {
    music.clear(msg);
};

module.exports.help = {
    name: 'clear',
    usage: "?clear",
    desc: "Clear the music queue\nOnly in #radio-lounge"
};