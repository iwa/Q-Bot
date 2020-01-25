let reply = ["Yes", "No", "Yep", "Nope", "Probably", "Well...", "Probably not"]

module.exports = class games {

    static roll (msg, cont, randomInt, author) {

        if(cont.length !== 1) {
            cont.shift()
            var x = cont[0]
            msg.channel.send({"embed": { "title": "**" + randomInt(x) + "**" }})
              .then(console.log("[" + new Date().toLocaleTimeString() + "] Roll (" + x + ") : " + author))
              .catch(console.error);
        } else {
            msg.channel.send({"embed": { "title": "**" + randomInt(100) + "**" }})
              .then(console.log("[" + new Date().toLocaleTimeString() + "] Roll (100) : " + author))
              .catch(console.error);
        }

    }

    static flipCoin (msg, randomInt) {
        var n = randomInt(2);

        if(n == 1)
            msg.channel.send({"embed": { "title": ":large_blue_diamond: **Heads**" }})
        else
            msg.channel.send({"embed": { "title": ":large_orange_diamond: **Tails**" }})

        return console.log(`info: flip coin by ${msg.author.tag}`)
    }

    static rps (msg, cont, randomInt, Discord) {

        if(cont.length < 2)return;
        var req = cont[1].toLowerCase(), numReq, res;

        switch(req) {
            case "rock":
                numReq = 1;
            break;

            case "paper":
                numReq = 2;
            break;

            case "scissors":
            case "scissor":
                numReq = 3;
            break;

            default:
                return msg.channel.send({"embed": { "title": ":x: > **You need to pick between rock, paper and scissors !**" }})
        }

        var n = randomInt(3);

        if(n == 1 && numReq == 1 || n == 2 && numReq == 2 || n == 3 && numReq == 3)
            res = "**Draw !**";
        if(n == 1 && numReq == 2 || n == 2 && numReq == 3 || n == 3 && numReq == 1)
            res = "**You won !**";
        if(n == 1 && numReq == 3 || n == 2 && numReq == 1 || n == 3 && numReq == 2)
            res = "**I won !**";

        const embed = new Discord.RichEmbed();

        if(n == 1)
            embed.setTitle(":punch: **I play rock !**");
        if(n == 2)
            embed.setTitle(":hand_splayed: **I play paper !**");
        if(n == 3)
            embed.setTitle(":v: **I play scissors !**");

        embed.setDescription(res);

        console.log(`info: rps by ${msg.author.tag}`)
        return msg.channel.send(embed).catch(console.error)

    }

    static async ball (msg, cont, Discord) {

        if(await msg.channel.type != "text")return;
        if(cont.length < 2)return;

        let r = Math.floor((Math.random() * reply.length));

        const embed = new Discord.RichEmbed();
        embed.setTitle(reply[r])
        embed.setColor('GREY')

        console.log("[" + new Date().toLocaleTimeString() + "] 8ball by " + msg.author.tag);
        return msg.channel.send(embed)

    }

}