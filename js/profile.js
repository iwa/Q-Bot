module.exports = class profile {

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

    static async boostColor (msg, boosterRole, boostColorRole) {
        if(await msg.member.roles.find(val => val.id == boosterRole)) {
            if(await msg.member.roles.find(val => val.id == boostColorRole))
                return msg.member.removeRole(boostColorRole).then(msg.reply("you put off your Booster Color !"))
            else
                return msg.member.addRole(boostColorRole).then(msg.reply("you put on your Booster Color !"))
        }
    }

}