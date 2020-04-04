const music = require('../js/music')

module.exports.run = (bot, msg) => {
    music.forceskip(bot, msg);
};

module.exports.help = {
    name: 'forceskip'
};