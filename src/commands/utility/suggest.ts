import { Client, Message, MessageEmbed, TextChannel, MessageAttachment } from 'discord.js'

module.exports.run = async (bot: Client, msg: Message, args: string[]) => {
    if (args.length < 1) return;
    let req = args.join(' ');
    let channel = await bot.channels.fetch(process.env.SUGGESTIONTC);

    let embed = new MessageEmbed();
    if(msg.attachments.first()) {
        await download(msg.attachments.first().proxyURL, `download/${msg.attachments.first().name}`);
        await uploadFile(`${msg.attachments.first().name}`).catch(console.error);
        embed.setThumbnail(`https://cdn.iwa.sh/attachment/${msg.attachments.first().name}`);
        req = `${req}\n\n[📂attachment link](https://cdn.iwa.sh/attachment/${msg.attachments.first().name})`
    }
    embed.setDescription(req);
    embed.setAuthor(msg.author.username, msg.author.avatarURL({ format: 'png', dynamic: false, size: 128 }))

    await msg.delete();
    let sent = await (channel as TextChannel).send(embed);

    let embed2 = sent.embeds[0];
    embed2.setFooter(sent.id);

    await sent.edit(embed2);

    await sent.react('✅');
    await sent.react('❌');
    return sent.react('👀');
};

module.exports.help = {
    name: 'suggest',
    usage: "?suggest (suggestion)",
    desc: "Push a suggestion into the #suggestion-box"
};

const fs = require('fs');
const request = require('request');

async function download(uri: any, filename: any) {
    let bar = new Promise((resolve, reject) => {
        request.head(uri, function(err: any, res: { headers: { [x: string]: any; }; }, body: any) {
            request(uri).pipe(fs.createWriteStream(filename)).on('close', () => { resolve() });
        });
    });
    return bar;
};

const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

async function uploadFile(filename: string) {
    await storage.bucket('cdn.iwa.sh').upload(`download/${filename}`, {
        gzip: false,
        destination: `attachment/${filename}`,
    });
}