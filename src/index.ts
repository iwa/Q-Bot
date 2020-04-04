import * as Discord from "discord.js";
const bot = new Discord.Client()
const commands = new Discord.Collection();

import * as dotenv from "dotenv";
dotenv.config();

import * as fs from 'fs';
import * as ejs from 'ejs';

import { MongoClient } from 'mongodb';
const url = process.env.MONGO_URL, dbName = process.env.MONGO_DBNAME;

const letmein = require('./js/letmein')
const img = require('./js/img')
const levels = require('../lib/levels.json');

import { YouTube } from 'popyt';
const yt = new YouTube(process.env.YT_TOKEN)

let cooldown:stringKeyArray, cooldownXP:stringKeyArray;
interface stringKeyArray {
	[index:string]: any;
}

fs.readdir('./build/commands/', (error, f) => {
    if (error) return console.error(error);
    let commandes = f.filter(f => f.split('.').pop() === 'js');
    if (commandes.length <= 0) return console.log('warn: no commands found');
    commandes.forEach((f) => {
        let commande = require(`./commands/${f}`);
        commands.set(commande.help.name, commande);
    });
});

process.on('uncaughtException', exception => {
    console.error(exception);
});

bot.on('warn', console.warn)

bot.on('shardError', console.error)

bot.on('shardDisconnect', () => console.log("warn: bot disconnected"))

bot.on('shardReconnecting', async () => {
    await bot.user.setActivity("Qumu's Remixes | ?help", {type : 2}).catch(console.error);
    await bot.user.setStatus("online").catch(console.error)
    console.log("info: bot reconnecting...")
});

bot.on('shardReady', async () => {
    await bot.user.setActivity("Qumu's Remixes | ?help", {type : 2}).catch(console.error);
    await bot.user.setStatus("online").catch(console.error)
    console.log(`info: logged in as ${bot.user.username}`);
});

// Message Event

bot.on('message', async (msg:Discord.Message) => {

    if(!msg)return;
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
        await msg.member.roles.add('636254696880734238')
        var msgReply = await msg.reply({"embed": { "title": "**You've been mute for 20 minutes. Reason : spamming.**", "color": 13632027 }})
        setTimeout(async () => {
            await msgReply.delete()
            return msg.member.roles.remove('636254696880734238')
        }, 1200000);
    }

    let mongod = await MongoClient.connect(url, {'useUnifiedTopology': true});
    let db = mongod.db(dbName);

    if(!msg.content.startsWith(process.env.PREFIX)) {
        if(msg.channel.id == '608630294261530624')return;
        if(msg.channel.id == process.env.SUGGESTIONTC) {
            await msg.react('✅');
            return await msg.react('❌');
        }

        var user = await db.collection('user').findOne({ '_id': { $eq: msg.author.id } });

        if(!user)
            await db.collection('user').insertOne({ _id: msg.author.id, exp: 1, birthday: null, fc: null, hidden: false, pat: 0, hug: 0, boop: 0, slap: 0 });
        else if(!cooldownXP[msg.author.id]) {
            await db.collection('user').updateOne({ _id: msg.author.id }, { $inc: { exp: 1 }});
            levelCheck(msg, user.exp);
            cooldownXP[msg.author.id] = 1;
            return setTimeout(async () => { delete cooldownXP[msg.author.id] }, 5000)
        }

        return mongod.close();
    }

    let args = msg.content.slice(1).trim().split(/ +/g);
    let req = args.shift();
    let cmd:any = commands.get(req);

    if(req == "letmein")
        return letmein.action(msg, levels, db);

    if(process.env.SLEEP === '1' && msg.author.id != process.env.IWA)return;

    if (!cmd) return;
    else cmd.run(bot, msg, args, db);
});

// Reactions Event

