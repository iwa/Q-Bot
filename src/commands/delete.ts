import { Client, Message, TextChannel, MessageEmbed } from 'discord.js';
import utilities from '../utils/utilities';
import { Db } from 'mongodb';

module.exports.run = async (bot: Client, msg: Message, args: string[], db: Db) => {
    if (msg.author.id != process.env.IWA) return;

    let message = await db.collection('suggestions').findOne({ _id: parseInt(args[0]) });
    if(!message)
        return msg.react('❌');

    let channel = await bot.channels.fetch(process.env.SUGGESTIONTC);
    let suggestion = await (channel as TextChannel).messages.fetch(message.msg)

    if(!suggestion.deletable)
        return msg.react('❌');

    await suggestion.delete();
    await db.collection('suggestions').deleteOne({ _id: parseInt(args[0]) });

    return msg.react('✅');
};

module.exports.help = {
    name: 'delete',
    usage: "?delete (id)",
    staff: true
};