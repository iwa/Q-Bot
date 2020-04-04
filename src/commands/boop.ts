import { Client, Message } from 'discord.js'
import { Db } from 'mongodb'
const actions = require('../js/actions')

module.exports.run = (bot:Client, msg:Message, args:string[], db:Db) => {
    actions.run(bot, msg, args, db, 'boop');
};

module.exports.help = {
    name: 'boop',
    usage: "?boop (mention someone) [someone else]",
    desc: "Boop people by mentioning them"
};