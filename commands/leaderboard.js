const utils = require('../js/utilities')

module.exports.run = (bot, msg, args, db) => {
    utils.leaderboard(bot, msg, args, db);
};

module.exports.help = {
    name: 'leaderboard',
    usage: "?leaderboard (exp | pat | hug | boop | slap)",
    desc: "Show the leaderboard of a category :\nexperience, amount of pats / hugs / boops / slaps given"
};