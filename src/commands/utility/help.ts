import { Client, Message, Collection, MessageEmbed } from 'discord.js';
import { Db } from 'mongodb';
import utilities from '../../utils/utilities'
let commands = new Map();
let member = new MessageEmbed();
let mod: MessageEmbed;

import * as fs from 'fs';

readDirs()
setTimeout(() => {
    member.setTitle("__**Commands**__")
    member.setDescription("Prefix : `?`\nUse `?help (command)` to have more info about a specific command")
    member.setColor(3852663)
    member.addFields([
        {
            "name": "**👤 Profile**",
            "value": commands.get("profile")
        },
        {
            "name": "**💕 Actions**",
            "value": commands.get("actions")
        },
        {
            "name": "**🕹 Games**",
            "value": commands.get("games")
        },
        {
            "name": "**💩 Memes**",
            "value": commands.get("memes")
        },
        {
            "name": "**🎶 Music** (only usable in #radio-lounge)",
            "value": commands.get("music")
        },
        {
            "name": "**🛠 Utility**",
            "value": commands.get("utility")
        },
    ])

    mod = new MessageEmbed(member);
    mod.addField("**⚔️ Staff**", "`?forceskip`\n`?mute (mention someone) (length, eg. '5d 1h 20m 35s')`\n`?approve (suggestion ID) [reason]`\n`?implemented (suggestion ID)`\n`?consider (suggestion ID) [reason]`\n`?deny (suggestion ID) [reason]`")
}, 5000)

module.exports.run = async (bot: Client, msg: Message, args: string[], db: Db, commands: Collection<any, any>) => {
    if (args.length == 1) {
        let cmd = commands.get(args[0]);
        if (!cmd || !cmd.help.usage) return;
        if (cmd.help.staff && !msg.member.hasPermission('MANAGE_GUILD')) return;

        await msg.channel.send("`Syntax : ( ) is needed argument, [ ] is optional argument`")
        return msg.channel.send(`\`\`\`markdown\n< ${cmd.help.name} >\n\n# Usage\n${cmd.help.usage}\n\n# Description\n${cmd.help.desc}\`\`\``);
    } else
        sendHelp(msg);
    console.log(`info: help sent to ${msg.author.tag}`)
}

module.exports.help = {
    name: 'help',
    usage: "?help",
    desc: "Well... Obviously it sends you the list of the commands"
};

async function sendHelp(msg: Message) {
    if (utilities.isMod(msg) == true || msg.author.id == process.env.QUMU || msg.author.id == process.env.IWA)
        try {
            await msg.author.send(mod)
        } catch (ex) {
            return msg.channel.send(":x: > **Please open your DMs, I can't reach you** <:sad_onigiri:610476938955456532>")
        }
    else
        try {
            await msg.channel.send(member)
        } catch {
            return msg.channel.send(":x: > **Commands list loading, redo the commands in a few seconds!**")
        }
}

async function readDirs() {
    fs.readdir('./build/commands/', { withFileTypes: true }, async (error, f) => {
        if (error) return console.error(error);
        f.forEach((f) => {
            if (f.isDirectory()) {
                fs.readdir(`./build/commands/${f.name}/`, async (error, fi) => {
                    if (error) return console.error(error);
                    let string: string = "";
                    fi.forEach(async (fi) => {
                        string = `${string}\`${fi.slice(0, -3)}\` `;
                    })
                    commands.set(f.name, string);
                })
            }
        });
    });
}
