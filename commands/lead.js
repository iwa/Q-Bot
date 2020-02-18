const utils = require('../js/utilities')

module.exports.run = (bot, msg, args, db) => {
    utils.leaderboard(bot, msg, args, db);
};

module.exports.help = {
    name: 'lead'
};