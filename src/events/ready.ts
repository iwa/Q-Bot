/**
 * 'Ready' function executed every times the bot logs in
 * @packageDocumentation
 * @module ReadyFunction
 * @category Events
 */
import { Client } from 'discord.js';
import {  Db } from 'mongodb';

/**
 * - Sets bot activity
 * - Cache all messages needed for Reaction Roles system
 * @param {Client} bot - Discord Client object
 */
export default async function ready(bot: Client, db: Db) {
    await bot.user.setActivity("Qumu's Remixes | ?help", { type: 2 }).catch(console.error);
    await bot.user.setStatus("online").catch(console.error)

    let allMsg = db.collection('msg').find()
    allMsg.forEach(async elem => {
        let channel: any = await bot.channels.fetch(elem.channel)
        await channel.messages.fetch(elem._id, true)
    });
}