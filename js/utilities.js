const al = require('anilist-node');
const Anilist = new al();
let levels = require('../lib/levels.json');

module.exports = class utilities {

    static async ping (msg, author, bot) {

        var ping = Math.ceil(bot.ping)
        await msg.channel.send("pong ! `" + ping + "ms`")
            .then(console.log("[" + new Date().toLocaleTimeString() + "] Ping : " + author))
            .catch(console.error);

    }

    static async pong (msg, author, bot) {

        var ping = Math.ceil(bot.ping)
        await msg.channel.send("ping ! `" + ping + "ms`")
            .then(console.log("[" + new Date().toLocaleTimeString() + "] Ping : " + author))
            .catch(console.error);

    }

    static async info (msg, iwaUrl) {

        var embed = {
            "embed": {
                "title": "**Bot Infos**",
                "description": "Q-Bot is developed and handled by <@125325519054045184>\n\nLanguage : `JavaScript` using NodeJS\nAPI Access   : `discord.js` package on npm\n\nYou can access to the index of commands  by typing `?help`\n\nAll my work is done for free, but you can still support me [here](https://paypal.me/nokushi)",
                "color": 13002714,
                "footer": {
                  "text": "Created with ♥ by iwa | Copyright © iwa, v1.0.0"
                },
                "thumbnail": {
                  "url": iwaUrl
                }
            }
        }

        try {
            console.log("[" + new Date().toLocaleTimeString() + "] Info sent to " + msg.author.tag)
            await msg.author.send(embed)
        } catch(ex) {
            return msg.channel.send("**:x: > Please open your DMs**")
        }

    }

    static leaderboard (msg, cont, author, Discord, db, bot) {

        if(cont.length > 2)return;

        switch(cont[1]) {
            case "xp":
            case "exp":
                return xp(msg, Discord, db, bot)

            case "pat":
            case "pats":
            case "patpat":
            case "patpats":
                return pat(msg, Discord, db, bot)

            case "hug":
            case "hugs":
                return hug(msg, Discord, db, bot)

            case "boop":
            case "boops":
                return boop(msg, Discord, db, bot)

            case "slap":
            case "slaps":
                return slap(msg, Discord, db, bot)

            default:
                msg.channel.send({"embed": { "title": "`exp | pat | hug | boop | slap`", "color": 3396531}});
            break;
        }

    }

    static async role (msg, cont) {

        if(await msg.channel.type != "text")return;
        if(await msg.channel.id != "611349541685559316")return;

        if(cont.length < 3)return;

        var req = cont[1];
        cont.splice(0, 2);
        var game = cont.join(' ').toLowerCase();

        switch(req) {
            case "join":
                return join(msg, game);

            case "leave":
                return leave(msg, game);
        }

    }

    static async anime (msg, cont, Discord) {

        if(cont.length < 2)return;
        cont.shift();
        var req = cont.join(' ');

        Anilist.search('anime', req, 1, 1).then(async data => {
            var res = data.media[0];
            var info = await Anilist.media.anime(res.id)
            const embed = new Discord.RichEmbed();
            embed.setTitle("**" + info.title.romaji + " / " + info.title.english + "**")
            embed.setThumbnail(info.coverImage.large)
            embed.addField("Status", info.status, true)
            if(info.episodes != null)
                embed.addField("Episodes", info.episodes, true)
            embed.addField("Format", info.format, true)
            embed.addField("Duration per ep", info.duration + "min", true)
            embed.addField("Started on", info.startDate.month + "/" + info.startDate.day + "/" + info.startDate.year, true)
            if(info.endDate.day != null)
                embed.addField("Ended on", info.endDate.month + "/" + info.endDate.day + "/" + info.endDate.year, true)
            embed.addField("Genres", info.genres, false)
            var desc = await info.description.replace(/<br>/gm, '');
            if(desc.length >= 1024)
                desc = desc.substring(0, 1023)
            embed.addField("Description", desc, false)
            embed.setColor('BLUE')

            console.log(`info: anime request : ${req} by ${msg.author.tag}`)
            return msg.channel.send(embed)
        }).catch(err => {
            console.error(err)
            return msg.channel.send({'embed': { 'title': ":x: > **An error occured, please retry**" }})
        });

    }

    static async manga (msg, cont, Discord) {

        if(cont.length < 2)return;
        cont.shift();
        var req = cont.join(' ');

        Anilist.search('manga', req, 1, 1).then(async data => {
            var res = data.media[0];
            var info = await Anilist.media.manga(res.id)
            const embed = new Discord.RichEmbed();
            embed.setTitle("**" + info.title.romaji + " / " + info.title.english + "**")
            embed.setThumbnail(info.coverImage.large)
            embed.addField("Status", info.status, true)
            if(info.volumes != null)
                embed.addField("Volumes", info.volumes, true)
            embed.addField("Format", info.format, false)
            embed.addField("Started on", info.startDate.month + "/" + info.startDate.day + "/" + info.startDate.year, true)
            if(info.endDate.day != null)
                embed.addField("Ended on", info.endDate.month + "/" + info.endDate.day + "/" + info.endDate.year, true)
            embed.addField("Genres", info.genres, false)
            var desc = await info.description.replace(/<br>/gm, '');
            if(desc.length >= 1024)
                desc = desc.substring(0, 1023)
            embed.addField("Description", desc, false)
            embed.setColor('BLUE')

            console.log(`info: manga request : ${req} by ${msg.author.tag}`)
            return msg.channel.send(embed)
        }).catch(err => {
            console.error(err)
            return msg.channel.send({'embed': { 'title': ":x: > **An error occured, please retry**" }})
        });

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
                return {'level': i, 'current': (xp - levels[i].amount), 'max': (levels[i].amount - levels[i-1].amount)}
            }
        }
        return {'level': 20, 'current': xp, 'max': levels[20].amount}
    }

}

