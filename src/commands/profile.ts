import { Client, Message } from 'discord.js'
import { Db } from 'mongodb'
import * as ejs from 'ejs';
const img = require('../js/img')
const utils = require('../js/utilities')
let lastComboColor:number;

module.exports.run = (bot:Client, msg:Message, args:string[], db:Db) => {
    if(args.length == 1) {
        if(msg.mentions.everyone)return;
        var mention = msg.mentions.users.first()
        if(!mention)return;
        return profileImg(bot, msg, db, mention.id);
    } else
        return profileImg(bot, msg, db, msg.author.id);
};

module.exports.help = {
    name: 'profile',
    usage: "?profile [mention someone]",
    desc: "Print your or someone's profile"
};

async function profileImg(bot:Client, msg:Message, db:Db, id:string) {
    var userDB = await db.collection('user').findOne({ '_id': { $eq: id } });

    if(!userDB)return msg.channel.send(":x: > **You aren't registered into the database. You need to talk once in a channel to have your profile created.**");

    msg.channel.startTyping();

    let userDiscord = await bot.users.fetch(id)

    let guild = bot.guilds.cache.find(val => val.id == process.env.GUILDID)
    let member = guild.members.cache.find(val => val.id == id)

    var leadXP = await db.collection('user').find().sort({exp:-1}).toArray();
    var leadHug = await db.collection('user').find().sort({hug:-1}).toArray();
    var leadPat = await db.collection('user').find().sort({pat:-1}).toArray();
    var leadBoop = await db.collection('user').find().sort({boop:-1}).toArray();
    var leadSlap = await db.collection('user').find().sort({boop:-1}).toArray();

    let user = {
        avatar: userDiscord.avatarURL({ format: 'png', dynamic: false, size: 512 }),
        username: userDiscord.username,
        icon: "",
        exp: userDB.exp,
        pat: userDB.pat,
        hug: userDB.hug,
        boop: userDB.boop,
        slap: userDB.slap,
        positionXP: leadXP.findIndex(val => val._id == id)+1,
        positionPat: leadPat.findIndex(val => val._id == id)+1,
        positionHug: leadHug.findIndex(val => val._id == id)+1,
        positionBoop: leadBoop.findIndex(val => val._id == id)+1,
        positionSlap: leadSlap.findIndex(val => val._id == id)+1,
        birthday: "",
        fc: "",
        level: 0,
        current: 0,
        max: 0
    }

    if(id == process.env.QUMU)
        user.icon = '<i class="fas fa-chess-king"></i>'
    else if(member.roles.cache.find(val => val.id == process.env.MODROLE))
        user.icon = '<i class="fas fa-chess-rook"></i>'
    else if (id == bot.user.id)
        user.icon = '<i class="fas fa-chess-knight"></i>'

    if(userDB.birthday == null)
        user.birthday = 'not registered yet';
    else
        user.birthday = userDB.birthday

    if(userDB.fc == null)
        user.fc = 'not registered yet';
    else
        user.fc = userDB.fc

    var lvlInfo = await utils.levelInfo(user.exp);
    user.level = lvlInfo.level
    user.current = lvlInfo.current
    user.max = lvlInfo.max

    let colors:string[][] = [
        ['#8BC6EC', '#9599E2'],
        ['#FFFFD5', '#86DFBC'],
        ['#FFE5E5', '#C8BDFF'],
        ['#FD9090', '#F9AEDC'],
        ['#ECE799', '#FFD3B9'],
        ['#90B1FF', '#F0A6E4']
    ]

    var whichColor;

    if(userDiscord.id == process.env.QUMU || member.roles.cache.find(val => val.id == process.env.MODROLE))
        whichColor = 5
    else {
        whichColor = (utils.randomInt(5) - 1)
        while(lastComboColor == whichColor)
            whichColor = (utils.randomInt(5) - 1)
        lastComboColor = whichColor
    }

    var html, file;
    if(id == process.env.QUMU) {
        html = await ejs.renderFile('views/profileQumu.ejs', { user, colors, whichColor });
        file = await img.generator(508, 288, html, msg.author.tag, 'prof')
    } else if(id == bot.user.id) {
        let thanksiwa:number = userDB.thanksiwa
        html = await ejs.renderFile('views/profileBot.ejs', { user, colors, whichColor, thanksiwa });
        file = await img.generator(508, 358, html, msg.author.tag, 'prof')
    } else {
        html = await ejs.renderFile('views/profile.ejs', { user, colors, whichColor });
        file = await img.generator(508, 428, html, msg.author.tag, 'prof')
    }

    try {
        console.log(`info: profile by ${msg.author.tag}`)
        return await msg.channel.send('', {files: [file]})
            .then(() => { msg.channel.stopTyping(true) });
    } catch(err) {
        console.error(err)
        return msg.channel.send("An error occured, please contact <@125325519054045184>")
    }
}