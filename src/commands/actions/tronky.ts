/* Hey-mo! Hy~ here. I created the tronky command (it was a copy-paste job haha.)
   I'll walk you through how this works in case you ever wanted to replicate this */

import { Client, Message, MessageEmbed } from 'discord.js'

module.exports.run = async (bot: Client, msg: Message, args: string[]) => {
    if (args.length <= 3) { // There's three arguments here: the two people to give tronkys to, and the flavour.
        if (msg.mentions.everyone) return;
        let mentionFirst = msg.mentions.users.first() // Variable stuff here.
        let mentionSecond = msg.mentions.users.last() // This just sets to the people who were @'d in the message.

        // Define and decide the flavour of the tronky. Hazelnut is the default and is used if no or invalid flavour provided.
        let flavour: [string] = ['hazelnut']
        if (args.length == 3) {
            if ('cocoa' in args) flavour = ['cocoa']
            if ('milk' in args) flavour = ['milk']
            if ('cereal' in args) flavour = ['cereal']
            if ('pistachio' in args) flavour = ['pistacio']
        }
        

        if (!mentionFirst || !mentionSecond) return; // If it isn't a mention, don't continue
        if (mentionFirst.id == msg.author.id || mentionSecond.id == msg.author.id) // If mention is person who sent message, send this
            return msg.channel.send({ "embed": { "title": `:x: > **You can't give yourself a tronky!**`, "color": 13632027 } });

        if ((mentionFirst.id == bot.user.id || mentionSecond.id == bot.user.id)) // If mention is Q-Bot, give a tronky back ^u^
            setTimeout(() => {
                msg.reply('<:tronkyForYou:712980723258097664>');
            }, 2000)

        const embed = new MessageEmbed();
        embed.setColor('#F2DEB0')
        if (msg.mentions.members.size == 2) // Send the embed for two people
            embed.setDescription(`**<@${msg.author.id}>** gave **${flavour}** tronkys to **<@${mentionFirst.id}>** & **<@${mentionSecond.id}>**! <:tronkyForYou:712980723258097664><:tronkyForYou:712980723258097664>`)
        else // Send the embed for one person
            embed.setDescription(`**<@${msg.author.id}>** gave a **${flavour}** tronky to **<@${mentionFirst.id}>**! <:tronkyForYou:712980723258097664>`)

        return msg.channel.send(embed)
            .then(() => { // Log into the console.
                console.log(`info: tronky sent by ${msg.author.tag}`);
            })
            .catch(console.error);
    } else if (args.length > 3) // Kinda similar to how actions used to work before where you could only action up to two people.
        msg.reply("Only two tronkys at a time! :(")
};

module.exports.help = { // Define the info to display in the ?help command.
    name: 'tronky',
    usage: "?tronky (mention someone) [someone else]",
    desc: "Give people tronkys"
};