// Functions

async function join (msg, game) {
    switch (game) {
        case "mariokart":
        case "mario kart":
            if(! await msg.member.roles.find(val => val.id == '614445539693559820')) {
                return msg.member.addRole('614445539693559820').then(msg.reply("you joined Mario Kart role !"))
            } break;

        case "smashbros":
        case "smash bros":
        case "smash":
            if(! await msg.member.roles.find(val => val.id == '614445571045982228')) {
                return msg.member.addRole('614445571045982228').then(msg.reply("you joined Smash Bros role !"))
            } break;

        case "splatoon":
        case "sploon":
            if(! await msg.member.roles.find(val => val.id == '614445571276668930')) {
                return msg.member.addRole('614445571276668930').then(msg.reply("you joined Splatoon role !"))
            } break;

        case "mariomaker":
        case "mario maker":
            if(! await msg.member.roles.find(val => val.id == '614445572199546880')) {
                return msg.member.addRole('614445572199546880').then(msg.reply("you joined Mario Maker role !"))
            } break;

        case "pokemon":
        case "pokémon":
            if(! await msg.member.roles.find(val => val.id == '662017803804475393')) {
                return msg.member.addRole('662017803804475393').then(msg.reply("you joined Pokémon role !"))
            } break;

        default:
            return msg.reply("the game you entered doesn't exist yet")

    }
}

async function leave (msg, game) {
    switch (game) {
        case "mariokart":
        case "mario kart":
            if(await msg.member.roles.find(val => val.id == '614445539693559820')) {
                return msg.member.removeRole('614445539693559820').then(msg.reply("you leaved Mario Kart role !"))
            } break;

        case "smashbros":
        case "smash bros":
        case "smash":
            if(await msg.member.roles.find(val => val.id == '614445571045982228')) {
                return msg.member.removeRole('614445571045982228').then(msg.reply("you leaved Smash Bros role !"))
            } break;

        case "splatoon":
        case "sploon":
            if(await msg.member.roles.find(val => val.id == '614445571276668930')) {
                return msg.member.removeRole('614445571276668930').then(msg.reply("you leaved Splatoon role !"))
            } break;

        case "mariomaker":
        case "mario maker":
            if(await msg.member.roles.find(val => val.id == '614445572199546880')) {
                return msg.member.removeRole('614445572199546880').then(msg.reply("you leaved Mario Maker role !"))
            } break;

        case "pokemon":
        case "pokémon":
            if(await msg.member.roles.find(val => val.id == '662017803804475393')) {
                return msg.member.removeRole('662017803804475393').then(msg.reply("you leaved Pokémon role !"))
            } break;

        default:
            return msg.reply("the game you entered doesn't exist yet")

    }
}


