const ejs = require('ejs')
const img = require('../js/img')
const utils = require('../js/utilities')
var lastComboColor;

module.exports.run = (bot, msg, args, db) => {
    if(args.length == 1) {
        if(msg.mentions.everyone)return;
        var mention = msg.mentions.users.first()
        if(!mention)return;
        if(mention.id == msg.author.id || mention.id == bot.user.id)return;
        return profileImg(bot, msg, db, mention.id);
    } else
        return profileImg(bot, msg, db, msg.author.id);
};

module.exports.help = {
    name: 'profile',
    usage: "?profile [mention someone]",
    desc: "Print your or someone's profile"
};

async function profileImg(bot, msg, db, id) {
    var userDB = await db.get('user').find({ id: id }).value();
    var user = {};

    if(!userDB)return msg.channel.send(":x: > **You aren't registered into the database. You need to talk once in a channel to have your profile created.**");

    msg.channel.startTyping();

    let userDiscord = await bot.users.fetch(id)
    user.avatar = userDiscord.avatarURL({ format: 'png', dynamic: false, size: 512 })
    user.username = userDiscord.username
    user.icon = null

    let guild = await bot.guilds.cache.find(val => val.id == process.env.GUILDID)
    let member = await guild.members.cache.find(val => val.id == id)

    if(userDiscord.id == process.env.QUMU)
        user.icon = '<i class="fas fa-chess-king"></i>'
    else if(member.roles.cache.find(val => val.id == process.env.MODROLE))
        user.icon = '<i class="fas fa-chess-rook"></i>'

    user.exp = userDB.exp
    user.pat = userDB.pat
    user.hug = userDB.hug
    user.boop = userDB.boop
    user.slap = userDB.slap

    user.positionXP = await db.get('user').orderBy('exp', 'desc').findIndex(val => val.id == id).value()
    user.positionHug = await db.get('user').orderBy('hug', 'desc').findIndex(val => val.id == id).value()
    user.positionPat = await db.get('user').orderBy('pat', 'desc').findIndex(val => val.id == id).value()
    user.positionBoop = await db.get('user').orderBy('boop', 'desc').findIndex(val => val.id == id).value()
    user.positionSlap = await db.get('user').orderBy('slap', 'desc').findIndex(val => val.id == id).value()

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

    var colors = [
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
    if(userDiscord.id == process.env.QUMU) {
        html = await ejs.renderFile('views/profileQumu.ejs', { user, colors, whichColor });
        file = await img.generator(508, 288, html, msg.author.tag, 'prof')
    } else {
        html = await ejs.renderFile('views/profile.ejs', { user, colors, whichColor });
        file = await img.generator(508, 428, html, msg.author.tag, 'prof')
    }

    try {
        console.log(`info: profile by ${msg.author.tag}`)
        return await msg.channel.send('', {files: [file]}).then(msg.channel.stopTyping(true));
    } catch(err) {
        console.error(err)
        return msg.channel.send("An error occured, please contact <@125325519054045184>")
    }
}