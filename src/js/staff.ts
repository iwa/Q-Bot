const Discord = require('discord.js')
const utils = require('./utilities')

module.exports = class staff {

    static async bulk (msg, args) {
        if(utils.isMod(msg) == false || msg.author.id != process.env.IWA || msg.author.id != process.env.QUMU)return;

        if(args.length !== 0) {
            if(msg.channel.type !== "dm") {
                msg.delete().catch(console.error);
                var nb = parseInt(args[0])
                msg.channel.bulkDelete(nb)
                    .then(console.log(`info: bulk delete: ${nb} in #${msg.channel.name} by ${msg.author.tag}`))
                    .catch(console.error);
            }
        }
        else
            return msg.channel.send({"embed": { "title": ":x: > **Incomplete command.**", "color": 13632027 }});

    }

    static async mute (bot, msg, args) {

        if(utils.isMod(msg) == false || msg.author.id != process.env.IWA || msg.author.id != process.env.QUMU)return;

        if(args.length == 2 && msg.channel.type != 'dm') {
            if(msg.mentions.everyone)return;

            var mention = msg.mentions.members.first()

            if(!mention)return;
            if(mention.id == msg.author.id || mention.id == bot.user.id)return;

            if((msg.author.id != process.env.IWA || msg.author.id != process.env.QUMU) && mention.roles.find(val => val.id == process.env.MODROLE) > -1)return;

            try {
                msg.delete();
            } catch (error) {
                console.error(error);
            }

            var time = args[1]

            if(time <= 0 || time > 1440)return;

            time = time * 60000;

            const embed = new Discord.MessageEmbed();
            embed.setColor('RED')
            embed.setTitle(`**${mention.user.username}**, you've been muted for ${args[1]} minutes by **${msg.author.username}**`)

            try {
                await mention.roles.add('636254696880734238')
                var reply = await msg.channel.send(embed)
                setTimeout(async () => {
                    await reply.delete()
                    return mention.roles.remove('636254696880734238')
                }, time)
            } catch(err) {
                console.error(err);
            }

        }

    }

    static async sleep (bot, msg) {
        if(msg.author.id != process.env.IWA)return;
        if(process.env.SLEEP == 0) {
            await bot.user.setPresence({ activity: { name: "being updated...", type: 0 }, status: 'dnd' })
                .then(msg.react("✅") , console.log("info: sleeping enabled"))
                .catch(console.error);
            msg.channel.send("Sleeping Mode On!")
            return process.env.SLEEP = 1;
        } else {
            await bot.user.setPresence({ activity: { name: "Qumu's Remixes | ?help", type: 2 }, status: 'online' })
                .then(msg.react("✅") , console.log("info: sleeping disabled"))
                .catch(console.error);
            msg.channel.send("Sleeping Mode Off!")
            return process.env.SLEEP = 0;
        }
    }

}