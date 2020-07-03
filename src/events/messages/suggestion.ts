import { Client, Message, MessageEmbed, TextChannel, MessageAttachment } from 'discord.js'
import { Db, MongoClient } from 'mongodb';

export default async function suggestion (bot: Client, msg: Message, db: Db) {
    let req = msg.cleanContent;
    let channel = await bot.channels.fetch(process.env.SUGGESTIONTC);

    let embed = new MessageEmbed();
    if(msg.attachments.first()) {
        await msg.react('🔄');
        await download(msg.attachments.first().proxyURL, `download/${msg.attachments.first().name}`);
        await uploadFile(`${msg.attachments.first().name}`).catch(console.error);
        embed.setThumbnail(`https://cdn.iwa.sh/attachment/${msg.attachments.first().name}`);
        req = `${req}\n\n[📂attachment link](https://cdn.iwa.sh/attachment/${msg.attachments.first().name})`
    }
    embed.setDescription(req);
    embed.setAuthor(msg.author.username, msg.author.avatarURL({ format: 'png', dynamic: false, size: 128 }))

    let counter = await db.collection('suggestions').findOne({ _id: 'counter' });
    if(!counter) {
        await db.collection('suggestions').insertOne({ _id: 'counter', count: 0 });
        counter = { _id: 'counter', count: 0 };
    }

    await db.collection('suggestions').updateOne({ _id: 'counter' }, { $inc: { count: 1 }});
    embed.setFooter(`#${counter.count+1}`);

    await msg.delete();
    let sent = await (channel as TextChannel).send(embed);
    await db.collection('suggestions').insertOne({ _id: counter.count+1, msg: sent.id });

    await sent.react('✅');
    await sent.react('❌');
    return sent.react('👀');
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