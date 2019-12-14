module.exports = class profile {

    static async setbd (msg, cont, mongod, db, author_id, Discord) {

        if(cont.length == 2) {
            var content = cont[1]
            if(content.length > 5 || content.length < 3) {
                return msg.channel.send({"embed": { "title": ":x: > **Date format is invalid ! Please enter your birthday like that : mm/dd**", "color": 13632027 }});
            }

            var userDB = await db.collection('user').findOne({ '_id': { $eq: author_id } });
            if(userDB.birthday != null) {
                return msg.channel.send({"embed": { "title": ":x: > **You can't change your birthday date ! Contact iwa for any demand of change.**", "color": 13632027 }});
            }

            var date = new Date(content);

            if(date && date != "Invalid Date") {
                var dd = String(date.getDate()).padStart(2, '0');
                var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
                var today = mm + '/' + dd;
                await db.collection('user').updateOne({ '_id': { $eq: author_id } }, { $set: { birthday: today }});
                const embed = new Discord.RichEmbed();
                embed.setAuthor("Your birthday is now set to : ", msg.author.avatarURL);
                embed.setTitle("**" + today + "**")
                embed.setColor('AQUA')

                mongod.close();

                try {
                    console.log("[" + new Date().toLocaleTimeString() + "] Birthday : " + msg.author.tag + " set to " + today)
                    return await msg.channel.send(embed).then(msg.delete())
                } catch(err) {
                    console.error(err);
                }
            } else {
                mongod.close();
                return msg.channel.send({"embed": { "title": ":x: > **Date format is invalid ! Please enter your birthday like that : mm/dd**", "color": 13632027 }});
            }

        } else {
            return msg.channel.send({"embed": { "title": ":x: > **Date format is invalid ! Please enter your birthday like that : mm/dd**", "color": 13632027 }});
        }

    }

    static async setfc (msg, cont, mongod, db, author_id, Discord) {

        if(cont.length == 2) {
            var content = cont[1]
            if(content.length != 14 || content.search(/\d\d\d\d-\d\d\d\d-\d\d\d\d/gi) == -1) {
                return msg.channel.send({"embed": { "title": ":x: > **Switch Friend Code format invalid ! Please enter your FC without the 'SW-' at the beginning**", "color": 13632027 }});
            }

            var userDB = await db.collection('user').findOne({ '_id': { $eq: author_id } });
            if(userDB.fc != null) {
                return msg.channel.send({"embed": { "title": ":x: > **You can't change your FC !**", "description": "**Contact <@125325519054045184> for any demand of change.**", "color": 13632027 }});
            }

            await db.collection('user').updateOne({ '_id': { $eq: author_id } }, { $set: { fc: content }});
            const embed = new Discord.RichEmbed();
            embed.setAuthor("Your Switch FC is now set to : ", msg.author.avatarURL);
            embed.setTitle("**" + content + "**")
            embed.setColor('AQUA')
            mongod.close();
            try {
                console.log("[" + new Date().toLocaleTimeString() + "] Switch FC : " + msg.author.tag + " set to " + content)
                return await msg.channel.send(embed).then(msg.delete())
            } catch(err) {
                console.error(err);
            }
        } else
            mongod.close();

    }

    static async resetbd (msg, cont, mongod, db, author_id, Discord, bot) {

        if(cont.length == 2) {

            let id = cont[1]

            var userDB = await db.collection('user').findOne({ '_id': { $eq: id } });
            if(!userDB) {
                return msg.channel.send({"embed": { "title": ":x: > **The user you entered isn't registered in the database yet**", "color": 13632027 }});
            }

            let user = await bot.fetchUser(userDB._id)

            await db.collection('user').updateOne({ '_id': { $eq: author_id } }, { $set: { birthday: null }});
            mongod.close();

            const embed = new Discord.RichEmbed();
            embed.setColor('AQUA')
            embed.setTitle(user.tag + "'s birthday is now reset");

            try {
                console.log("[" + new Date().toLocaleTimeString() + "] Reset Birthday of " + msg.author.tag)
                return await msg.channel.send(embed)
            } catch(err) {
                console.error(err);
            }
        }
    }

    static async resetfc (msg, cont, mongod, db, author_id, Discord, bot) {

        if(cont.length == 2) {

            let id = cont[1]

            var userDB = await db.collection('user').findOne({ '_id': { $eq: id } });
            if(!userDB) {
                return msg.channel.send({"embed": { "title": ":x: > **The user you entered isn't registered in the database yet**", "color": 13632027 }});
            }

            let user = await bot.fetchUser(userDB._id)

            await db.collection('user').updateOne({ '_id': { $eq: author_id } }, { $set: { fc: null }});
            mongod.close();

            const embed = new Discord.RichEmbed();
            embed.setColor('AQUA')
            embed.setTitle(user.tag + "'s FC is now reset");

            try {
                console.log("[" + new Date().toLocaleTimeString() + "] Reset Switch FC of " + msg.author.tag)
                return await msg.channel.send(embed)
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
            console.log("[" + new Date().toLocaleTimeString() + "] Fans join : " + msg.author.tag)
            return msg.member.addRole('613317566261231638').then(msg.reply("you'll be notified of every updates !"))
        }

    }

    static async leaveFan (msg) {

        if(await msg.channel.type != "text")return;
        if(await msg.guild.id != "225359327525994497")return;
        if(await msg.channel.id != "611349541685559316")return;

        if(await msg.member.roles.find(val => val.id == '613317566261231638')) {
            console.log("[" + new Date().toLocaleTimeString() + "] Fans leave : " + msg.author.tag)
            return msg.member.removeRole('613317566261231638').then(msg.reply("you'll not be notified anymore."))
        } else {
            return msg.reply("you're already not a Q-Bot fan !")
        }

    }

}