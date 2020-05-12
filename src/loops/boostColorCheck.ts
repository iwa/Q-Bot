import { Client } from 'discord.js';

export default async function boostColorCheck (bot:Client) {
    let guild = bot.guilds.cache.find(val => val.id == process.env.GUILDID)

    guild.members.cache.forEach(async elem => {
        if(elem.roles.cache.find(val => val.id == process.env.BOOSTCOLOR) && !(elem.roles.cache.find(val => val.id == process.env.BOOSTROLE))) {
            await elem.roles.remove(process.env.BOOSTCOLOR);
        }
    });
}