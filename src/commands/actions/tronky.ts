/* Hey-mo! Hy~ here. I created the tronky command (it was a copy-paste job haha.)
   I'll walk you through how this works in case you ever wanted to replicate this */

import { Client, Message, MessageEmbed } from 'discord.js'

module.exports.run = async (bot: Client, msg: Message, args: string[]) => {
    if (args.length <= 11) {
        if (msg.mentions.everyone) return;
        if (!msg.mentions.members) return;

        // Define and decide the flavour of the tronky. Hazelnut is the default and is used if no or invalid flavour provided.
        let flavour: string = 'hazelnut'
        if ('cocoa' in args) flavour = 'cocoa'
        if ('milk' in args) flavour = 'milk'
        if ('cereal' in args) flavour = 'cereal'
        if ('pistachio' in args) flavour = 'pistacio'

        if (msg.mentions.members.has(msg.author.id)) // If mention is person who sent message, send this
            return msg.channel.send({ "embed": { "title": `:x: > **You can't give yourself a tronky!**`, "color": 13632027 } });

        if (msg.mentions.members.has(bot.user.id)) // If mention is Q-Bot, give a tronky back ^u^
            setTimeout(() => {
                msg.reply('<:tronkyForYou:712980723258097664>');
            }, 2000)

        const embed = new MessageEmbed();
        embed.setColor('#F2DEB0')

        if (msg.mentions.members.size >= 2) {
            let users = msg.mentions.members.array()
            let title: string = `**<@${msg.author.id}>** gave **${flavour}** tronkys to **<@${users[0].id}>**`;
            for (let i = 1; i < (msg.mentions.members.size - 1); i++)
                title = `${title}, **<@${users[i].id}>**`
            title = `${title} & **<@${(msg.mentions.members.last()).id}>**! <:tronkyForYou:712980723258097664><:tronkyForYou:712980723258097664><:tronkyForYou:712980723258097664>`
            embed.setDescription(title);
        } else
            embed.setDescription(`**<@${msg.author.id}>** gave a **${flavour}** tronky to **<@${(msg.mentions.members.first()).id}>**! <:tronkyForYou:712980723258097664>`)

        return msg.channel.send(embed)
            .then(() => { console.log(`info: tronky sent by ${msg.author.tag}`); })
            .catch(console.error);
    }
};

module.exports.help = { // Define the info to display in the ?help command.
    name: 'tronky',
    usage: "?tronky (mention someone) [someone else]",
    desc: "Give people tronkys"
};