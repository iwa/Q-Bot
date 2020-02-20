const Discord = require('discord.js')
const util = require('../js/utilities')

let reply = ["awww", "thank you :33", "damn you're so precious", "why are you so cute with me ?", "omg", "<3", "so cuuuute c:", "c:", "c;", ":3", "QT af :O", "oh yeaaaah ;3"]

var lastGif = {
    'pat': 0,
    'hug': 0,
    'boop': 0,
    'slap': 0
};

let count = {
    'pat': 46,
    'hug': 47,
    'boop': 15,
    'slap': 9
};

module.exports = class actions {

    static async run (msg, args, db, type) {

        var n = util.randomInt(count[type])
        while(lastGif[type] == n) {
            n = util.randomInt(count[type]);
        }
        lastGif[type] = n;
        var r = util.randomInt(reply.length)

        if(args.length == 1) {
            if(msg.mentions.everyone)return;

            var mention = msg.mentions.users.first()

            if(!mention)return;

            if(mention.id == msg.author.id) {
                return msg.channel.send({"embed": { "title": `:x: > **You can't ${type} youself !**`, "color": 13632027 }});
            }

            const embed = new Discord.RichEmbed();
            embed.setColor('#F2DEB0')

            if(mention.id == '606458989575667732' && type != 'slap') {
                setTimeout(() => {
                    r-1;
                    msg.channel.send(reply[r])
                }, 2000)
            }

            if(msg.channel.type != "dm") {
                msg.delete().catch(console.error)
            }

            msg.channel.startTyping()

            embed.setTitle(`**${msg.author.username}** ${type}s you **${mention.username}** !`)
            embed.setImage(`https://iwa.sh/img/${type}/${n}.gif`)

            var user = await db.get('user').find({ id: msg.author.id }).update(type, n => n + 1).write();

            embed.setFooter(`you have given ${user[type]} ${type}s`)

            return msg.channel.send(embed)
            .then(console.log(`info: ${type} sent by ${msg.author.tag}`), msg.channel.stopTyping(true))
            .catch(console.error);

        }
    }
}