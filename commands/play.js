const music = require('../js/music')
let config = require('../config.json')
const { YouTube } = require('better-youtube-api')
const yt = new YouTube(config.yt_token)

module.exports.run = (bot, msg, args) => {
    music.play(msg, args, yt);
};

module.exports.help = {
    name: 'play'
};