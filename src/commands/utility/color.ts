import { Client, Message } from 'discord.js'
import { Db } from 'mongodb'
import utilities from '../../utils/utilities'
const colors = require('../../../lib/colors.json')

module.exports.run = async (bot:Client, msg:Message, args:string[], db:Db) => {
    let user = await db.collection('user').findOne({ '_id': { $eq: msg.author.id } });
    let level = utilities.levelInfo(user.exp)
    let i:number = Math.floor(level.level / 2);
    if(args.length == 1) {
        if(args[0] == "off") {
            let role = msg.member.roles.cache.find(val => colors.indexOf(val.id) > -1)
            if(role) {
                await msg.member.roles.remove(role)
                return await msg.channel.send({
                    "embed": {
                      "color": 11675878,
                      "author": {
                        "name": "You took off your color!",
                        "icon_url": msg.author.avatarURL({ format: 'png', dynamic: false, size: 128 })
                      }
                    }
                  })
            }
        } else if(Number.isInteger(parseInt(args[0]))) {
            let choice:number = parseInt(args[0]) - 1;
            if(choice > i || choice < 0) return msg.channel.send({
                "embed": {
                  "color": 14686489,
                  "author": {
                    "name": "❌ > Not an available option!",
                    "icon_url": msg.author.avatarURL({ format: 'png', dynamic: false, size: 128 })
                  }
                }
              })
            let role = msg.member.roles.cache.find(val => colors.indexOf(val.id) > -1)
            if(role)
                await msg.member.roles.remove(role)
            await msg.member.roles.add(colors[choice]);
            msg.channel.send({
                "embed": {
                  "description": "You're now wearing the <@&${colors[choice]}> color!\nType `?color off` to take off the color.",
                  "color": 11675878,
                  "author": {
                    "name": msg.author.username,
                    "icon_url": msg.author.avatarURL({ format: 'png', dynamic: false, size: 128 })
                  } // Got rid of footer because code blocs (``) don't work in embed footers. Moved to "description". - Hy~
                }
              })
        }
    } else {
        let content:string = "";
        for(let j = 0; i >= j; j++)
            content = `${content}**${j+1}.** <@&${colors[j]}>\n`;

        if(content) msg.channel.send({
            "embed": {
              "title": "Colors you've unlocked :",
              "description": content,
              "color": 11675878,
              "author": {
                "name": msg.author.username,
                "icon_url": msg.author.avatarURL({ format: 'png', dynamic: false, size: 128 })
              },
              "footer": {
                  "text": "Type '?color (id)' to wear the color you want."
              }
            }
          })
    }
};

module.exports.help = {
    name: 'color',
    usage: "?color [color id]",
    desc: "Choose your username color"
};