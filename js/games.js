let reply = ["Yes", "No", "Yep", "Nope", "Probably", "Well...", "Probably not"]

module.exports = class games {

    static flipCoin (msg, randomInt, Discord) {

        var n = randomInt(2);
        const embed = new Discord.RichEmbed();

        if(n == 1)
            embed.setTitle(":large_blue_diamond: **Heads**")
        else
            embed.setTitle(":large_orange_diamond: **Tails**")

        console.log("[" + new Date().toLocaleTimeString() + "] Flip coin by " + msg.author.tag)
        return msg.channel.send(embed).catch(console.error)

    }

    static rps (msg, cont, randomInt, Discord, error) {

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
                return error.no(18, msg);
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

        console.log("[" + new Date().toLocaleTimeString() + "] R-P-S by " + msg.author.tag)
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