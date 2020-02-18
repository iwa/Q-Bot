const music = require('../js/music')

module.exports.run = (bot, msg) => {
    music.stop(msg);
};

module.exports.help = {
    name: 'stop'
};