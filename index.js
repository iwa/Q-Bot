const Discord = require('discord.js')
const bot = new Discord.Client()
bot.commands = new Discord.Collection();

require('dotenv').config()
const fs = require('fs');
const ejs = require('ejs')

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('lib/db.json');
const db = low(adapter);

db.defaults({ user: [] }).write();

const letmein = require('./js/letmein')
const img = require('./js/img')

fs.readdir('./commands/', (error, f) => {
    if (error) return console.error(error);
    let commandes = f.filter(f => f.split('.').pop() === 'js');
    if (commandes.length <= 0) return console.log('warn: no commands found');
    commandes.forEach((f) => {
        let commande = require(`./commands/${f}`);
        bot.commands.set(commande.help.name, commande);
    });
});

let levels = require('./lib/levels.json');

const { YouTube } = require('better-youtube-api')
const yt = new YouTube(process.env.YT_TOKEN)

let prefix = "?";
var isSleeping = 0;
var cooldown = [], cooldownXP = [];


process.on('uncaughtException', exception => {
    console.error(exception);
});

bot.on('warn', console.warn)

bot.on('error', console.error)

bot.on('disconnect', () => console.log("warn: bot disconnected"))

bot.on('reconnecting', async () => {
    await bot.user.setActivity("Qumu's Remixes | ?help", {type : 2}).catch(console.error);
    await bot.user.setStatus("online").catch(console.error)
    console.log("info: bot reconnecting...")
});

bot.on('ready', async () => {
    await bot.user.setActivity("Qumu's Remixes | ?help", {type : 2}).catch(console.error);
    await bot.user.setStatus("online").catch(console.error)
    console.log(`info: logged in as ${bot.user.username}`);
});


// Message Event

bot.on('message', async msg => {

    if(msg.author.bot)return;
    if(msg.channel.type != "text")return;

    if(!cooldown[msg.author.id]) {
        cooldown[msg.author.id] = 1;
        setTimeout(async () => { delete cooldown[msg.author.id] }, 2500)
    } else
        cooldown[msg.author.id]++;

    if(cooldown[msg.author.id] == 4)
        return await msg.reply({"embed": { "title": "**Please calm down, or I'll mute you.**", "color": 13632027 }})
    else if(cooldown[msg.author.id] == 6) {
        await msg.member.addRole('636254696880734238')
        var msgReply = await msg.reply({"embed": { "title": "**You've been mute for 20 minutes. Reason : spamming.**", "color": 13632027 }})
        setTimeout(async () => {
            await msgReply.delete()
            return msg.member.removeRole('636254696880734238')
        }, 1200000);
    }

    if(!msg.content.startsWith(prefix)) {

        if(msg.channel.id == '608630294261530624')return;
        if(msg.channel.id == process.env.SUGGESTIONTC) {
            await msg.react('✅');
            return await msg.react('❌');
        }

        var user = await db.get('user').find({ id: msg.author.id }).value();

        if(!user)
            await db.get('user').push({ id: msg.author.id, exp: 1, pat: 0, hug: 0, boop: 0, slap: 0, birthday: null, fc: null }).write()
        else if(!cooldownXP[msg.author.id]) {
            user = await db.get('user').find({ id: msg.author.id }).update('exp', n => n + 1).write();
            levelCheck(msg, user.exp);
            cooldownXP[msg.author.id] = 1;
            return setTimeout(async () => { delete cooldownXP[msg.author.id] }, 5000)
        }
    }

    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let req = args.shift();
    let cmd = client.commands.get(req);

    if(req == "letmein")
        return letmein.action(msg, levels, db);

    if(isSleeping === 1 && msg.author.id != process.env.IWA)return;

    // cmd Admin

    if(msg.author.id == process.env.IWA) {
        let cmd = commands.admin[req];
        if(cmd) return eval(commands.admin[req]);
    }

    // cmd Mods

    if(isMod(msg) === true || msg.author.id == process.env.IWA || msg.author.id != process.env.QUMU) {
        let cmd = commands.staff[req];
        if(cmd) return eval(commands.staff[req]);
    }

    // cmd Member

    let cmd = commands.member[req];
    if(!cmd) return;
    else return eval(commands.member[req]);
});


// Reactions Event

bot.on('messageReactionAdd', async reaction => {
    if(reaction.message.guild.id !== process.env.GUILDID)return;
    if(reaction.emoji.name !== '⭐')return;
    if(reaction.users.find(val => val.id == bot.user.id))return;
    if(reaction.count >= 6) {
        var msg = reaction.message;
        var channel = bot.channels.find(val => val.id == process.env.STARBOARDTC);

        await msg.react(reaction.emoji.name);
        await channel.send({
            "embed": {
              "description": `\`\`\`${msg.content}\`\`\`[message link✉️](${msg.url})`,
              "color": 14212956,
              "timestamp": msg.createdTimestamp,
              "footer": {
                "text": "New starboard entry ⭐️"
              },
              "author": {
                "name": msg.author.username,
                "icon_url": msg.author.avatarURL
              }
            }
          });
        return console.log(`info: new message into starboard (author: ${msg.author.tag})`);
    }
});


// Subs count, refresh every hour

