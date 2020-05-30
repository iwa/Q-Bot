// Hy~ here! This is an alias of the ?tronky command, so the following code just calls the command when ?givetronky is used

import { Client, Message } from 'discord.js'
// mongodb isn't required so no import here

const tronky = require('./tronky'); // require the tronky.ts file

module.exports.run = async (bot: Client, msg: Message, args: string[]) => {
    tronky.run(bot, msg, args); // run the command like you would run if you typed ?tronky
};

module.exports.help = { // info to show in help
    name: 'givetronky',
    usage: "?givetronky (mention someone)",
    desc: "Give people tronkys. Alias of `?tronky`."
};