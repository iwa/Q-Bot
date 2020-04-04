module.exports.run = async (bot, msg) => {
    var ping = Math.ceil(bot.ws.ping)
    await msg.channel.send(`:ping_pong: Ping ! \`${ping}ms\``)
        .then(console.log(`info: ping : ${msg.author.tag}`))
        .catch(console.error);
};

module.exports.help = {
    name: 'pong',
    usage: "?pong",
    desc: "Get response time between Q-Bot and Discord servers."
};