setInterval(async () => {

    let channel = bot.channels.find(val => val.id == process.env.SUBCOUNT)
    let title = channel.name

    let newCount = title.replace(/\D/gim, '')

    await yt.getChannel('UC0QbcOX2gI5zruEvpSmnf6Q')
        .then(data => {
            if(newCount == data.subCount)return;
            let subs = data.subCount.toLocaleString()
            channel.edit({ name: `📊 ${subs} subs`})
        })

}, 3600000);


// Check if a member no longer booster have the color

setInterval(async () => {
    var members = bot.guilds.find(val => val.id == process.env.GUILDID)

    members.forEach(async elem => {
        if(await elem.roles.find(val => val.id == process.env.BOOSTCOLOR) && await elem.roles.find(val => val.id != process.env.BOOSTROLE)) {
            await elem.removeRole(process.env.BOOSTCOLOR);
        }
    });
}, 60000);

// Check if it's someone's birthday, and send a HBP message at 7am UTC

setInterval(async () => {
    var today = new Date();
    var hh = today.getUTCHours()

    if(hh == 7) {

        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        today = mm + '/' + dd;

        var data = await db.get('user').filter({ birthday: today }).value();

        if(data.length >= 1) {

            let channel = bot.channels.find(val => val.id == process.env.BIRTHDAYTC)

            data.forEach(async user => {
                var userInfo = await bot.fetchUser(user.id)
                const embed = new Discord.RichEmbed();
                embed.setTitle(`**Happy Birthday, ${userInfo.username} ! 🎉🎉**`)
                embed.setFooter(`Born on : ${today}`)
                embed.setColor('#FFFF72')
                embed.setThumbnail(userInfo.avatarURL)
                channel.send(`<@${user.id}>`)
                channel.send(embed)
            });
        }
    }
}, 3600000);


// Login

bot.login(process.env.TOKEN)

// Functions

function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max) + 1);
}

function isMod(msg) {
    if(msg.member.roles.find(val => val.id == config.modRole) > -1) { return true }
    else { return false }
}

async function levelCheck(msg, xp) {
    for(var i = 1; i <= 20; i++) {
        if(xp == levels[i].amount) {
            if(i != 1)
                await msg.member.removeRole(levels[i-1].id).catch(console.error);
            await msg.member.addRole(levels[i].id).catch(console.error);
            return imageLvl(msg, i);
        }
    }
}

async function imageLvl(msg, level) {
    var avatarURL = await msg.author.avatarURL

    var html = await ejs.renderFile('views/level.ejs', { avatarURL });
    var file = await img.generator(808, 208, html, msg.author.tag, 'lvl')

    try {
        return msg.reply('', {files: [file]})
    } catch(err) {
        console.error(err)
        return msg.reply(`You're now level ${level} ! Congrats !`)
    }
}

async function levelInfo(xp) {
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

async function profileImg(msg, id) {

    var user = await db.get('user').find({ id: id }).value();

    if(!user)return msg.channel.send(":x: > **You aren't registered into the database, you need to talk once in a channel to have your profile initialized**");

    msg.channel.startTyping();

    let userDiscord = await bot.fetchUser(id)
    var positionXP = await db.get('user').orderBy('exp', 'desc').findIndex(val => val.id == id).value()
    var positionHug = await db.get('user').orderBy('hug', 'desc').findIndex(val => val.id == id).value()
    var positionPat = await db.get('user').orderBy('pat', 'desc').findIndex(val => val.id == id).value()
    var positionBoop = await db.get('user').orderBy('boop', 'desc').findIndex(val => val.id == id).value()
    var positionSlap = await db.get('user').orderBy('slap', 'desc').findIndex(val => val.id == id).value()

    if(user.birthday == null)
        user.birthday = 'not registered yet';

    if(user.fc == null)
        user.fc = 'not registered yet';

    var lvlInfo = await levelInfo(user.exp);

    var colors = [
        ['#8BC6EC', '#9599E2'],
        ['#B2F9B6', '#56E3BC'],
        ['#FFFFD5', '#86DFBC'],
        ['#FFE5E5', '#C8BDFF'],
        ['#FF7171', '#8A1C5F'],
        ['#FFFAB0', '#E6B99F'],
        ['#6D98FF', '#EE69D9']
    ]

    var whichColor = (randomInt(7) - 1)
    while(lastComboColor == whichColor)
        whichColor = (randomInt(7) - 1)
    lastComboColor = whichColor

    var htmlContent = fs.readFileSync('./views/profile', 'utf-8');
    var contentProfile = await eval(htmlContent);
    var file = await img.generator(508, 428, contentProfile, msg.author.tag, 'prof')

    try {
        console.log(`info: profile by ${msg.author.tag}`)
        return await msg.channel.send('', {files: [file]}).then(msg.channel.stopTyping(true));
    } catch(err) {
        console.error(err)
        return msg.channel.send("An error occured, please contact <@125325519054045184>")
    }
}

async function sonicSays(msg, cont) {
    if(cont.length !== 1) {
        msg.channel.startTyping();
        var parole = cont;
        parole.shift()
        var x = parole.join(' ')

        var htmlContent = fs.readFileSync('./views/sonicsays', 'utf-8');
        var contentSS = eval(htmlContent);
        var file = await img.generator(385, 209, contentSS, msg.author.tag, 'sonic')

        try {
            console.log(`info: sonicsays by ${msg.author.tag}`)
            return msg.channel.send('', {files: [file]}).then(msg.channel.stopTyping(true));
        } catch(err) {
            console.error(err)
        }
    }
}