const actions = require('../js/actions')

module.exports.run = (bot, msg, args, db) => {
    actions.run(msg, args, db, 'pat');
};

module.exports.help = {
    name: 'pat'
};