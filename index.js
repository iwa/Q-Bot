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

    if(!msg.content.startsWith(process.env.PREFIX)) {
        if(msg.channel.id == '608630294261530624')return;
        if(msg.channel.id == process.env.SUGGESTIONTC) {
            await msg.react('✅');
            return await msg.react('❌');
        }

        var user = await db.get('user').find({ id: msg.author.id }).value();

        if(!user)
            await db.get('user').push({ id: msg.author.id, exp: 1, birthday: null, fc: null, hidden: false, pat: 0, hug: 0, boop: 0, slap: 0 }).write()
        else if(!cooldownXP[msg.author.id]) {
            user = await db.get('user').find({ id: msg.author.id }).update('exp', n => n + 1).write();
            levelCheck(msg, user.exp);
            cooldownXP[msg.author.id] = 1;
            return setTimeout(async () => { delete cooldownXP[msg.author.id] }, 5000)
        }
    }

    let args = msg.content.slice(1).trim().split(/ +/g);
    let req = args.shift();
    let cmd = bot.commands.get(req);

    if(req == "letmein")
        return letmein.action(msg, levels, db);

    if(process.env.SLEEP === 1 && msg.author.id != process.env.IWA)return;

    if (!cmd) return;
    else return cmd.run(bot, msg, args, db);
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

bot.on('guildMemberRemove', async member => {
    var user = await db.get('user').find({ id: member.id }).value();
    if(user)
        return await db.get('user').find({ id: member.id }).set({hidden: true}).write();
})

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
    var guild = bot.guilds.find(val => val.id == process.env.GUILDID)

    guild.members.forEach(async elem => {
        if(elem.roles.find(val => val.id == process.env.BOOSTCOLOR) && !(elem.roles.find(val => val.id == process.env.BOOSTROLE))) {
            await elem.removeRole(process.env.BOOSTCOLOR);
        }
    });
}, 300000);

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