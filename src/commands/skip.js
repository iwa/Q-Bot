const music = require('../js/music')

module.exports.run = (bot, msg) => {
    music.skip(bot, msg);
};

module.exports.help = {
    name: 'skip',
    usage: "?skip",
    desc: "Vote to skip the current played song\nThe half of the people in the voice channel needs to voteskip for skipping the song\nOnly in #radio-lounge"
};