import { Client, Message, Collection } from 'discord.js';
import { Db } from 'mongodb';
const utils = require('../js/utilities')

let admin = {
    "embed": {
      "title": "**❯ Admin**",
      "description": "`?sleep`\n`?resetbd (UID)`\n`?resetfc (UID)`\n`?read`",
      "color": 13632027
    }
  }

let mod = {
    "embed": {
      "title": "**⚔️ Mods**",
      "description": "`?forceskip`\n`?bulk (amount of messages to delete)`\n`?mute (mention someone) (length in minutes)`",
      "color": 4886754
    }
  }

let member = {
    "embed": {
      "title": "__**Commands**__",
      "description": "Prefix : `?`\nUse `?help (command)` to have more info about a specific command",
      "color": 3852663,
      "fields": [
        {
            "name": "**👤 Profile**",
            "value": "`profile` `setbirthday` `setfc` `becomefan` `leavefan` `fc`"
        },
        {
            "name": "**💕 Actions**",
            "value": "`pat` `hug` `boop` `slap`"
        },
        {
            "name": "**🕹 Games**",
            "value": "`roll` `8ball` `flip` `rps`"
        },
        {
            "name": "**💩 Memes**",
            "value": "`sonicsays`"
        },
        {
            "name": "**🎶 Music** (only usable in #radio-lounge)",
            "value": "`play` `remove` `queue` `skip` `clear` `stop` `leave` `loop` `nowplaying`"
        },
        {
            "name": "**🛠 Utility**",
            "value": "`ping` `pong` `help` `info` `leaderboard` `lead` `role` `anime` `manga` `boostcolor` `thanksiwa`"
        },
      ]
    }
  }

module.exports.run = async (bot:Client, msg:Message, args:string[], db:Db, commands:Collection<any, any>) => {
    if(args.length == 1) {
        let cmd = commands.get(args[0]);
        if (!cmd || !cmd.help.usage) return;
        else {
            await msg.channel.send("`Syntax : ( ) is needed argument, [ ] is optional argument`")
            return await msg.channel.send(`\`\`\`markdown\n< ${cmd.help.name} >\n\n# Usage\n${cmd.help.usage}\n\n# Description\n${cmd.help.desc}\`\`\``);
        }
    } else
        sendHelp(msg);
    console.log(`info: help sent to ${msg.author.tag}`)
}

module.exports.help = {
    name: 'help',
    usage: "?help",
    desc: "Well... Obviously it send you the list of the commands"
};

async function sendHelp(msg:Message) {
    if (msg.author.id == process.env.IWA)
        try {
            await msg.author.send(member)
            await msg.author.send(mod)
            await msg.author.send(admin)
        } catch(ex) {
            console.log(ex)
            return msg.channel.send(":x: > **Please open your DM, I can't reach you** <:sad_onigiri:610476938955456532>")
        }
    else if (utils.isMod(msg) == true || msg.author.id == process.env.QUMU)
        try {
            await msg.author.send(member)
            await msg.author.send(mod)
        } catch(ex) {
            console.log(ex)
            return msg.channel.send(":x: > **Please open your DM, I can't reach you** <:sad_onigiri:610476938955456532>")
        }
    else
        return await msg.channel.send(member)
}