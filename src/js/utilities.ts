import * as Discord from "discord.js";
import { Db } from 'mongodb';

let levels = require('../../lib/levels.json')

export default class utilities {

    public static async info (msg:Discord.Message, iwaUrl:string):Promise<Discord.Message> {

        var embed = {
            "embed": {
                "title": "**Bot Infos**", // I've added a GitHub link too. - Hy~
                "description": "Q-Bot is developed and handled by <@125325519054045184>.\nYou can help contribute to Q-Bot's code [here!](https://github.com/iwa/Q-Bot)\n\nLanguage : `TypeScript` using NodeJS\nAPI Access : `discord.js` package on npm\n\nYou can access to the index of commands by typing `?help`\n\nAll my work is done for free, but you can still financially support me [here](https://paypal.me/nokushi)",
                "color": 13002714,
                "footer": {
                  "text": "Created with ♥ by iwa | Copyright © iwa, v1.4.0"
                },
                "thumbnail": {
                  "url": iwaUrl
                }
            }
        }

        try {
            console.log(`info: info: ${msg.author.tag}`)
            await msg.author.send(embed)
        } catch(ex) {
            return msg.channel.send("**:x: > Please open your DMs!**")
        }

    }

    static leaderboard (bot:Discord.Client, msg:Discord.Message, args:string[], db:Db):Promise<void> {
        if(args.length > 1)return;

        switch(args[0]) {
            case "xp":
            case "exp":
                return leaderboard(bot, msg, db, 'exp')

            case "pat":
            case "pats":
            case "patpat":
            case "patpats":
                return leaderboard(bot, msg, db, 'pat')

            case "hug":
            case "hugs":
                return leaderboard(bot, msg, db, 'hug')

            case "boop":
            case "boops":
                return leaderboard(bot, msg, db, 'boop')

            case "slap":
            case "slaps":
                return leaderboard(bot, msg, db, 'slap')

            default:
                msg.channel.send({"embed": { "title": "`exp | pat | hug | boop | slap`", "color": 3396531}});
            break;
        }
    }

    static randomInt(max:number):number {
        return Math.floor(Math.random() * Math.floor(max) + 1);
    }

    static levelInfo(xp:number):{'level':number, 'current':number, 'max':number} {
        if(xp < levels[1].amount) {
            return {'level': 0, 'current': xp, 'max': levels[1].amount}
        }
        for(var i = 1; i < 20; i++) {
            if(xp >= levels[i].amount && xp < levels[i+1].amount) {
                return {'level': i, 'current': (xp - levels[i].amount), 'max': (levels[i+1].amount - levels[i].amount)}
            }
        }
        return {'level': 20, 'current': xp, 'max': levels[20].amount}
    }

    static isMod(msg:Discord.Message):boolean {
        if(msg.member.roles.cache.find(val => val.id == process.env.MODROLE)) { return true }
        else { return false }
    }
}

// Functions

async function leaderboard(bot:Discord.Client, msg:Discord.Message, db:Db, type:string) {
    let leaderboard = await db.collection('user').find({ hidden: false }).sort({[type]:-1}).limit(10).toArray();
    var n = 0;

    msg.channel.startTyping()
    var title = `${type.charAt(0).toUpperCase()}${type.slice(1)}`

    const embed = new Discord.MessageEmbed();
    embed.setColor(16114507)
    embed.setTitle(`:trophy: **${title} Leaderboard**`)

    leaderboard.forEach(async elem => {
        let user = await bot.users.fetch(elem._id)
        n++;
        embed.addField(`**${n}. ${user.username}**`, `${elem[type]} ${type}s`)
    })

    setTimeout(() => {
        msg.channel.send(embed)
        .then(() => {
            console.log(`info: ${type} leaderboard: ${msg.author.tag}`);
            msg.channel.stopTyping()
        }).catch(console.error)
    }, 1500)
}