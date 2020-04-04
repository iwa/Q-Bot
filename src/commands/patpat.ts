import { Client, Message } from 'discord.js'
import { Db } from 'mongodb'
const actions = require('../js/actions')

module.exports.run = (bot:Client, msg:Message, args:string[], db:Db) => {
    actions.run(bot, msg, args, db, 'pat');
};

module.exports.help = {
    name: 'patpat',
    usage: "?patpat (mention someone) [someone else]",
    desc: "Pat people by mentioning them\n(alias of ?pat)"
};