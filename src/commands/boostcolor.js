module.exports.run = async (bot, msg) => {
    if(await msg.member.roles.cache.find(val => val.id == process.env.BOOSTROLE)) {
        if(await msg.member.roles.cache.find(val => val.id == process.env.BOOSTCOLOR))
            return msg.member.roles.remove(process.env.BOOSTCOLOR).then(msg.reply("You took off your Booster Color !"))
        else
            return msg.member.roles.add(process.env.BOOSTCOLOR).then(msg.reply("You put on your Booster Color !"))
    }
};

module.exports.help = {
    name: 'boostcolor',
    usage: "?boostcolor",
    desc: "Put on or put off the Booster Color\n**only usable if you are a Nitro booster**"
};