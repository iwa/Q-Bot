const music = require('../js/music')

module.exports.run = (bot, msg) => {
    music.stop(msg);
};

module.exports.help = {
    name: 'stop',
    usage: "?stop",
    desc: "Make the bot stop playing music and disconnect it from the Qumu Radio\nOnly in #radio-lounge"
};