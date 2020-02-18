const Discord = require('discord.js')

let reply = ["Yes", "No", "Yep", "Nope", "Probably", "Well...", "Probably not"]

module.exports.run = async (bot, msg, args) => {
    if(await msg.channel.type != "text")return;
    if(args.length < 1)return;
    let r = Math.floor((Math.random() * reply.length));
    const embed = new Discord.RichEmbed();
    embed.setTitle(reply[r])
    embed.setColor('GREY')
    console.log(`info: 8ball by ${msg.author.tag}`)
    return msg.channel.send(embed)
};

module.exports.help = {
    name: '8ball'
};