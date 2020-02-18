const actions = require('../js/actions')

module.exports.run = (bot, msg, args, db) => {
    actions.run(msg, args, db, 'boop');
};

module.exports.help = {
    name: 'boop'
};