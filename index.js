const Discord = require('discord.js')
const bot = new Discord.Client()

const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/';
const dbName = 'Q-Bot';

const help = require('./js/help')
const staff = require('./js/staff')
const wholesome = require('./js/wholesome')
const music = require('./js/music')

const fs = require('fs')
const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
const Crypto = require('crypto-js');

let config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'))

const { YouTube } = require('better-youtube-api')
const yt = new YouTube(config.yt_token)

const osuKey = config.osu_key

let prefix = "?";
let admin = ['125325519054045184', '214740144538910721'];
var isSleeping = 0;
var cooldown = [];
let connOptions = {
    'useUnifiedTopology': true,
    'authSource': "admin"/*,
    'auth': {
        'user': "qbot",
        'password': config.mongoPwd
    }*/
};
let levels = {
    1 : '611979452414427138',
    2 : '611979473352392714',
    3 : '611979471964340264',
    4 : '611979474208292874',
    5 : '611979472803069977',
    6 : '636990776856936478',
    7 : '636990836705329152',
    8 : '636990839205396484',
    9 : '636990867856687104',
    10 : '636990871388160011',
    11 : '636990874554728469',
    12 : '636990877411049483',
    13 : '636990848688586772',
    14 : '636990858394206212',
    15 : '636990861472694283',
    16 : '636990864211836943',
    17 : '636990851704160266',
    18 : '636990854602555424',
    19 : '636990845941317652',
    20 : '636990842564771841'
};


process.on('uncaughtException', exception => {
    console.error(exception);
});

bot.on('warn', console.warn)

bot.on('error', console.error)

bot.on('disconnect', () => console.log("[" + new Date().toLocaleTimeString() + "] _Something went bad, I'm disconnected now, try to reconnect..."))

bot.on('reconnecting', () => {
    bot.user.setActivity("Qumu's Remixes | ?help", {type : 2}).catch(console.error);
    bot.user.setStatus("online").catch(console.error)
    console.log("[" + new Date().toLocaleTimeString() + "] _Reconnecting....")
});

bot.on('ready', () => {
    bot.user.setActivity("Qumu's Remixes | ?help", {type : 2}).catch(console.error);
    bot.user.setStatus("online").catch(console.error)
    console.log(`[` + new Date().toLocaleTimeString() + `] _Logged in as ${bot.user.username}...`);
});


