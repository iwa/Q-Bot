import { Client, Message } from 'discord.js'
import { Db } from 'mongodb'
const actions = require('../js/actions')

module.exports.run = (bot:Client, msg:Message, args:string[], db:Db) => {
    actions.run(msg, args, db, 'pat');
};

module.exports.help = {
    name: 'pat',
    usage: "?pat (mention someone) [someone else]",
    desc: "Pat people by mentioning them"
};