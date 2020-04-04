const utils = require('../js/utilities')

module.exports.run = async (bot, msg) => {
    var iwa = await bot.users.fetch(process.env.IWA);
    var avatar = iwa.avatarURL({ format: 'png', dynamic: false, size: 256 })
    utils.info(msg, avatar);
};

module.exports.help = {
    name: 'info',
    usage: "?info",
    desc: "Show some info about Q-Bot"
};