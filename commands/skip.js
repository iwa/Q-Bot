const music = require('../js/music')

module.exports.run = (bot, msg) => {
    music.skip(bot, msg);
};

module.exports.help = {
    name: 'skip'
};