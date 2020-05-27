import { Client, Message } from 'discord.js'
import { Db } from 'mongodb'

module.exports.run = async (bot: Client, msg: Message, args: string[], db: Db) => {
    msg.reply("iwa taught me to reply: you're welcome cutie c;")
    await db.collection('user').updateOne({ '_id': { $eq: bot.user.id } }, { $inc: { thanksiwa: 1 } });
    await msg.member.roles.add(process.env.IWAFANROLE)
};

module.exports.help = {
    name: 'thanksiwa',
    usage: "?thanksiwa",
    desc: "Thank iwa for his work"
};