async function xp (msg, Discord, db, bot) {

    let leaderboard = await db.get('user').orderBy('value', 'desc').take(10).value()
    var n = 0;

    msg.channel.startTyping()

    const embed = new Discord.RichEmbed();
    embed.setColor('GREY')
    embed.setTitle("**XP Leaderboard**")

    leaderboard.forEach(async elem => {
        let user = await bot.fetchUser(elem.id)
        n++;
        embed.addField(n + ". " + user.username, elem.exp + " xp's")
    })

    setTimeout(() => {
        msg.channel.send(embed).then(console.log(`info: xp leaderboard: ${msg.author.tag}`), msg.channel.stopTyping()).catch(console.error)
    }, 1500)
}

async function pat (msg, Discord, db, bot) {

    let leaderboard = await db.get('user').orderBy('pat', 'desc').take(10).value()
    var n = 0;

    msg.channel.startTyping()

    const embed = new Discord.RichEmbed();
    embed.setColor('GREY')
    embed.setTitle("**Pat Leaderboard**")

    leaderboard.forEach(async elem => {
        let user = await bot.fetchUser(elem.id)
        n++;
        embed.addField(n + ". " + user.username, elem.pat + " pats")
    })

    setTimeout(() => {
        msg.channel.send(embed).then(console.log(`info: pat leaderboard: ${msg.author.tag}`), msg.channel.stopTyping()).catch(console.error)
    }, 1500)
}

async function hug (msg, Discord, db, bot) {

    let leaderboard = await db.get('user').orderBy('hug', 'desc').take(10).value()
    var n = 0;

    msg.channel.startTyping()

    const embed = new Discord.RichEmbed();
    embed.setColor('GREY')
    embed.setTitle("**Hugs Leaderboard**")

    leaderboard.forEach(async elem => {
        let user = await bot.fetchUser(elem.id)
        n++;
        embed.addField(n + ". " + user.username, elem.hug + " hugs")
    })

    setTimeout(() => {
        msg.channel.send(embed).then(console.log(`info: hug leaderboard: ${msg.author.tag}`), msg.channel.stopTyping()).catch(console.error)
    }, 1500)
}

async function boop (msg, Discord, db, bot) {

    let leaderboard = await db.get('user').orderBy('boop', 'desc').take(10).value()
    var n = 0;

    msg.channel.startTyping()

    const embed = new Discord.RichEmbed();
    embed.setColor('GREY')
    embed.setTitle("**Boops Leaderboard**")

    leaderboard.forEach(async elem => {
        let user = await bot.fetchUser(elem.id)
        n++;
        embed.addField(n + ". " + user.username, elem.boop + " boops")
    })

    setTimeout(() => {
        msg.channel.send(embed).then(console.log(`info: boop leaderboard: ${msg.author.tag}`), msg.channel.stopTyping()).catch(console.error)
    }, 1500)
}

async function slap (msg, Discord, db, bot) {

    let leaderboard = await db.get('user').orderBy('slap', 'desc').take(10).value()
    var n = 0;

    msg.channel.startTyping()

    const embed = new Discord.RichEmbed();
    embed.setColor('GREY')
    embed.setTitle("**Slaps Leaderboard**")

    leaderboard.forEach(async elem => {
        let user = await bot.fetchUser(elem.id)
        n++;
        embed.addField(n + ". " + user.username, elem.boop + " slaps")
    })

    setTimeout(() => {
        msg.channel.send(embed).then(console.log(`info: slap leaderboard: ${msg.author.tag}`), msg.channel.stopTyping()).catch(console.error)
    }, 1500)
}