bot.on('messageReactionAdd', async reaction => {
    if(reaction.message.guild.id !== process.env.GUILDID)return;
    if(reaction.emoji.name !== '⭐')return;
    if(reaction.message.channel.id == process.env.STARBOARDTC)return;
    if(reaction.message.channel.id == process.env.ANNOUNCEMENTSTC)return;
    if(reaction.users.cache.find(val => val.id == bot.user.id))return;
    if(reaction.count >= 6) {
        var msg = reaction.message;
        var content;
        if(!msg.cleanContent)
            content = "*attachment only*\n"
        else
            content = `\`\`\`${msg.cleanContent}\`\`\``

        var channel:any = bot.channels.cache.find(val => val.id == process.env.STARBOARDTC);

        await msg.react(reaction.emoji.name);
        await channel.send({
            "embed": {
              "description": `${content}[message link✉️](${msg.url})`,
              "color": 14212956,
              "timestamp": msg.createdTimestamp,
              "footer": {
                "text": "New starboard entry ⭐️"
              },
              "author": {
                "name": msg.author.username,
                "icon_url": msg.author.avatarURL({ format: 'png', dynamic: false, size: 128 })
              }
            }
          });
        return console.log(`info: new message into starboard (author: ${msg.author.tag})`);
    }
});

bot.on('guildMemberRemove', async member => {
    var mongod = await MongoClient.connect(url, {'useUnifiedTopology': true});
    var db = mongod.db(dbName);

    var user = await db.collection('user').findOne({ '_id': { $eq: member.id } });
    if(user)
        await db.collection('user').updateOne({ _id: member.id }, { $set: { hidden: true }});

    return mongod.close();
})

// Subs count, refresh every hour

setInterval(async () => {
    let channel:any = bot.channels.cache.find(val => val.id == process.env.SUBCOUNT)
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
    var guild = bot.guilds.cache.find(val => val.id == process.env.GUILDID)

    guild.members.cache.forEach(async elem => {
        if(elem.roles.cache.find(val => val.id == process.env.BOOSTCOLOR) && !(elem.roles.cache.find(val => val.id == process.env.BOOSTROLE))) {
            await elem.roles.remove(process.env.BOOSTCOLOR);
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
        let todayString = `${mm}/${dd}`;

        var mongod = await MongoClient.connect(url, {'useUnifiedTopology': true});
        var db = mongod.db(dbName);

        var data = await db.collection('user').find({ 'birthday': { $eq: today } }).toArray();
        console.log(data)

        if(data.length >= 1) {
            let channel:any = bot.channels.cache.find(val => val.id == process.env.BIRTHDAYTC)

            data.forEach(async user => {
                var userInfo = await bot.users.fetch(user._id)
                const embed = new Discord.MessageEmbed();
                embed.setTitle(`**Happy Birthday, ${userInfo.username} ! 🎉🎉**`)
                embed.setFooter(`Born on : ${today}`)
                embed.setColor('#FFFF72')
                embed.setThumbnail(userInfo.avatarURL({ format: 'png', dynamic: false, size: 128 }))
                channel.send(`<@${user._id}>`)
                channel.send(embed)
            });
        }
    }
}, 3600000);

// Login

bot.login(process.env.TOKEN)

// Functions

async function levelCheck(msg:Discord.Message, xp:number) {
    for(var i = 1; i <= 20; i++) {
        if(xp == levels[i].amount) {
            if(i != 1)
                await msg.member.roles.remove(levels[i-1].id).catch(console.error);
            await msg.member.roles.add(levels[i].id).catch(console.error);
            return imageLvl(msg, i);
        }
    }
}

async function imageLvl(msg:Discord.Message, level:number) {
    var avatarURL = msg.author.avatarURL({ format: 'png', dynamic: false, size: 512 })

    var html = await ejs.renderFile('views/level.ejs', { avatarURL, level });
    var file = await img.generator(808, 208, html, msg.author.tag, 'lvl')

    try {
        return msg.reply('', {files: [file]})
    } catch(err) {
        console.error(err)
        return msg.reply(`You're now level ${level} ! Congrats !`)
    }
}