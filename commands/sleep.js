const staff = require('../js/staff')

module.exports.run = (bot, msg) => {
    staff.sleep(bot, msg);
};

module.exports.help = {
    name: 'sleep'
};