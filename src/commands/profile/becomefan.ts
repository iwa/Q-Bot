import { Client, Message } from 'discord.js'

module.exports.run = async (bot:Client, msg:Message) => {
    if(msg.channel.type != "text")return;
    if(msg.guild.id != "225359327525994497")return;
    if(msg.channel.id != "611349541685559316")return;
    if(msg.member.roles.cache.find(val => val.id == '613317566261231638'))
        return msg.reply("You're already a Q-Bot fan !")
    else {
        console.log(`info: fans join: ${msg.author.tag}`)
        return msg.member.roles.add('613317566261231638')
            .then(() => {
                msg.reply("You'll be notified of every Q-Bot update !")
            })
    }
};

module.exports.help = {
    name: 'becomefan',
    usage: "?becomefan",
    desc: "Do this command if you want to be aware of every Q-Bot update"
};