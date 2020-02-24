module.exports.run = async (bot, msg) => {
    if(await msg.member.roles.find(val => val.id == process.env.BOOSTROLE)) {
        if(await msg.member.roles.find(val => val.id == process.env.BOOSTCOLOR))
            return msg.member.removeRole(process.env.BOOSTCOLOR).then(msg.reply("you put off your Booster Color !"))
        else
            return msg.member.addRole(process.env.BOOSTCOLOR).then(msg.reply("you put on your Booster Color !"))
    }
};

module.exports.help = {
    name: 'boostcolor',
    usage: "?boostcolor",
    desc: "Put on or put off the Booster Color\n**only usable if you are a Nitro booster**"
};