let config = require('../config.json')

module.exports.run = async (bot, msg) => {
    if(await msg.member.roles.find(val => val.id == config.boosterRole)) {
        if(await msg.member.roles.find(val => val.id == config.boostColorRole))
            return msg.member.removeRole(config.boostColorRole).then(msg.reply("you put off your Booster Color !"))
        else
            return msg.member.addRole(config.boostColorRole).then(msg.reply("you put on your Booster Color !"))
    }
};

module.exports.help = {
    name: 'boostcolor'
};