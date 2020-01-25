module.exports = class staff {

    static async bulk (msg, cont, author) {

        if(cont.length !== 1) {
            if(msg.channel.type !== "dm") {
                msg.delete().catch(console.error);
                cont.shift()
                var nb = parseInt(cont[0])
                msg.channel.bulkDelete(nb)
                    .then(console.log("[" + new Date().toLocaleTimeString() + "] Bulk delete : " + nb + " in #" + msg.channel.name + " by " + author))
                    .catch(console.error);
            }
        }
        else
            return msg.channel.send({"embed": { "title": ":x: > **Incomplete command**", "color": 13632027 }});

    }

    static async mute (msg, cont, msg.author.id, admin, modRole, Discord, bot) {

        if(cont.length == 3 && msg.channel.type != 'dm') {
            if(msg.mentions.everyone)return;

            var mention = msg.mentions.members.first()

            if(!mention)return;
            if(mention.id == msg.author.id || mention.id == bot.user.id)return;

            if(admin.indexOf(msg.author.id) == -1 && mention.roles.find(val => val.id == modRole) > -1)return;

            try {
                msg.delete();
            } catch (error) {
                console.error(error);
            }

            var time = cont[2]

            if(time <= 0 || time > 1440)return;

            time = time * 60000;

            const embed = new Discord.RichEmbed();
            embed.setColor('RED')
            embed.setTitle("**" + mention.user.username + "**, you've been muted for " + cont[2] + " minutes by **" + msg.author.username + "**")

            try {
                await mention.addRole('636254696880734238')
                var reply = await msg.channel.send(embed)
                setTimeout(async () => {
                    await reply.delete()
                    return mention.removeRole('636254696880734238')
                }, time)
            } catch(err) {
                console.error(err);
            }

        }

    }

    static sleep (msg, bot, isSleeping) {
        if(isSleeping == 0) {
            bot.user.setStatus("dnd")
            bot.user.setActivity("being updated...", {type : 0})
                .then(msg.react("✅") , console.log("info: sleeping enabled"))
                .catch(console.error);
            msg.channel.send("Sleeping Mode On !")
            return 1;
        } else {
            bot.user.setStatus("online")
            bot.user.setActivity("Qumu's Remixes | ?help", {type : 2})
                .then(msg.react("✅") , console.log("info: sleeping disabled"))
                .catch(console.error);
            msg.channel.send("Sleeping Mode Off !")
            return 0;
        }
    }

}