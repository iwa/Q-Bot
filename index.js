const Discord = require('discord.js')
const bot = new Discord.Client()

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('lib/db.json');
const db = low(adapter);

db.defaults({ user: []}).write();

const help = require('./js/help')
const staff = require('./js/staff')
const profile = require('./js/profile')
const actions = require('./js/actions')
const games = require('./js/games')
const memes = require('./js/memes')
const music = require('./js/music')
const utilities = require('./js/utilities')
const letmein = require('./js/letmein')

const fs = require('fs');
const puppeteer = require('puppeteer');

let config = require('./config.json');
let commands = require('./lib/dictionary.json');
let levels = require('./lib/levels.json');

const { YouTube } = require('better-youtube-api')
const yt = new YouTube(config.yt_token)

let prefix = "?";
let admin = ['125325519054045184', '214740144538910721'];
var isSleeping = 0, lastComboColor;
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

    var author = msg.author.tag

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
        if(msg.channel.id == config.suggestionTC) {
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

    var plainCont = msg.content.replace(/\s\s+/g, ' ');
    var cont = plainCont.split(' ')
    var req = cont[0].substring(1).toLowerCase()

    if(req == "letmein")
        return letmein.action(msg, msg.author.id, levelInfo, levels, db);

    if(isSleeping === 1 && admin.indexOf(msg.author.id) == -1)return;

    // cmd Admin

    if(admin.indexOf(msg.author.id) == 0) {
        let cmd = commands.admin[req];
        if(cmd) return eval(commands.admin[req]);
    }

    // cmd Mods

    if(isMod(msg) === true || admin.indexOf(msg.author.id) > -1) {
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
    if(reaction.message.guild.id !== config.guildID)return;
    if(reaction.emoji.name !== '⭐')return;
    if(reaction.users.find(val => val.id == bot.user.id))return;
    if(reaction.count >= 6) {
        var msg = reaction.message;
        var channel = bot.channels.find(val => val.id == config.starboardTC);

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

    let channel = bot.channels.find(val => val.id == config.subCount)
    let title = channel.name

    let newCount = title.replace(/\D/gim, '')

    await yt.getChannel('UC0QbcOX2gI5zruEvpSmnf6Q')
        .then(data => {
            if(newCount == data.subCount)return;
            let subs = data.subCount.toLocaleString()
            channel.edit({ name: `📊 ${subs} subs`})
        })

}, 3600000);


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

            let channel = bot.channels.find(val => val.id == config.birthdayTC)

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

if(config.testMode === 1) bot.login(config.test_token)
else bot.login(config.discord_token)


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

    var htmlContent = fs.readFileSync('./views/level', 'utf-8');
    var contentLvl = eval(htmlContent);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({width: 808, height: 208, deviceScaleFactor: 2})
    await page.setContent(contentLvl, {waitUntil: 'networkidle0'});
    await page.screenshot({path: `image/${msg.author.tag}.jpg`, type: 'jpeg', quality: 100});
    await browser.close();

    try {
        return msg.reply('', {files: [`image/${msg.author.tag}.jpg`]})
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

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({width: 508, height: 428, deviceScaleFactor: 2})
    await page.setContent(contentProfile, {waitUntil: 'networkidle0'});
    await page.screenshot({path: `image/prof${msg.author.tag}.jpg`, type: 'jpeg', quality: 100});
    await browser.close();

    try {
        console.log(`info: profile by ${msg.author.tag}`)
        return await msg.channel.send('', {files: [`image/prof${msg.author.tag}.jpg`]}).then(msg.channel.stopTyping(true));
    } catch(err) {
        console.error(err)
        return msg.channel.send("An error occured, please contact <@125325519054045184>")
    }
}

async function sonicSays(msg, cont) {

    if(cont.length !== 1) {
        msg.channel.startTyping();

        var parole = cont;
        if(msg.channel.type !== "dm") {
            msg.delete().catch(console.error);
        }
        parole.shift()
        var x = parole.join(' ')

        var htmlContent = fs.readFileSync('./views/sonicsays', 'utf-8');
        var contentSS = eval(htmlContent);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setViewport({width: 385, height: 209, deviceScaleFactor: 2})
        await page.setContent(contentSS, {waitUntil: 'networkidle0'});
        await page.screenshot({path: `image/sonic${msg.author.tag}.jpg`, type: 'jpeg', quality: 100});
        await browser.close();

        try {
            console.log(`info: sonicsays by ${msg.author.tag}`)
            return msg.channel.send('', {files: [`image/sonic${msg.author.tag}.jpg`]}).then(msg.channel.stopTyping(true));
        } catch(err) {
            console.error(err)
        }
    }
}