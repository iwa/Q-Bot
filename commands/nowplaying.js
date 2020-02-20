const music = require('../js/music')

module.exports.run = (bot, msg) => {
    music.np(msg, bot);
};

module.exports.help = {
    name: 'nowplaying',
    usage: "?nowplaying",
    desc: "Show the current playing song"
};