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

    var user = await db.get('user').find({ id: id }).value();

    if(!user)return msg.channel.send(":x: > **You aren't registered into the database, you need to talk once in a channel to have your profile initialized**");

    msg.channel.startTyping();

    let userDiscord = await bot.fetchUser(id)
    user.avatar = userDiscord.avatarURL
    user.username = userDiscord.username
    user.icon = null

    let guild = await bot.guilds.find(val => val.id == process.env.GUILDID)
    let member = await guild.members.find(val => val.id == id)

    if(userDiscord.id == process.env.IWA)
        user.icon = '<i class="fas fa-chess-king"></i>'
    else if(member.roles.find(val => val.id == process.env.MODROLE))
        user.icon = '<i class="fas fa-chess-rook"></i>'

    user.positionXP = await db.get('user').orderBy('exp', 'desc').findIndex(val => val.id == id).value()
    user.positionHug = await db.get('user').orderBy('hug', 'desc').findIndex(val => val.id == id).value()
    user.positionPat = await db.get('user').orderBy('pat', 'desc').findIndex(val => val.id == id).value()
    user.positionBoop = await db.get('user').orderBy('boop', 'desc').findIndex(val => val.id == id).value()
    user.positionSlap = await db.get('user').orderBy('slap', 'desc').findIndex(val => val.id == id).value()

    if(user.birthday == null)
        user.birthday = 'not registered yet';

    if(user.fc == null)
        user.fc = 'not registered yet';

    var lvlInfo = await utils.levelInfo(user.exp);
    user.level = lvlInfo.level
    user.current = lvlInfo.current
    user.max = lvlInfo.max

    var colors = [
        ['#8BC6EC', '#9599E2'],
        ['#B2F9B6', '#56E3BC'],
        ['#FFFFD5', '#86DFBC'],
        ['#FFE5E5', '#C8BDFF'],
        ['#FF7171', '#8A1C5F'],
        ['#FFFAB0', '#E6B99F'],
        ['#6D98FF', '#EE69D9']
    ]

    var whichColor = (utils.randomInt(7) - 1)
    while(lastComboColor == whichColor)
        whichColor = (utils.randomInt(7) - 1)
    lastComboColor = whichColor

    var html = await ejs.renderFile('views/profile.ejs', { user, colors, whichColor });
    var file = await img.generator(508, 428, html, msg.author.tag, 'prof')

    try {
        console.log(`info: profile by ${msg.author.tag}`)
        return await msg.channel.send('', {files: [file]}).then(msg.channel.stopTyping(true));
    } catch(err) {
        console.error(err)
        return msg.channel.send("An error occured, please contact <@125325519054045184>")
    }
}