import { Client, Message } from 'discord.js'
import { Db } from 'mongodb'
const actions = require('../js/actions')

module.exports.run = (bot:Client, msg:Message, args:string[], db:Db) => {
    actions.run(msg, args, db, 'slap');
};

module.exports.help = {
    name: 'slap',
    usage: "?slap (mention someone) [someone else]",
    desc: "Slap people by mentioning them"
};