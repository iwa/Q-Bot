const staff = require('../js/staff')

module.exports.run = (bot, msg, args) => {
    staff.bulk(msg, args);
};

module.exports.help = {
    name: 'bulk'
};