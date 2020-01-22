let reply = ["awww", "thank you :33", "damn you're so precious", "why are you so cute with me ? :kyOof:", "omg", "<3", "so cuuuute c:", "c:", "c;", ":3", "QT af :O", "oh yeaaaah ;3"]

var lastGifPat, lastGifHug, lastGifBoop, lastGifSlap;

let countPat = 46, countHug = 47, countBoop = 15, countSlap = 9;

module.exports = class actions {

    static async pat (msg, cont, randomInt, author, author_id, db, Discord) {

        var n = randomInt(countPat)
        while(lastGifPat == n) {
            n = randomInt(countPat);
        }
        lastGifPat = n;
        var r = randomInt(12)

        if(cont.length > 2)return;

        if(cont.length == 2) {
            if(msg.mentions.everyone)return;

            var mention = msg.mentions.users.first()

            if(!mention)return;

            if(mention.id == author_id) {
                return msg.channel.send({"embed": { "title": ":x: > **You can't pat youself !**", "color": 13632027 }});
            }

            const embed = new Discord.RichEmbed();
            embed.setColor('#F2DEB0')

            if(mention.id == '606458989575667732') {
                setTimeout(() => {
                    r-1;
                    msg.channel.send(reply[r])
                }, 2000)
            }

            if(msg.channel.type != "dm") {
                msg.delete().catch(console.error)
            }

            msg.channel.startTyping()

            embed.setTitle('**' + msg.author.username + '** pats you **' + mention.username + '** !')
            embed.setImage('https://iwa.sh/img/pat/' + n + '.gif')

            var user = await db.get('user').find({ id: msg.author.id }).update('pat', n => n + 1).write();

            embed.setFooter('you have given ' + (user.pat) + ' pats')

            return msg.channel.send(embed)
            .then(console.log("[" + new Date().toLocaleTimeString() + "] Patpat sent by " + author), msg.channel.stopTyping(true))
            .catch(console.error);

        }

    }

    static async hug (msg, cont, randomInt, author, author_id, db, Discord) {

        var n = randomInt(countHug)
        while(lastGifHug == n) {
            n = randomInt(countHug);
        }
        lastGifHug = n;
        var r = randomInt(12)

        if(cont.length > 2)return;

        if(cont.length == 2) {
            if(msg.mentions.everyone)return;

            var mention = msg.mentions.users.first()

            if(!mention)return;

            if(mention.id == author_id) {
                return msg.channel.send({"embed": { "title": ":x: > **You can't hug youself !**", "color": 13632027 }});
            }

            const embed = new Discord.RichEmbed();
            embed.setColor('#F2DEB0')

            if(mention.id == '606458989575667732') {
                setTimeout(() => {
                    r-1;
                    msg.channel.send(reply[r])
                }, 2000)
            }

            if(msg.channel.type != "dm") {
                msg.delete().catch(console.error)
            }

            msg.channel.startTyping()

            embed.setTitle('**' + msg.author.username + '** hugs you **' + mention.username + '** !')
            embed.setImage('https://iwa.sh/img/hug/' + n + '.gif')

            var user = await db.get('user').find({ id: msg.author.id }).update('hug', n => n + 1).write();

            embed.setFooter('you have given ' + (user.hug) + ' hugs')

            return msg.channel.send(embed)
            .then(console.log("[" + new Date().toLocaleTimeString() + "] Hug by " + author), msg.channel.stopTyping(true))
            .catch(console.error);

        }

    }

    static async boop (msg, cont, randomInt, author, author_id, db, Discord) {

        var n = randomInt(countBoop)
        while(lastGifBoop == n) {
            n = randomInt(countBoop);
        }
        lastGifBoop = n;
        var r = randomInt(12)

        if(cont.length > 2)return;

        if(cont.length == 2) {
            if(msg.mentions.everyone)return;

            var mention = msg.mentions.users.first()

            if(!mention)return;

            if(mention.id == author_id) {
                return msg.channel.send({"embed": { "title": ":x: > **You can't boop youself !**", "color": 13632027 }});
            }

            const embed = new Discord.RichEmbed();
            embed.setColor('#F2DEB0')

            if(mention.id == '606458989575667732') {
                setTimeout(() => {
                    r-1;
                    msg.channel.send(reply[r])
                }, 2000)
            }

            if(msg.channel.type != "dm") {
                msg.delete().catch(console.error)
            }

            msg.channel.startTyping()

            embed.setTitle('**' + msg.author.username + '** boops you **' + mention.username + '** !')
            embed.setImage('https://iwa.sh/img/boop/' + n + '.gif')

            var user = await db.get('user').find({ id: msg.author.id }).update('boop', n => n + 1).write();

            embed.setFooter('you have given ' + (user.boop) + ' boops')

            return msg.channel.send(embed)
            .then(console.log("[" + new Date().toLocaleTimeString() + "] Boop by " + author), msg.channel.stopTyping(true))
            .catch(console.error);

        }

    }

    static async slap (msg, cont, randomInt, author, author_id, db, Discord) {

        var n = randomInt(countSlap)
        while(lastGifSlap == n) {
            n = randomInt(countSlap);
        }
        lastGifSlap = n;
        var r = randomInt(12)

        if(cont.length > 2)return;

        if(cont.length == 2) {
            if(msg.mentions.everyone)return;

            var mention = msg.mentions.users.first()

            if(!mention)return;

            if(mention.id == author_id) {
                return msg.channel.send({"embed": { "title": ":x: > **You can't slap youself !**", "color": 13632027 }});
            }

            const embed = new Discord.RichEmbed();
            embed.setColor('#F2DEB0')

            if(msg.channel.type != "dm") {
                msg.delete().catch(console.error)
            }

            msg.channel.startTyping()

            embed.setTitle('**' + msg.author.username + '** slaps you **' + mention.username + '** !')
            embed.setImage('https://iwa.sh/img/slap/' + n + '.gif')

            var user = await db.get('user').find({ id: msg.author.id }).update('slap', n => n + 1).write();

            embed.setFooter('you have given ' + (user.slap) + ' slaps')

            return msg.channel.send(embed)
            .then(console.log("[" + new Date().toLocaleTimeString() + "] Slap by " + author), msg.channel.stopTyping(true))
            .catch(console.error);

        }

    }

}