bot.on('message', async msg => {

    if(msg.author.bot)return;

    var cont = msg.content.split(' ')
    var req = cont[0].substring(1).toLowerCase()
    var author = msg.author.tag
    var author_id = msg.author.id

    if(msg.channel.type != "text")return;

    if(req == "letmein")return letmein.action(msg);
    if(!msg.content.startsWith(prefix)) {

        if(msg.channel.id == '608630294261530624')return;
        if(msg.channel.id == config.suggestionTC) {
            await msg.react('✅');
            return await msg.react('❌');
        }

        var mongod = await mongo.connect(url, connOptions);
        var db = mongod.db(dbName);

        var user = await db.collection('user').findOne({ '_id': { $eq: author_id } });

        if(!user)
            await db.collection('user').insertOne({ _id: author_id, exp: 1, pat: 0, hug: 0, boop: 0, slap: 0, birthday: null, fc: null });
        else if(!cooldown[author_id]){
            await db.collection('user').updateOne({ _id: author_id }, { $inc: { exp: 1 }});
            levelCheck(msg, user.exp);
            cooldown[author_id] = 1;
            return setTimeout(async () => { delete cooldown[author_id] }, 5000)
        } else
            cooldown[author_id]++;

        mongod.close();

        if(cooldown[author_id] == 3)
            return await msg.reply({"embed": { "title": "**Please calm down, or I'll mute you.**", "color": 13632027 }})
        else if(cooldown[author_id] == 6) {
            await mention.addRole('636254696880734238')
            var msgReply = await msg.reply({"embed": { "title": "**You've been mute for 20 minutes. Reason : spamming.**", "color": 13632027 }})
            setTimeout(async () => {
                await msgReply.delete()
                return mention.removeRole('636254696880734238')
            }, 1200000);
        }

        return;
    }

    if(isSleeping === 1 && admin.indexOf(author_id) == -1)return;

    // cmd Admin

    if(admin.indexOf(author_id) > -1) {
        switch (req) {

            case "sleep":
                if(isSleeping == 0) {
                    isSleeping = 1;
                    bot.user.setStatus("dnd")
                    bot.user.setActivity("being updated...", {type : 0})
                        .then(msg.react("✅") , console.log("[" + new Date().toLocaleTimeString() + "] Sleeping enabled"))
                        .catch(console.error);
                    return msg.channel.send("Sleeping Mode On !")
                } else {
                    isSleeping = 0;
                    bot.user.setStatus("online")
                    bot.user.setActivity("Qumu's Remixes | ?help", {type : 2})
                        .then(msg.react("✅") , console.log("[" + new Date().toLocaleTimeString() + "] Sleeping disabled"))
                        .catch(console.error);
                    return msg.channel.send("Sleeping Mode Off !")
                };

        }
    }

    // cmd Mods

    if(isMod(msg) === true || admin.indexOf(author_id) > -1) {
        switch (req) {

            case "bulk" :
                return staff.bulk(msg, cont, author);

            case "forceskip":
                return music.forceskip(msg, bot, Discord);

            case "mute":
                return staff.mute(msg, cont, author_id, admin, config.modRole, Discord, bot);

        }
    }

    // cmd Basic

    switch (req) {

        // Profile

        case "profile":
            if(cont.length > 2)return;

            if(cont.length == 2) {

                if(msg.mentions.everyone)return;

                var mention = msg.mentions.users.first()

                if(!mention)return;

                if(mention.id == msg.author.id || mention.id == bot.user.id)return;

                return profile(msg, mention.id);

            } else
                return profile(msg, author_id);

        // Wholesome

        case "pat":
            var mongod = await mongo.connect(url, connOptions);
            var db = mongod.db(dbName);
        return wholesome.pat(msg, cont, randomInt, author, author_id, mongod, db, Discord);

        case "hug":
            var mongod = await mongo.connect(url, connOptions);
            var db = mongod.db(dbName);
        return wholesome.hug(msg, cont, randomInt, author, author_id, mongod, db, Discord);

        case "boop":
            var mongod = await mongo.connect(url, connOptions);
            var db = mongod.db(dbName);
        return wholesome.boop(msg, cont, randomInt, author, author_id, mongod, db, Discord);

        // Memes

        case "sonicsays":
            if(msg.channel.id != '606165780215889960' && author_id != master)return;
        return sonicSays(msg, cont);

        // Music

        case "play":
            return music.play(msg, yt, cont, author_id);

        case "remove":
            return music.remove(msg, cont);

        case "queue":
        case "q":
            return music.list(msg, cont);

        case "skip":
            return music.skip(msg, bot);

        case "clear":
            return music.clear(msg);

        case "stop":
        case "quit":
        case "leave":
            return music.stop(msg);

        case "loop":
        case "repeat":
            return music.loop(msg);

        case "playing":
        case "np":
        case "nowplaying":
            return music.np(msg, bot);

        // Utilities

        case "help":
        case "commands":
            return help.action(msg, cont, author, isMod, admin);

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
            channel.edit({ name: '📊 ' + subs + ' subs'})
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

        var mongod = await mongo.connect(url, connOptions);
        var db = mongod.db(dbName);

        var data = await db.collection('user').findMany({ 'birthday': { $eq: today } }).toArray();

        mongod.close();

        if(data.length >= 1) {

            let guild = await bot.guilds.find(val => val.id == config.guildID)
            let channel = await guild.channels.find(val => val.id == config.birthdayTC)

            data.forEach(async user => {
                var userInfo = await bot.fetchUser(user.id)
                const embed = new Discord.RichEmbed();
                embed.setTitle("**Happy Birthday, " + userInfo.username + " ! 🎉🎉**")
                embed.setFooter("Born on : " + today)
                embed.setColor('#FFFF72')
                channel.send("<@" + user.id + ">,")
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
    switch(xp) {
        case 250:
            await msg.member.addRole(levels[1]).catch(console.error);
            return imageLvl(msg, 1);

        case 500:
            await msg.member.removeRole(levels[1]).catch(console.error);
            await msg.member.addRole(levels[2]).catch(console.error);
            return imageLvl(msg, 2);

        case 1000:
            await msg.member.removeRole(levels[2]).catch(console.error);
            await msg.member.addRole(levels[3]).catch(console.error);
            return imageLvl(msg, 3);

        case 2000:
            await msg.member.removeRole(levels[3]).catch(console.error);
            await msg.member.addRole(levels[4]).catch(console.error);
            return imageLvl(msg, 4);

        case 3500:
            await msg.member.removeRole(levels[4]).catch(console.error);
            await msg.member.addRole(levels[5]).catch(console.error);
            return imageLvl(msg, 5);

        case 5000:
            await msg.member.removeRole(levels[5]).catch(console.error);
            await msg.member.addRole(levels[6]).catch(console.error);
            return imageLvl(msg, 6);

        case 7000:
            await msg.member.removeRole(levels[6]).catch(console.error);
            await msg.member.addRole(levels[7]).catch(console.error);
            return imageLvl(msg, 7);

        case 9000:
            await msg.member.removeRole(levels[7]).catch(console.error);
            await msg.member.addRole(levels[8]).catch(console.error);
            return imageLvl(msg, 8);

        case 12140:
            await msg.member.removeRole(levels[8]).catch(console.error);
            await msg.member.addRole(levels[9]).catch(console.error);
            return imageLvl(msg, 9);

        case 16000:
            await msg.member.removeRole(levels[9]).catch(console.error);
            await msg.member.addRole(levels[10]).catch(console.error);
            return imageLvl(msg, 10);

        case 20000:
            await msg.member.removeRole(levels[10]).catch(console.error);
            await msg.member.addRole(levels[11]).catch(console.error);
            return imageLvl(msg, 11);

        case 25000:
            await msg.member.removeRole(levels[11]).catch(console.error);
            await msg.member.addRole(levels[12]).catch(console.error);
            return imageLvl(msg, 12);

        case 30000:
            await msg.member.removeRole(levels[12]).catch(console.error);
            await msg.member.addRole(levels[13]).catch(console.error);
            return imageLvl(msg, 13);

        case 35000:
            await msg.member.removeRole(levels[13]).catch(console.error);
            await msg.member.addRole(levels[14]).catch(console.error);
            return imageLvl(msg, 14);

        case 40000:
            await msg.member.removeRole(levels[14]).catch(console.error);
            await msg.member.addRole(levels[15]).catch(console.error);
            return imageLvl(msg, 15);

        case 50000:
            await msg.member.removeRole(levels[15]).catch(console.error);
            await msg.member.addRole(levels[16]).catch(console.error);
            return imageLvl(msg, 16);

        case 60000:
            await msg.member.removeRole(levels[16]).catch(console.error);
            await msg.member.addRole(levels[17]).catch(console.error);
            return imageLvl(msg, 17);

        case 70000:
            await msg.member.removeRole(levels[17]).catch(console.error);
            await msg.member.addRole(levels[18]).catch(console.error);
            return imageLvl(msg, 18);

        case 85000:
            await msg.member.removeRole(levels[18]).catch(console.error);
            await msg.member.addRole(levels[19]).catch(console.error);
            return imageLvl(msg, 19);

        case 100000:
            await msg.member.removeRole(levels[19]).catch(console.error);
            await msg.member.addRole(levels[20]).catch(console.error);
            return imageLvl(msg, 20);

    }
}

async function imageLvl(msg, level) {

    var avatarURL = await msg.author.avatarURL

    var contentLvl = `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <link href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" rel="stylesheet"> <style type="text/css"> body { margin: 0; } .box { border: 4px solid #FFFFFF; border-radius: 3px; color: white; font-size: 100px; width: 800px; height: 200px; font-family: 'Roboto', sans-serif; background-color: #8BC6EC; background-image: linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%); } #pfp { position: absolute; top: 4px; left: 4px; height: 200px; width: 200px } h4 { position: absolute; margin: 0; top: 30px; left: 290px; font-size: 55pt; font-weight: 700; } p { position: absolute; margin: 0; top: 120px; left: 315px; font-size: 32pt; } h4 + img { width: 55pt; position: absolute; top: 30px; left: 650px; } </style></head><body> <div class="box"> <img src="${avatarURL}" id="pfp" /> <h4>Congrats !</h4> <img src="https://iwa.sh/img/party-popper.png"> <p>You're now level ${level} !</p> </div></body></html>`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({width: 808, height: 208, deviceScaleFactor: 2})
    await page.setContent(contentLvl, {waitUntil: 'load'});

    var name = Crypto.SHA1(msg.author.tag).toString()

    await page.screenshot({path: 'image/' + name + '.jpg', type: 'jpeg', quality: 100});

    await browser.close();

    try {
        return msg.reply('', {files: ['image/' + name + '.jpg']})
    } catch(err) {
        console.error(err)
        return msg.reply("You're now level " + level + " ! Congrats !")
    }

}

async function profile(msg, id) {

    if(msg.channel.type !== "dm") {
        msg.delete().catch(console.error);
    }

    var mongod = await mongo.connect(url, connOptions);
    var db = mongod.db(dbName);

    var user = await db.collection('user').findOne({ '_id': { $eq: id } });

    var leadXP = await db.collection('user').find().sort({exp:-1}).toArray();
    var leadHug = await db.collection('user').find().sort({hug:-1}).toArray();
    var leadPat = await db.collection('user').find().sort({pat:-1}).toArray();
    var leadBoop = await db.collection('user').find().sort({boop:-1}).toArray();

    mongod.close();

    if(!user)return msg.channel.send(":x: > **The user you entered isn't registered in the database yet**");

    msg.channel.startTyping();

    let userDiscord = await bot.fetchUser(id)
    let xp = user.exp;
    let birthday = user.birthday;
    let fc = user.fc;
    var level, remaining, need;

    var positionXP = leadXP.findIndex(val => val._id == id)+1;
    var positionHug = leadHug.findIndex(val => val._id == id)+1;
    var positionPat = leadPat.findIndex(val => val._id == id)+1;
    var positionBoop = leadBoop.findIndex(val => val._id == id)+1;

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


    var contentProfile = `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap" rel="stylesheet"> <style type="text/css"> body { margin: 0; } .box { border: 4px solid #FFFFFF; border-radius: 3px; color: white; width: 500px; height: 420px; font-family: 'Roboto'; background-color: #8BC6EC; background-image: linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%); } #pfp { position: absolute; height: 140px; width: 140px; border-radius: 5%; } .box > section { position: absolute; top: 14px; left: 14px; width: 480px; height: 400px; background-color: rgba(0, 0, 0, 0.15); } header > div { position: absolute; top: 10px; left: 150px; display: table; width: 320px; height: 80px; } header > div > h4 { margin: 0; font-size: 28pt; font-weight: 500; display: table-cell; line-height: 1.1; text-align: left; vertical-align: middle; } header > section > h5 { position: absolute; margin: 0; top: 95px; left: 155px; font-size: 17pt; font-weight: 300; display: block; text-align: left; letter-spacing: 2px; } header > section > h6 { position: absolute; margin: 0; top: 102px; right: 12px; font-size: 12pt; font-weight: 300; display: block; text-align: right; letter-spacing: 2px; color: rgba(255, 255, 255, 0.75); width: 200px; } header > section > #xp { height: 8px; margin: 0; position: absolute; top: 120px; left: 150px; text-align: left; border: 1px solid rgba(255,255,255,0.4); border-radius: 1em; width: 320px; } header > section > #xp::-webkit-progress-value { background: #B8F72C; border-radius: 1em; } header > section > #xp::-webkit-progress-bar { background: #9CA0A2; border-radius: 1em; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset; } main > table { position: absolute; top: 170px; left: 10px; width: 460px; text-align: center; font-size: 16pt; } th { font-weight: 500; margin: 0 0 10px 0; } td { font-weight: 300; } main > table > tbody > #ranks { font-size: 11pt; color: rgba(255, 255, 255, 0.65); } main > #birthday > h5 { position: absolute; margin: 0; top: 280px; left: 50px; font-size: 17pt; font-weight: 300; display: block; text-align: left; letter-spacing: 2px; } main > #birthday > h6 { position: absolute; margin: 0; top: 280px; left: 240px; font-size: 17pt; font-weight: 300; display: block; text-align: left; letter-spacing: 1px; color: rgba(255, 255, 255, 0.8); } main > #switch-fc > h5 { position: absolute; margin: 0; top: 340px; left: 50px; font-size: 17pt; font-weight: 300; display: block; text-align: left; letter-spacing: 2px; } main > #switch-fc > h6 { position: absolute; margin: 0; top: 340px; left: 200px; font-size: 17pt; font-weight: 300; display: block; text-align: left; letter-spacing: 1px; color: rgba(255, 255, 255, 0.8); } main > #badges > h5 { position: absolute; margin: 0; top: 344px; left: 22px; font-size: 16pt; font-weight: 300; display: block; text-align: left; letter-spacing: 1px; text-decoration: underline; } footer > p { position: absolute; top: 385px; width: 480px; margin: 0; text-align: center; letter-spacing: 1px; color: rgba(255, 255, 255, 0.15); font-size: 10pt; } </style></head><body> <div class="box"> <section> <header> <img src="${userDiscord.avatarURL}" id="pfp" /> <div> <h4>${userDiscord.username}</h4> </div> <section> <h5>Level ${level}</h5> <h6>#${positionXP} <b>|</b> ${remaining}/${need}</h6> <progress id="xp" value="${remaining}" max="${need}"></progress> </section> </header> <main> <table> <tr> <th>Hugs given :</th> <th>Pats given :</th> <th>Boops given :</th> </tr> <tr> <td>${user.hug}</td> <td>${user.pat}</td> <td>${user.boop}</td> </tr> <tr id="ranks"> <td>#${positionHug}</td> <td>#${positionPat}</td> <td>#${positionBoop}</td> </tr> </table> <section id="birthday"> <h5>Your birthday :</h5> <h6>${birthday}</h6> </section> <section id="switch-fc"> <h5>Switch FC :</h5> <h6>${fc}</h6> </section> </main> <footer> <p id="copyright">Made with ♥ by iwa</p> </footer> </section> </div></body></html>`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({width: 508, height: 428, deviceScaleFactor: 2})
    await page.setContent(contentProfile, {waitUntil: 'load'});

    var name = Crypto.SHA1('prof' + msg.author.tag).toString()

    await page.screenshot({path: 'image/' + name + '.jpg', type: 'jpeg', quality: 100});

    await browser.close();

    try {
        return await msg.channel.send('', {files: ['image/' + name + '.jpg']}).then(msg.channel.stopTyping(true));
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

        var contentSS = `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <link href="https://fonts.googleapis.com/css?family=Roboto:500&display=swap" rel="stylesheet"> <style type="text/css"> body { margin: 0; } .box { width: 385px; height: 209px; color: white; font-family: 'Roboto'; background-image: url('https://iwa.sh/img/sonicsays.png'); background-repeat: no-repeat; } .box > h1 { margin: 0; font-weight: 500; width: 220px; height: 125px; position: absolute; top: 50px; left: 10px; font-size: 14pt; letter-spacing: 1px; text-shadow: -1px 0 #000000, 0 1px #000000, 1px 0 #000000, 0 -1px #000000; } </style></head><body> <div class="box"> <h1>${x}</h1> </div></body></html>`;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setViewport({width: 385, height: 209, deviceScaleFactor: 2})
        await page.setContent(contentSS, {waitUntil: 'load'});

        var name = Crypto.SHA1('sonic' + msg.author.tag).toString()

        await page.screenshot({path: 'image/' + name + '.jpg', type: 'jpeg', quality: 100});

        await browser.close();

        try {
            return msg.channel.send('', {files: ['image/' + name + '.jpg']}).then(msg.channel.stopTyping(true));
        } catch(err) {
            console.error(err)
        }
    }
}

async function osuUser(msg, cont) {

    if(cont.length != 2 || cont.length < 2)return;
    let mode = 0, type = 'string'

    let url = `https://osu.ppy.sh/api/get_user?k=${osuKey}&u=${cont[1]}&m=${mode}&type=${type}`
    var response = await fetch(url);
    var [data] = await response.json();

    if ([data] === []) {
        console.error("The specified user isn't a valid user!")
    }

    if (data == undefined)
        return msg.channel.send(":x: > **The user you entered doesn't exist !**")

    var playedTime = (data.total_seconds_played/3600);

    const embed = new Discord.RichEmbed();
    embed.setTitle("**" + data.username + "**")
    embed.setDescription('__level :__ ' + data.level +
        '\n__pp :__ ' + data.pp_raw +
        '\n__pp worldwide rank :__ ' + data.pp_rank +
        '\n__total plays :__ ' + data.playcount +
        '\n__accuracy :__ ' + data.accuracy.substr(0,7) +
        '\n__country :__ ' + data.country +
        '\n__time played :__ ' + Math.trunc(playedTime) + 'h')
    embed.setThumbnail('http://a.ppy.sh/' + data.user_id)
    embed.setColor('#fd79a8')
    msg.channel.send(embed)

}