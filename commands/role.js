const utils = require('../js/utilities')

module.exports.run = (bot, msg, args) => {
    utils.role(msg, args);
};

module.exports.help = {
    name: 'role',
    usage: "?role (join | leave) (game)",
    desc: "Join or leave games-related roles"
};