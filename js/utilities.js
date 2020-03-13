const Discord = require('discord.js')
let levels = require('../lib/levels.json')

module.exports = class utilities {

    static async info (msg, iwaUrl) {

        var embed = {
            "embed": {
                "title": "**Bot Infos**",
                "description": "Q-Bot is developed and handled by <@125325519054045184>\n\nLanguage : `JavaScript` using NodeJS\nAPI Access : `discord.js` package on npm\n\nYou can access to the index of commands by typing `?help`\n\nAll my work is done for free, but you can still support me [here](https://paypal.me/nokushi)",
                "color": 13002714,
                "footer": {
                  "text": "Created with ♥ by iwa | Copyright © iwa, v1.0.6"
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
            return msg.channel.send("**:x: > Please open your DMs**")
        }

    }

    static leaderboard (bot, msg, args, db) {
        if(args.length > 1)return;

        switch(args[0]) {
            case "xp":
            case "exp":
                return leaderboard(bot, msg, db, Discord, 'exp')

            case "pat":
            case "pats":
            case "patpat":
            case "patpats":
                return leaderboard(bot, msg, db, Discord, 'pat')

            case "hug":
            case "hugs":
                return leaderboard(bot, msg, db, Discord, 'hug')

            case "boop":
            case "boops":
                return leaderboard(bot, msg, db, Discord, 'boop')

            case "slap":
            case "slaps":
                return leaderboard(bot, msg, db, Discord, 'slap')

            default:
                msg.channel.send({"embed": { "title": "`exp | pat | hug | boop | slap`", "color": 3396531}});
            break;
        }
    }

    static async role (msg, args) {
        if(await msg.channel.type != "text")return;
        if(await msg.channel.id != "611349541685559316")return;

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


    static randomInt(max) {
        return Math.floor(Math.random() * Math.floor(max) + 1);
    }

    static async levelInfo(xp) {
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

    static isMod(msg) {
        if(msg.member.roles.cache.find(val => val.id == process.env.MODROLE)) { return true }
        else { return false }
    }

}

// Functions

async function join (msg, game) {
    switch (game) {
        case "mariokart":
        case "mario kart":
            if(! await msg.member.roles.cache.find(val => val.id == '614445539693559820')) {
                return msg.member.roles.add('614445539693559820').then(msg.reply("you joined Mario Kart role !"))
            } break;

        case "smashbros":
        case "smash bros":
        case "smash":
            if(! await msg.member.roles.cache.find(val => val.id == '614445571045982228')) {
                return msg.member.roles.add('614445571045982228').then(msg.reply("you joined Smash Bros role !"))
            } break;

        case "splatoon":
        case "sploon":
            if(! await msg.member.roles.cache.find(val => val.id == '614445571276668930')) {
                return msg.member.roles.add('614445571276668930').then(msg.reply("you joined Splatoon role !"))
            } break;

        case "mariomaker":
        case "mario maker":
            if(! await msg.member.roles.cache.find(val => val.id == '614445572199546880')) {
                return msg.member.roles.add('614445572199546880').then(msg.reply("you joined Mario Maker role !"))
            } break;

        case "pokemon":
        case "pokémon":
            if(! await msg.member.roles.cache.find(val => val.id == '662017803804475393')) {
                return msg.member.roles.add('662017803804475393').then(msg.reply("you joined Pokémon role !"))
            } break;

        case "minecraft":
            if(! await msg.member.roles.cache.find(val => val.id == '681557797661442063')) {
                return msg.member.roles.add('681557797661442063').then(msg.reply("you joined Minecraft role !"))
            } break;

        case "terraria":
            if(! await msg.member.roles.cache.find(val => val.id == '681557799725170718')) {
                return msg.member.roles.add('681557799725170718').then(msg.reply("you joined Terraria role !"))
            } break;

        default:
            return msg.reply("the game you entered doesn't exist yet")

    }
}

async function leave (msg, game) {
    switch (game) {
        case "mariokart":
        case "mario kart":
            if(await msg.member.roles.cache.find(val => val.id == '614445539693559820')) {
                return msg.member.roles.remove('614445539693559820').then(msg.reply("you leaved Mario Kart role !"))
            } break;

        case "smashbros":
        case "smash bros":
        case "smash":
            if(await msg.member.roles.cache.find(val => val.id == '614445571045982228')) {
                return msg.member.roles.remove('614445571045982228').then(msg.reply("you leaved Smash Bros role !"))
            } break;

        case "splatoon":
        case "sploon":
            if(await msg.member.roles.cache.find(val => val.id == '614445571276668930')) {
                return msg.member.roles.remove('614445571276668930').then(msg.reply("you leaved Splatoon role !"))
            } break;

        case "mariomaker":
        case "mario maker":
            if(await msg.member.roles.cache.find(val => val.id == '614445572199546880')) {
                return msg.member.roles.remove('614445572199546880').then(msg.reply("you leaved Mario Maker role !"))
            } break;

        case "pokemon":
        case "pokémon":
            if(await msg.member.roles.cache.find(val => val.id == '662017803804475393')) {
                return msg.member.roles.remove('662017803804475393').then(msg.reply("you leaved Pokémon role !"))
            } break;

        case "minecraft":
            if(await msg.member.roles.cache.find(val => val.id == '681557797661442063')) {
                return msg.member.roles.remove('681557797661442063').then(msg.reply("you leaved Minecraft role !"))
            } break;

        case "terraria":
            if(await msg.member.roles.cache.find(val => val.id == '681557799725170718')) {
                return msg.member.roles.remove('681557799725170718').then(msg.reply("you leaved Terraria role !"))
            } break;

        default:
            return msg.reply("the game you entered doesn't exist yet")

    }
}


async function leaderboard (bot, msg, db, Discord, type) {
    let leaderboard = await db.get('user').filter({hidden: false}).orderBy(type, 'desc').take(10).value()
    var n = 0;

    msg.channel.startTyping()
    var title = `${type.charAt(0).toUpperCase()}${type.slice(1)}`

    const embed = new Discord.MessageEmbed();
    embed.setColor(16114507)
    embed.setTitle(`:trophy: **${title} Leaderboard**`)

    leaderboard.forEach(async elem => {
        let user = await bot.users.fetch(elem.id)
        n++;
        embed.addField(`**${n}. ${user.username}**`, `${elem[type]} ${type}s`)
    })

    setTimeout(() => {
        msg.channel.send(embed).then(console.log(`info: ${type} leaderboard: ${msg.author.tag}`), msg.channel.stopTyping()).catch(console.error)
    }, 1500)
}