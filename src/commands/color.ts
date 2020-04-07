import { Client, Message } from 'discord.js'
import { Db } from 'mongodb'
const utils = require('../js/utilities')
const colors = require('../../lib/colors.json')

module.exports.run = async (bot:Client, msg:Message, args:string[], db:Db) => {
    let user = await db.collection('user').findOne({ '_id': { $eq: msg.author.id } });
    let level = utils.levelInfo(user.exp)
    let i:number = Math.floor(level.level / 2);
    if(args.length == 1) {
        if(args[0] == "off") {
            let role = msg.member.roles.cache.find(val => colors.indexOf(val.id) > -1)
            if(role) {
                await msg.member.roles.remove(role)
                return await msg.reply("you take off your color!")
            }
        } else if(Number.isInteger(parseInt(args[0]))) {
            let choice:number = parseInt(args[0]) - 1;
            if(choice > i || choice < 0) return msg.reply(":x: impossible choice")
            await msg.member.roles.add(colors[choice]);
            msg.reply(`you're now wearing <@&${colors[choice]}> color!`)
        }
    } else {
        msg.reply("here are the possible ones :")
        let content:string = "";
        for(let j = 0; i >= j; j++)
            content = `${content}(${j+1}) <@&${colors[j]}>\n`;

        if(content) msg.channel.send(content)
    }
};

module.exports.help = {
    name: 'color',
    usage: "?color [color id]",
    desc: "Choose your username color"
};