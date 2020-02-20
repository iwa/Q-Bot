const profile = require('../js/profile')

module.exports.run = (bot, msg, args, db) => {
    profile.reset(bot, msg, args, db, 'fc');
};

module.exports.help = {
    name: 'resetfc'
};