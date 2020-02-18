module.exports = class profile {

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
}