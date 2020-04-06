import * as Discord from "discord.js";
import { Db } from 'mongodb';

let levels = require('../../lib/levels.json')

module.exports = class utilities {

    static async info (msg:Discord.Message, iwaUrl:string) {

        var embed = {
            "embed": {
                "title": "**Bot Infos**",
                "description": "Q-Bot is developed and handled by <@125325519054045184>\n\nLanguage : `JavaScript` using NodeJS\nAPI Access : `discord.js` package on npm\n\nYou can access to the index of commands by typing `?help`\n\nAll my work is done for free, but you can still support me [here](https://paypal.me/nokushi)",
                "color": 13002714,
                "footer": {
                  "text": "Created with ♥ by iwa | Copyright © iwa, v1.2.0"
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

    static leaderboard (bot:Discord.Client, msg:Discord.Message, args:string[], db:Db) {
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

    static async role (msg:Discord.Message, args:string[]) {
        if(msg.channel.type != "text")return;
        if(msg.channel.id != "611349541685559316")return;

        if(args.length < 2)return;

        var req = args[0];
        args.splice(0, 1);
        var game = args.join(' ').toLowerCase();

        switch(req) {
            case "join":
                return join(msg, game);

            case "leave":
                return leave(msg, game);
        }

    }


    static randomInt(max:number) {
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

    static isMod(msg:Discord.Message) {
        if(msg.member.roles.cache.find(val => val.id == process.env.MODROLE)) { return true }
        else { return false }
    }

}

// Functions

async function join (msg:Discord.Message, game:string) {
    switch (game) {
        case "mariokart":
        case "mario kart":
            if(! await msg.member.roles.cache.find(val => val.id == '614445539693559820')) {
                return msg.member.roles.add('614445539693559820')
                .then(() => {
                    msg.reply("you joined the Mario Kart role !")
                })
            } break;

        case "smashbros":
        case "smash bros":
        case "smash":
            if(! await msg.member.roles.cache.find(val => val.id == '614445571045982228')) {
                return msg.member.roles.add('614445571045982228')
                .then(() => {
                    msg.reply("you joined the Smash Bros role !")
                })
            } break;

        case "splatoon":
        case "sploon":
            if(! await msg.member.roles.cache.find(val => val.id == '614445571276668930')) {
                return msg.member.roles.add('614445571276668930')
                .then(() => {
                    msg.reply("you joined the Splatoon role !")
                })
            } break;

        case "mariomaker":
        case "mario maker":
            if(! await msg.member.roles.cache.find(val => val.id == '614445572199546880')) {
                return msg.member.roles.add('614445572199546880')
                .then(() => {
                    msg.reply("you joined the Mario Maker role !")
                })
            } break;

        case "pokemon":
        case "pokémon":
            if(! await msg.member.roles.cache.find(val => val.id == '662017803804475393')) {
                return msg.member.roles.add('662017803804475393')
                .then(() => {
                    msg.reply("you joined the Pokémon role !")
                })
            } break;

        case "minecraft":
            if(! await msg.member.roles.cache.find(val => val.id == '681557797661442063')) {
                return msg.member.roles.add('681557797661442063')
                .then(() => {
                    msg.reply("you joined the Minecraft role !")
                })
            } break;

        case "terraria":
            if(! await msg.member.roles.cache.find(val => val.id == '681557799725170718')) {
                return msg.member.roles.add('681557799725170718')
                .then(() => {
                    msg.reply("you joined the Terraria role !")
                })
            } break;

        default:
            return msg.reply("the game you entered doesn't exist yet")

    }
}

async function leave (msg:Discord.Message, game:string) {
    switch (game) {
        case "mariokart":
        case "mario kart":
            if(await msg.member.roles.cache.find(val => val.id == '614445539693559820')) {
                return msg.member.roles.remove('614445539693559820').then(() => {
                    msg.reply("you left the Mario Kart role !")
                })
            } break;

        case "smashbros":
        case "smash bros":
        case "smash":
            if(await msg.member.roles.cache.find(val => val.id == '614445571045982228')) {
                return msg.member.roles.remove('614445571045982228').then(() => {
                    msg.reply("you left the Smash Bros role !")
                })
            } break;

        case "splatoon":
        case "sploon":
            if(await msg.member.roles.cache.find(val => val.id == '614445571276668930')) {
                return msg.member.roles.remove('614445571276668930').then(() => {
                    msg.reply("you left the Splatoon role !")
                })
            } break;

        case "mariomaker":
        case "mario maker":
            if(await msg.member.roles.cache.find(val => val.id == '614445572199546880')) {
                return msg.member.roles.remove('614445572199546880').then(() => {
                    msg.reply("you left the Mario Maker role !")
                })
            } break;

        case "pokemon":
        case "pokémon":
            if(await msg.member.roles.cache.find(val => val.id == '662017803804475393')) {
                return msg.member.roles.remove('662017803804475393').then(() => {
                    msg.reply("you left the Pokémon role !")
                })
            } break;

        case "minecraft":
            if(await msg.member.roles.cache.find(val => val.id == '681557797661442063')) {
                return msg.member.roles.remove('681557797661442063').then(() => {
                    msg.reply("you left the Minecraft role !")
                })
            } break;

        case "terraria":
            if(await msg.member.roles.cache.find(val => val.id == '681557799725170718')) {
                return msg.member.roles.remove('681557799725170718').then(() => {
                    msg.reply("you left the Terraria role !")
                })
            } break;

        default:
            return msg.reply(":x: > The game you entered doesn't have a role on this server yet!")

    }
}


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