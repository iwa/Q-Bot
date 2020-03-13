const Discord = require('discord.js')

module.exports.run = async (bot, msg, args, db) => {
    if(args.length == 1) {
        var content = args[0]
        if(content.length > 5 || content.length < 3) {
            return msg.channel.send({"embed": { "title": ":x: > **Date format is invalid ! Please enter your birthday like that :\n?setbirthday mm/dd**", "color": 13632027 }});
        }

        var userDB = await db.get('user').find({ id: msg.author.id }).value();
        if(userDB.birthday != null) {
            return msg.channel.send({"embed": { "title": ":x: > **You can't change your birthday date ! Contact iwa for any demand of change.**", "color": 13632027 }});
        }

        var date = new Date(content);

        if(date && date != "Invalid Date") {
            var dd = String(date.getDate()).padStart(2, '0');
            var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
            var today = mm + '/' + dd;
            await db.get('user').find({ id: msg.author.id }).set('birthday', today).write();
            const embed = new Discord.MessageEmbed();
            embed.setAuthor("Your birthday is now set to : ", msg.author.avatarURL);
            embed.setTitle(`**${today}**`)
            embed.setColor('AQUA')

            try {
                console.log(`info: birthday of ${msg.author.tag} set on ${today}`)
                return await msg.channel.send(embed).then(msg.delete())
            } catch(err) {
                console.error(err);
            }
        } else
            return msg.channel.send({"embed": { "title": ":x: > **Date format is invalid ! Please enter your birthday like that : mm/dd**", "color": 13632027 }});

    } else
        return msg.channel.send({"embed": { "title": ":x: > **Date format is invalid ! Please enter your birthday like that : mm/dd**", "color": 13632027 }});
};

module.exports.help = {
    name: 'setbirthday',
    usage: "?setbirthday (your birthday, mm/dd)",
    desc: "Register your birthday to Q-Bot\nPlease use this format : **mm/dd**\nThis use UTC timezone"
};