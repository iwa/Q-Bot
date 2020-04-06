import { Client, Message } from 'discord.js'
import { Db } from 'mongodb'
const utils = require('../js/utilities')

module.exports.run = async (bot:Client, msg:Message, args:string[], db:Db) => {
    let user = await db.collection('user').findOne({ '_id': { $eq: msg.author.id } });
    let level = utils.levelInfo(user.exp)
};

module.exports.help = {
    name: 'color',
    usage: "?color [color id]",
    desc: "Choose your username color"
};