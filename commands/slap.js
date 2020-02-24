const actions = require('../js/actions')

module.exports.run = (bot, msg, args, db) => {
    actions.run(msg, args, db, 'slap');
};

module.exports.help = {
    name: 'slap',
    usage: "?slap (mention someone) [someone else]",
    desc: "Slap people by mentioning them"
};