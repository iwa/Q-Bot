import { Client, Message } from 'discord.js'

module.exports.run = (bot:Client, msg:Message) => {
    msg.reply("iwa taught me to reply: you're welcome cutie c;")
};

module.exports.help = {
    name: 'thanksiwa',
    usage: "?thanksiwa",
    desc: "Thank iwa for his work"
};