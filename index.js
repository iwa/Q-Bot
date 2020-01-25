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

const osuKey = config.osu_key

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
    var author_id = msg.author.id

    if(!cooldown[author_id]) {
        cooldown[author_id] = 1;
        setTimeout(async () => { delete cooldown[author_id] }, 2500)
    } else
        cooldown[author_id]++;

    if(cooldown[author_id] == 4)
        return await msg.reply({"embed": { "title": "**Please calm down, or I'll mute you.**", "color": 13632027 }})
    else if(cooldown[author_id] == 6) {
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

        var user = await db.get('user').find({ id: author_id }).value();

        if(!user)
            await db.get('user').push({ id: msg.author.id, exp: 1, pat: 0, hug: 0, boop: 0, slap: 0, birthday: null, fc: null }).write()
        else if(!cooldownXP[author_id]) {
            user = await db.get('user').find({ id: author_id }).update('exp', n => n + 1).write();
            levelCheck(msg, user.exp);
            cooldownXP[author_id] = 1;
            return setTimeout(async () => { delete cooldownXP[author_id] }, 5000)
        }
    }

    var plainCont = msg.content.replace(/\s\s+/g, ' ');
    var cont = plainCont.split(' ')
    var req = cont[0].substring(1).toLowerCase()

    if(req == "letmein")
        return letmein.action(msg, author_id, levels, db);

    if(isSleeping === 1 && admin.indexOf(author_id) == -1)return;

    // cmd Admin

    if(admin.indexOf(author_id) == 0) {
        let cmd = commands.admin[req];

        if(cmd) return eval(commands.admin[req]);
    }

    // cmd Mods

    if(isMod(msg) === true || admin.indexOf(author_id) > -1) {
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

            let guild = await bot.guilds.find(val => val.id == config.guildID)
            let channel = await guild.channels.find(val => val.id == config.birthdayTC)

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

    await page.screenshot({path: `image/${name}.jpg`, type: 'jpeg', quality: 100});

    await browser.close();

    try {
        return msg.reply('', {files: [`image/${name}.jpg`]})
    } catch(err) {
        console.error(err)
        return msg.reply(`You're now level ${level} ! Congrats !`)
    }

}

async function profileImg(msg, id) {

    var user = await db.get('user').find({ id: id }).value();

    if(!user)return msg.channel.send(":x: > **You aren't / The user you mentionned isn't registered into the database, you / they need to talk once in a channel to have your / their profile initialized**");

    msg.channel.startTyping();

    let userDiscord = await bot.fetchUser(id)
    let xp = user.exp;
    let birthday = user.birthday;
    let fc = user.fc;
    var level, remaining, need;

    var positionXP = await db.get('user').orderBy('exp', 'desc').findIndex(val => val.id == id).value()
    var positionHug = await db.get('user').orderBy('hug', 'desc').findIndex(val => val.id == id).value()
    var positionPat = await db.get('user').orderBy('pat', 'desc').findIndex(val => val.id == id).value()
    var positionBoop = await db.get('user').orderBy('boop', 'desc').findIndex(val => val.id == id).value()
    var positionSlap = await db.get('user').orderBy('slap', 'desc').findIndex(val => val.id == id).value()

    positionXP++; positionHug++; positionPat++; positionBoop++; positionSlap++;

    if(birthday == null)
        birthday = 'not registered yet';

    if(fc == null)
        fc = 'not registered yet';

    if(xp < 250) { level = 0; remaining = xp ; need = 250 }
    else if(xp >= 250 && xp < 500) { level = 1; remaining = xp - 250 ; need = 250 }
    else if(xp >= 500 && xp < 1000) { level = 2; remaining = xp - 500 ; need = 500 }
    else if(xp >= 1000 && xp < 2000) { level = 3; remaining = xp - 1000 ; need = 1000 }
    else if(xp >= 2000 && xp < 3500) { level = 4; remaining = xp - 2000 ; need = 1500 }
    else if(xp >= 3500 && xp < 5000) { level = 5; remaining = xp - 3500 ; need = 1500 }
    else if(xp >= 5000 && xp < 7000) { level = 6; remaining = xp - 5000 ; need = 2000 }
    else if(xp >= 7000 && xp < 9000) { level = 7; remaining = xp - 7000 ; need = 2000 }
    else if(xp >= 9000 && xp < 12140) { level = 8; remaining = xp - 9000 ; need = 3140 }
    else if(xp >= 12140 && xp < 16000) { level = 9; remaining = xp - 12140 ; need = 3860 }
    else if(xp >= 16000 && xp < 20000) { level = 10; remaining = xp - 16000 ; need = 4000 }
    else if(xp >= 20000 && xp < 25000) { level = 11; remaining = xp - 20000 ; need = 5000 }
    else if(xp >= 25000 && xp < 30000) { level = 12; remaining = xp - 25000 ; need = 5000 }
    else if(xp >= 30000 && xp < 35000) { level = 13; remaining = xp - 30000 ; need = 5000 }
    else if(xp >= 35000 && xp < 40000) { level = 14; remaining = xp - 35000 ; need = 5000 }
    else if(xp >= 40000 && xp < 50000) { level = 15; remaining = xp - 40000 ; need = 10000 }
    else if(xp >= 50000 && xp < 60000) { level = 16; remaining = xp - 50000 ; need = 10000 }
    else if(xp >= 60000 && xp < 70000) { level = 17; remaining = xp - 60000 ; need = 10000 }
    else if(xp >= 70000 && xp < 85000) { level = 18; remaining = xp - 70000 ; need = 15000 }
    else if(xp >= 85000 && xp < 100000) { level = 19; remaining = xp - 85000 ; need = 15000 }
    else if(xp >= 100000) { level = 20; remaining = xp ; need = 100000 }

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
    var contentProfile = eval(htmlContent);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({width: 508, height: 428, deviceScaleFactor: 2})
    await page.setContent(contentProfile, {waitUntil: 'networkidle0'});

    await page.screenshot({path: `image/prof${msg.author.tag}.jpg`, type: 'jpeg', quality: 100});

    await browser.close();

    try {
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
            return msg.channel.send('', {files: [`image/sonic${msg.author.tag}.jpg`]}).then(msg.channel.stopTyping(true));
        } catch(err) {
            console.error(err)
        }
    }
}