import * as Discord from "discord.js";
const bot:Discord.Client = new Discord.Client()
const commands:Discord.Collection<any, any> = new Discord.Collection();

import * as dotenv from "dotenv";
dotenv.config();

import * as fs from 'fs';

import { MongoClient } from 'mongodb';
const url = process.env.MONGO_URL, dbName = process.env.MONGO_DBNAME;

const letmein = require('./js/letmein')

const levels = require('../lib/levels.json');

import cooldown from "./events/messages/cooldown";


fs.readdir('./build/commands/', { withFileTypes:true }, (error, f) => {
    if (error) return console.error(error);
    f.forEach((f) => {
        if(f.isDirectory()) {
            fs.readdir(`./build/commands/${f.name}/`, (error, fi) => {
                if (error) return console.error(error);
                fi.forEach((fi) => {
                    let commande = require(`./commands/${f.name}/${fi}`);
                    commands.set(commande.help.name, commande);
                })
            })
        } else {
            let commande = require(`./commands/${f.name}`);
            commands.set(commande.help.name, commande);
        }
    });
});

process.on('uncaughtException', exception => {
    console.error(exception);
});

bot.on('warn', console.warn)

bot.on('shardError', console.error)

bot.on('shardDisconnect', () => console.log("warn: bot disconnected"))

bot.on('shardReconnecting', () => {
    console.log("info: bot reconnecting...")
});

bot.on('shardResume', async () => {
    await bot.user.setActivity("Qumu's Remixes | ?help", {type : 2}).catch(console.error);
    await bot.user.setStatus("online").catch(console.error)

    let mongod = await MongoClient.connect(url, {'useUnifiedTopology': true});
    let db = mongod.db(dbName);

    let allMsg = db.collection('msg').find()
    allMsg.forEach(async elem => {
        let channel:any = await bot.channels.fetch(elem.channel)
        await channel.messages.fetch(elem._id, true)
    });
})

bot.on('shardReady', async () => {
    await bot.user.setActivity("Qumu's Remixes | ?help", {type : 2}).catch(console.error);
    await bot.user.setStatus("online").catch(console.error)

    let mongod = await MongoClient.connect(url, {'useUnifiedTopology': true});
    let db = mongod.db(dbName);

    let allMsg = db.collection('msg').find()
    allMsg.forEach(async elem => {
        let channel:any = await bot.channels.fetch(elem.channel)
        await channel.messages.fetch(elem._id, true)
    });

    console.log(`info: logged in as ${bot.user.username}`);
});

// Message Event

bot.on('message', async (msg:Discord.Message) => {

    if(!msg)return;
    if(msg.author.bot)return;
    if(msg.channel.type != "text")return;
    if(!msg.guild.available)return;

    await cooldown.message(msg);

    if(msg.channel.id == process.env.SUGGESTIONTC) {
        await msg.react('✅');
        return await msg.react('❌');
    }

    let mongod = await MongoClient.connect(url, {'useUnifiedTopology': true});
    let db = mongod.db(dbName);
    let date:string = new Date().toISOString().slice(0,10)

    if(!msg.content.startsWith(process.env.PREFIX))
        return await cooldown.exp(msg, mongod, db, date);

    let args = msg.content.slice(1).trim().split(/ +/g);
    let req = args.shift();
    let cmd:any = commands.get(req);

    if(req == "letmein")
        return letmein.action(msg, levels, db);

    if(process.env.SLEEP === '1' && msg.author.id != process.env.IWA)return;

    if (!cmd) return;
    else await cmd.run(bot, msg, args, db, commands);

    await db.collection('stats').updateOne({ _id: date }, { $inc: { cmd: 1 } }, { upsert: true })

    return setTimeout(async () => {
        await mongod.close()
    }, 31000);
});

// Reactions Event

import starboard from './events/starboard';
bot.on('messageReactionAdd', async (reaction:Discord.MessageReaction, author:Discord.User) => {
    await starboard.check(reaction, author, bot);
});

import memberLeave from './events/memberLeave'
bot.on('guildMemberRemove', async member => {
    memberLeave(member)
})

import reactionRoles from './events/reactionRoles';
bot.on('messageReactionAdd', async (reaction:Discord.MessageReaction, author:Discord.User) => {
    reactionRoles.add(reaction, author);
});

bot.on('messageReactionRemove', async (reaction:Discord.MessageReaction, author:Discord.User) => {
    reactionRoles.remove(reaction, author);
});

import highfiveWatcher from './events/highfiveWatcher'
bot.on('messageReactionAdd', async (reaction:Discord.MessageReaction, author:Discord.User) => {
    highfiveWatcher(reaction, author, bot);
})

// Subs count, refresh every hour

import subsCount from './loops/subsCount';
setInterval(async () => {
    subsCount(bot);
}, 3600000);

// Check if a member no longer booster have the color

setInterval(async () => {
    let guild = bot.guilds.cache.find(val => val.id == process.env.GUILDID)

    guild.members.cache.forEach(async elem => {
        if(elem.roles.cache.find(val => val.id == process.env.BOOSTCOLOR) && !(elem.roles.cache.find(val => val.id == process.env.BOOSTROLE))) {
            await elem.roles.remove(process.env.BOOSTCOLOR);
        }
    });
}, 300000);

// Check if it's someone's birthday, and send a HBP message at 7am UTC

setInterval(async () => {
    let today = new Date();
    let hh = today.getUTCHours()

    if(hh == 7) {
        let guild = bot.guilds.cache.find(val => val.id == process.env.GUILDID)
        let oldMembers = guild.roles.fetch(process.env.BIRTHDAYROLE);

        (await oldMembers).members.forEach(async (user:Discord.GuildMember) => {
            try {
                await user.roles.remove(process.env.BIRTHDAYROLE)
            } catch (e) {
                console.error(e)
            }
        });

        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let todayString = `${mm}/${dd}`;

        let mongod = await MongoClient.connect(url, {'useUnifiedTopology': true});
        let db = mongod.db(dbName);

        let data = await db.collection('user').find({ 'birthday': { $eq: todayString } }).toArray();

        if(data.length >= 1) {
            let channel:any = guild.channels.cache.find(val => val.id == process.env.BIRTHDAYTC)

            data.forEach(async user => {
                let userInfo = await guild.members.fetch(user._id)
                userInfo.roles.add(process.env.BIRTHDAYROLE)
                const embed = new Discord.MessageEmbed();
                embed.setTitle(`**Happy Birthday, ${userInfo.user.username} ! 🎉🎉**`)
                embed.setFooter(`Born on : ${todayString}`)
                embed.setColor('#FFFF72')
                embed.setThumbnail(userInfo.user.avatarURL({ format: 'png', dynamic: false, size: 128 }))
                channel.send(`<@${user._id}>`)
                channel.send(embed)
            });
        }
    }
}, 3600000);

// Login

bot.login(process.env.TOKEN)