import { Client, Message } from 'discord.js'
const staff = require('../js/staff')

module.exports.run = (bot:Client, msg:Message) => {
    staff.sleep(bot, msg);
};

module.exports.help = {
    name: 'sleep'
};