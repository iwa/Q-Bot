/**
 * Class regrouping staff commands
 * @packageDocumentation
 * @module Staff
 * @category Utils
 */
import { Client, Message, MessageEmbed } from 'discord.js'
import utilities from './utilities'

export default class staff {

    /**
     * Involves Discord integrated bulk delete
     * @param msg - Message object
     * @param args - Arguments in the message
     */
    static async bulk (msg:Message, args:string[]) {
        if(utilities.isMod(msg) == false || msg.author.id != process.env.IWA || msg.author.id != process.env.QUMU)return;

        if(args.length !== 0) {
            let channel:any = msg.channel
            if(msg.channel.type !== "dm") {
                msg.delete().catch(console.error);
                let nb = parseInt(args[0])
                msg.channel.bulkDelete(nb)
                    .then(() => {
                        console.log(`info: bulk delete: ${nb} in #${channel.name} by ${msg.author.tag}`)
                    })
                    .catch(console.error);
            }
        }
        else
            return msg.channel.send({"embed": { "title": ":x: > **Incomplete command.**", "color": 13632027 }});

    }

    /**
     * Mutes a member of the server
     * @param bot - Discord Client object
     * @param msg - Message object
     * @param args - Arguments in the message
     */
    static async mute (bot:Client, msg:Message, args:string[]):Promise<void> {
        if(utilities.isMod(msg) == false && msg.author.id != process.env.IWA && msg.author.id != process.env.QUMU)return;

        if(args.length == 2 && msg.channel.type != 'dm') {
            if(msg.mentions.everyone)return;

            let mention = msg.mentions.members.first()

            if(!mention)return;
            if(mention.id == msg.author.id || mention.id == bot.user.id)return;

            if((msg.author.id != process.env.IWA || msg.author.id != process.env.QUMU) && mention.roles.cache.find(val => val.id == process.env.MODROLE))return;

            try {
                msg.delete();
            } catch (error) {
                console.error(error);
            }

            let time = parseInt(args[1])

            if(time <= 0 || time > 1440)return;

            time = time * 60000;

            const embed = new MessageEmbed();
            embed.setColor('RED')
            embed.setTitle(`:octagonal_sign: **${mention.user.username}**, you've been muted for ${args[1]} minute(s) by **${msg.author.username}**`)

            try {
                await mention.roles.add('636254696880734238')
                let reply = await msg.channel.send(embed)
                setTimeout(async () => {
                    await reply.delete()
                    return mention.roles.remove('636254696880734238')
                }, time)
            } catch(err) {
                console.error(err);
            }
        }
    }

    /**
     * Enables / Disables maintenance mode
     * (only usable by iwa)
     * @param bot - Discord Client object
     * @param msg - Message object
     */
    static async sleep (bot:Client, msg:Message):Promise<"1" | "0"> {
        if(msg.author.id != process.env.IWA)return;
        if(process.env.SLEEP == '0') {
            await bot.user.setPresence({ activity: { name: "being updated...", type: 0 }, status: 'dnd' })
                .then(() => {
                    msg.react("✅");
                    console.log("info: sleeping enabled")
                })
                .catch(console.error);
            msg.channel.send("Sleeping Mode On!")
            return process.env.SLEEP = '1';
        } else {
            await bot.user.setPresence({ activity: { name: "Qumu's Remixes | ?help", type: 2 }, status: 'online' })
                .then(() => {
                    msg.react("✅");
                    console.log("info: sleeping disabled")
                })
                .catch(console.error);
            msg.channel.send("Sleeping Mode Off!")
            return process.env.SLEEP = '0';
        }
    }
}