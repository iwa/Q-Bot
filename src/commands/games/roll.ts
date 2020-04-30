import { Client, Message } from 'discord.js'
const utils = require('../../js/utilities')

module.exports.run = (bot:Client, msg:Message, args:string[]) => {
    if(args.length > 0) {
        var x = args[0]
        msg.channel.send({"embed": {
            "title": `🎲 **${utils.randomInt(x)}**`,
            "color": 5601658
        }})
          .then(() => { console.log(`info: roll (${x}) by ${msg.author.tag}`) })
          .catch(console.error);
    } else {
        msg.channel.send({"embed": {
            "title": `🎲 **${utils.randomInt(100)}**`,
            "color": 5601658
        }})
        .then(() => { console.log(`info: roll (100) by ${msg.author.tag}`) })
          .catch(console.error);
    }
};

module.exports.help = {
    name: 'roll',
    usage: "?roll [number]\n_will choose 100 by default if you don't precise any number_",
    desc: "Generates a number between 1 and the number you choose"
};