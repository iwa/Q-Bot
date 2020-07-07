import { Client, Message, MessageEmbed } from 'discord.js'
import { Db } from 'mongodb'

module.exports.run = async (bot: Client, msg: Message, args: string[], db: Db) => {
    if (args.length >= 1) {
        let content = args.join(' ');
        if (content.length > 100 || content.length < 3)
            return msg.channel.send({ "embed": { "title": ":x: > **Please write a description under 100 characters.**", "color": 13632027 } });

        await db.collection('user').updateOne({ _id: msg.author.id }, { $set: { desc: content } }, { upsert: true });
        const embed = new MessageEmbed();
        embed.setAuthor("Your description is now set to : ", msg.author.avatarURL({ format: 'png', dynamic: false, size: 128 }));
        embed.setTitle(`**${content}**`)
        embed.setColor('AQUA')
        try {
            console.log(`info: set desc of ${msg.author.tag} set`)
            return await msg.channel.send(embed);
        } catch (err) {
            console.error(err);
        }
    }
};

module.exports.help = {
    name: 'setdesc',
    usage: "?setdesc (description)",
    desc: "Register a little description about you to Q-Bot."
};