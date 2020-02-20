const utils = require('../js/utilities')

module.exports.run = (bot, msg, args) => {
    if(args.length > 0) {
        var x = args[0]
        msg.channel.send({"embed": {
            "title": `🎲 **${utils.randomInt(x)}**`,
            "color": 5601658
        }})
          .then(console.log(`info: roll (${x}) by ${msg.author.tag}`))
          .catch(console.error);
    } else {
        msg.channel.send({"embed": {
            "title": `🎲 **${utils.randomInt(100)}**`,
            "color": 5601658
        }})
        .then(console.log(`info: roll (100) by ${msg.author.tag}`))
          .catch(console.error);
    }
};

module.exports.help = {
    name: 'roll'
};