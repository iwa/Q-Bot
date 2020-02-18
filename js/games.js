let reply = ["Yes", "No", "Yep", "Nope", "Probably", "Well...", "Probably not"]

module.exports = class games {

    static async ball (msg, cont, Discord) {

        if(await msg.channel.type != "text")return;
        if(cont.length < 2)return;

        let r = Math.floor((Math.random() * reply.length));

        const embed = new Discord.RichEmbed();
        embed.setTitle(reply[r])
        embed.setColor('GREY')

        console.log(`info: 8ball by ${msg.author.tag}`)
        return msg.channel.send(embed)

    }

}