import { Client, Message } from 'discord.js'
module.exports.run = (bot:Client, msg:Message) => {
    msg.reply('**Deprecated** -> use `?pat` instead');
};

module.exports.help = {
    name: 'patpat',
    usage: "**Deprecated** -> use `?pat` instead",
    desc: ""
};