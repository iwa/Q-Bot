import { Client, Message } from 'discord.js'

module.exports.run = async (bot:Client, msg:Message) => {
    if(msg.channel.type != "text")return;
    if(msg.guild.id != "225359327525994497")return;
    if(msg.channel.id != "611349541685559316")return;
    if(msg.member.roles.cache.find(val => val.id == '613317566261231638')) {
        console.log(`info: fans leave: ${msg.author.tag}`)
        return msg.member.roles.remove('613317566261231638')
        .then(() => { msg.reply("You'll not be notified anymore.") })
    } else
        return msg.reply("you're already not a Q-Bot fan !")
};

module.exports.help = {
    name: 'leavefan',
    usage: "?leavefan",
    desc: "Do this command if you no longer want to be aware of every Q-Bot update."
};