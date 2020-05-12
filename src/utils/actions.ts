import { Client, Message, MessageEmbed } from 'discord.js';
import { Db } from 'mongodb';
import utilities from './utilities'

let reply = ["awww", "thank you :33", "damn you're so precious", "why are you so cute with me ?", "omg", "<3", "so cuuuute c:", "c:", "c;", ":3", "QT af :O", "^u^ thanks!", ">u<", "-u-"] // That "oh yeaaaah ;3" is a little... suggestive. I've changed it. ;) - Hy~

interface stringKeyArray {
	[index:string]: any;
}

let lastGif:stringKeyArray = { // define the first gif of action (0)
    'pat': 0,
    'hug': 0,
    'boop': 0,
    'slap': 0
};

let count:stringKeyArray = { // define last gif of action
    'pat': 46,
    'hug': 47,
    'boop': 15,
    'slap': 9
};

export default async function actionsRun (bot:Client, msg:Message, args:string[], db:Db, type:string) {
    let n = utilities.randomInt(count[type])
    while(lastGif[type] == n) {
        n = utilities.randomInt(count[type]);
    }
    lastGif[type] = n;
    let r = utilities.randomInt(reply.length)
    let mentionFirst, mentionSecond, user;

    if(args.length == 1) {

        if(msg.mentions.everyone)return;
        mentionFirst = msg.mentions.users.first()
        if(!mentionFirst)return;
        if(mentionFirst.id == msg.author.id)
            return await msg.channel.send({"embed": { "title": `:x: > **You can't ${type} youself!**`, "color": 13632027 }});
        const embed = new MessageEmbed();
        embed.setColor('#F2DEB0')
        if(mentionFirst.id == '606458989575667732' && type != 'slap') {
            setTimeout(() => {
                r-1;
                msg.channel.send(reply[r])
            }, 2000)
        }
        embed.setTitle(`**${msg.author.username}** ${type}s you **${mentionFirst.username}**!`)
        embed.setImage(`https://${process.env.CDN_URL}/img/${type}/${n}.gif`)
        user = await db.collection('user').findOne({ '_id': { $eq: msg.author.id } });
        await db.collection('user').updateOne({ '_id': { $eq: msg.author.id } }, { $inc: { [type]: 1 }});
        await db.collection('user').updateOne({ '_id': { $eq: bot.user.id } }, { $inc: { [type]: 1 }});
        embed.setFooter(`You have given ${user[type] + 1} ${type}s`)
        return await msg.channel.send(embed)
        .then(() => {
            console.log(`info: ${type} sent by ${msg.author.tag}`);
        })
        .catch(console.error);

    } else if(args.length == 2) {

        if(msg.mentions.everyone)return;
        mentionFirst = msg.mentions.users.first()
        mentionSecond = msg.mentions.users.last()
        if(!mentionFirst || !mentionSecond)return;
        if(mentionFirst.id == msg.author.id || mentionSecond.id == msg.author.id)
            return await msg.channel.send({"embed": { "title": `:x: > **You can't ${type} youself!**`, "color": 13632027 }});
        if(mentionFirst.id == mentionSecond.id)
            return await msg.channel.send({"embed": { "title": `:x: > **You can't ${type} the same person twice in one go!**`, "color": 13632027 }});
        const embed = new MessageEmbed();
        embed.setColor('#F2DEB0')
        if((mentionFirst.id == '606458989575667732' || mentionSecond.id == '606458989575667732') && type != 'slap') {
            setTimeout(() => {
                r-1;
                msg.channel.send(reply[r])
            }, 2000)
        }
        embed.setTitle(`**${msg.author.username}** ${type}s you **${mentionFirst.username}** & **${mentionSecond.username}** !`)
        embed.setImage(`https://${process.env.CDN_URL}/img/${type}/${n}.gif`)
        user = await db.collection('user').findOne({ '_id': { $eq: msg.author.id } });
        await db.collection('user').updateOne({ '_id': { $eq: msg.author.id } }, { $inc: { [type]: 2 }});
        await db.collection('user').updateOne({ '_id': { $eq: bot.user.id } }, { $inc: { [type]: 2 }});
        embed.setFooter(`You have given ${user[type] + 2} ${type}s`)
        return await msg.channel.send(embed)
        .then(() => {
            console.log(`info: ${type} sent by ${msg.author.tag}`);
        })
        .catch(console.error);

    } else if(args.length > 2) {
        if(type == "hug") { // Technically speaking, even with two arms you can fit more than two people in a hug, so uhhh... Custom dialog, perhaps? - Hy~
            msg.reply(`You can't ${type} them all, you can't fit more than two people in a hug! :(`)
        }
        else {
            msg.reply(`You can't ${type} them all, you only have 2 arms! :(`)
        }
    }
}
