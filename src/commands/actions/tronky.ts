import { Client, Message } from 'discord.js'
import { Db } from 'mongodb'
import actionsRun from '../../utils/actions';

module.exports.run = (bot:Client, msg:Message, args:string[], db:Db) => {
    actionsRun(bot, msg, args, db, 'tronky');
};

module.exports.help = {
    name: 'tronky',
    usage: "?tronky (mention someone) [someone else]",
    desc: "Give people tronkys"
};