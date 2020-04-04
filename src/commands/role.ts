import { Client, Message } from 'discord.js'
const utils = require('../js/utilities')

module.exports.run = (bot:Client, msg:Message, args:string[]) => {
    utils.role(msg, args);
};

module.exports.help = {
    name: 'role',
    usage: "?role (join | leave) (game)",
    desc: "Join or leave games-related roles :\nmariokart, smash, splatoon, mariomaker, pokemon, minecraft, terraria"
};