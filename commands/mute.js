const staff = require('../js/staff')

module.exports.run = (bot, msg, args) => {
    staff.mute(bot, msg, args);
};

module.exports.help = {
    name: 'mute'
};