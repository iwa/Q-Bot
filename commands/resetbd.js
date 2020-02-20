const profile = require('../js/profile')

module.exports.run = (bot, msg, args, db) => {
    profile.reset(bot, msg, args, db, 'birthday');
};

module.exports.help = {
    name: 'resetbd'
};