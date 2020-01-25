module.exports = class profile {

    static async show (msg, cont, bot, profileImg) {
        if(cont.length == 2) {

            if(msg.mentions.everyone)return;

            var mention = msg.mentions.users.first()

            if(!mention)return;

            if(mention.id == msg.author.id || mention.id == bot.user.id)return;

            return profileImg(msg, mention.id);

        } else
            return profileImg(msg, msg.author.id);
    }

    static async setbd (msg, cont, db, Discord) {

        if(cont.length == 2) {
            var content = cont[1]
            if(content.length > 5 || content.length < 3) {
                return msg.channel.send({"embed": { "title": ":x: > **Date format is invalid ! Please enter your birthday like that : mm/dd**", "color": 13632027 }});
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
                const embed = new Discord.RichEmbed();
                embed.setAuthor("Your birthday is now set to : ", msg.author.avatarURL);
                embed.setTitle("**" + today + "**")
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

    }

    static async setfc (msg, cont, mongod, db, Discord) {

        if(cont.length == 2) {
            var content = cont[1]
            if(content.length != 14 || content.search(/\d\d\d\d-\d\d\d\d-\d\d\d\d/gi) == -1) {
                return msg.channel.send({"embed": { "title": ":x: > **Switch Friend Code format invalid ! Please enter your FC without the 'SW-' at the beginning**", "color": 13632027 }});
            }

            var userDB = await db.get('user').find({ id: msg.author.id }).value();
            if(userDB.fc != null) {
                return msg.channel.send({"embed": { "title": ":x: > **You can't change your FC !**", "description": "**Contact <@125325519054045184> for any demand of change.**", "color": 13632027 }});
            }

            await db.get('user').find({ id: msg.author.id }).set('fc', content).write();
            const embed = new Discord.RichEmbed();
            embed.setAuthor("Your Switch FC is now set to : ", msg.author.avatarURL);
            embed.setTitle("**" + content + "**")
            embed.setColor('AQUA')
            mongod.close();
            try {
                console.log(`info: switch fc of ${msg.author.tag} set`)
                return await msg.channel.send(embed).then(msg.delete())
            } catch(err) {
                console.error(err);
            }
        }
    }

    static async reset (msg, cont, db, Discord, bot, type) {

        if(cont.length == 2) {

            let id = cont[1]

            var userDB = await db.get('user').find({ id: id }).value()
            if(!userDB)
                return msg.channel.send({"embed": { "title": ":x: > **The user you entered isn't registered in the database yet**", "color": 13632027 }});

            let user = await bot.fetchUser(userDB.id)

            await db.get('user').find({ id: msg.author.id }).set(type, null).write();

            const embed = new Discord.RichEmbed();
            embed.setColor('AQUA')
            embed.setTitle(`${user.tag}'s ${type} is now reset`);

            try {
                console.log(`info: reset ${type} of ${msg.author.tag}`)
                return await msg.channel.send(embed);
            } catch(err) {
                console.error(err);
            }
        }
    }

    static async joinFan (msg) {

        if(await msg.channel.type != "text")return;
        if(await msg.guild.id != "225359327525994497")return;
        if(await msg.channel.id != "611349541685559316")return;

        if(await msg.member.roles.find(val => val.id == '613317566261231638')) {
            return msg.reply("you're already a Q-Bot fan !")
        } else {
            console.log(`info: fans join: ${msg.author.tag}`)
            return msg.member.addRole('613317566261231638').then(msg.reply("you'll be notified of every updates !"))
        }

    }

    static async leaveFan (msg) {

        if(await msg.channel.type != "text")return;
        if(await msg.guild.id != "225359327525994497")return;
        if(await msg.channel.id != "611349541685559316")return;

        if(await msg.member.roles.find(val => val.id == '613317566261231638')) {
            console.log(`info: fans leave: ${msg.author.tag}`)
            return msg.member.removeRole('613317566261231638').then(msg.reply("you'll not be notified anymore."))
        } else {
            return msg.reply("you're already not a Q-Bot fan !")
        }

    }

}