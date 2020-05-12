import { Client, Message } from 'discord.js'
import { Db } from 'mongodb'
const Discord = require('discord.js')

module.exports.run = async (bot:Client, msg:Message, args:string[], db:Db) => {
    if(args.length == 1) {
        var content = args[0]
        if(content.length > 5 || content.length < 3) {
            return msg.channel.send({"embed": { "title": ":x: > **Date format is invalid ! Please enter your birthday like that :\n?setbirthday mm/dd**", "color": 13632027 }});
        }

        var userDB = await db.collection('user').findOne({ '_id': { $eq: msg.author.id } });
        if(userDB.birthday != null)
            return msg.channel.send({"embed": { "title": ":x: > **Sorry, you can't change your birthday date! Please contact <@125325519054045184> to change.**", "color": 13632027 }});

        var date = new Date(content);

        if(date) {
            var dd = String(date.getDate()).padStart(2, '0');
            var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
            var today = mm + '/' + dd;
            await db.collection('user').updateOne({ _id: msg.author.id }, { $set: { birthday: today }});
            const embed = new Discord.MessageEmbed();
            embed.setAuthor("Your birthday is now set to: ", msg.author.avatarURL);
            embed.setTitle(`**${today}**`)
            embed.setColor('AQUA')

            try {
                console.log(`info: birthday of ${msg.author.tag} set on ${today}`)
                return await msg.channel.send(embed).then(() => { msg.delete() })
            } catch(err) {
                console.error(err);
            }
        } else
            return msg.channel.send({"embed": { "title": ":x: > **Date format is invalid! Please enter your birthday in mm/dd format.", "color": 13632027 }});

    } else
        return msg.channel.send({"embed": { "title": ":x: > **Date format is invalid! Please enter your birthday in mm/dd format.", "color": 13632027 }});
};

module.exports.help = {
    name: 'setbirthday',
    usage: "?setbirthday (your birthday, mm/dd)",
    desc: "Register your birthday to Q-Bot.\nPlease enter in **mm/dd** format.\nThis uses UTC timezone."
};