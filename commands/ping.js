module.exports.run = async (bot, msg) => {
    var ping = Math.ceil(bot.ping)
    await msg.channel.send(`pong ! \`${ping}ms\``)
        .then(console.log(`info: ping : ${msg.author.tag}`))
        .catch(console.error);
};

module.exports.help = {
    name: 'ping'
};