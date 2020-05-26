/**
 * Functions related to leveling up
 * @packageDocumentation
 * @module Leveling
 * @category Utils
 */
import * as Discord from "discord.js";
import * as ejs from 'ejs';

/** @desc Object containing infos about levels (ids, exp amounts, ...) */
const levels = require('../../lib/levels.json');
import imGenerator from './img'

export default class leveling {

    /**
     * Checks if the user has leveled up.
     * If so, the bot gives the new level role and removes the old one
     * @param msg - Message object
     * @param xp - The amount of exp of the user
     */
    static async levelCheck (msg:Discord.Message, xp:number) {
        for(let i = 1; i <= 20; i++) {
            if(xp == levels[i].amount) {
                if(i != 1)
                    await msg.member.roles.remove(levels[i-1].id).catch(console.error);
                await msg.member.roles.add(levels[i].id).catch(console.error);
                return leveling.imageLvl(msg, i);
            }
        }
    }

    /**
     * Sends the 'level up' image into the same channel
     * that made the user level up
     * @param msg - Message object
     * @param level - Level number of the user
     */
    static async imageLvl (msg:Discord.Message, level:number) {
        let avatarURL = msg.author.avatarURL({ format: 'png', dynamic: false, size: 512 })
        let cdnUrl = process.env.CDN_URL;

        let html = await ejs.renderFile('views/level.ejs', { avatarURL, level, cdnUrl });
        let file = await imGenerator(808, 208, html, msg.author.id, 'lvl')

        try {
            await msg.reply('', {files: [file]})
        } catch(err) {
            console.error(err)
            return msg.reply(`You're now level ${level} ! Congrats !`)
        }
    }
}
