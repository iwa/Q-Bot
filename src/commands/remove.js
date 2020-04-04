const music = require('../js/music')

module.exports.run = (bot, msg, args) => {
    music.remove(msg, args);
};

module.exports.help = {
    name: 'remove',
    usage: "?remove (id of the video in the queue)",
    desc: "Remove a video in the queue"
};