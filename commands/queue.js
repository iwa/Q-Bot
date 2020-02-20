const music = require('../js/music')

module.exports.run = (bot, msg, args) => {
    music.list(msg, args);
};

module.exports.help = {
    name: 'queue'
};