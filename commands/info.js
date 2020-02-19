const utils = require('../js/utilities')

module.exports.run = async (bot, msg) => {
    var iwa = await bot.fetchUser(process.env.IWA);
    utils.info(msg, iwa.avatarURL);
};

module.exports.help = {
    name: 'info'
};