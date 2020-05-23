/**
 * Starboard class containing methods needed to run a Starboard channel
 * @packageDocumentation
 * @module Starboard
 * @category Events
 */
import { Client, Message, MessageReaction, User } from "discord.js";

export default class starboard {

    /**
     * Sends the message to the Starboard channel
     * @param {Client} bot - Discord Client object
     * @param {Message} msg - Message object
     * @param {MessageReaction} reaction - Reaction object
     * @param {string} content - Content of the message that'll be posted to the Starboard
     */
    static async send (bot:Client, msg:Message, reaction:MessageReaction, content:string):Promise<void> {
        let channel:any = bot.channels.cache.find(val => val.id == process.env.STARBOARDTC);
        await msg.react(reaction.emoji.name);
        await channel.send({
            "embed": {
              "description": `${content}[message link✉️](${msg.url})`,
              "color": 14212956,
              "timestamp": msg.createdTimestamp,
              "footer": {
                "text": "New starboard entry ⭐️"
              },
              "author": {
                "name": msg.author.username,
                "icon_url": msg.author.avatarURL({ format: 'png', dynamic: false, size: 128 })
              }
            }
          });
        console.log(`info: new message into starboard (author: ${msg.author.tag})`);
    }

    /**
     * Checks every message reacted with a star emoji
     * @param {MessageReaction} reaction - Reaction object
     * @param {User} author - Author Object
     * @param {Client} bot - Discord Client object
     */
    static async check (reaction:MessageReaction, author:User, bot:Client) {
        if(reaction.message.guild.id !== process.env.GUILDID)return;
        if(reaction.message.channel.id == process.env.STARBOARDTC)return;
        if(reaction.message.channel.id == process.env.ANNOUNCEMENTSTC)return;
        if(reaction.users.cache.find(val => val.id == bot.user.id))return;
        if(reaction.emoji.name == '⭐') {
            if(reaction.count >= 5) {
                let msg = reaction.message;
                let content;
                if(!msg.cleanContent)
                    content = "*attachment only*\n"
                else
                    content = `\`\`\`${msg.cleanContent}\`\`\``

                return starboard.send(bot, msg, reaction, content);
            }
        } else if(reaction.emoji.name == '🌟' && author.id == process.env.IWA) {
            let msg = reaction.message;
            let content;
            if(!msg.cleanContent)
                content = "*attachment only*\n"
            else
                content = `\`\`\`${msg.cleanContent}\`\`\``

            return starboard.send(bot, msg, reaction, content);
        }
    }
}