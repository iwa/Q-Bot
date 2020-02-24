module.exports.run = async (bot, msg) => {
    var ping = Math.ceil(bot.ping)
    await msg.channel.send(`ping ! \`${ping}ms\``)
        .then(console.log(`info: ping : ${msg.author.tag}`))
        .catch(console.error);
};

module.exports.help = {
    name: 'pong',
    usage: "?pong",
    desc: "This will send you the ping between Q-Bot and Discord's Servers"
};