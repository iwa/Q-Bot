import { Client, Message, MessageEmbed } from 'discord.js'
const al = require('anilist-node');
const Anilist = new al();

module.exports.run = (bot:Client, msg:Message, args:string[]) => {
    if(args.length < 1)return;
    var req = args.join(' ');
    Anilist.search('anime', req, 1, 1).then(async (data: { media: any[]; }) => {
        var res = data.media[0];
        var info = await Anilist.media.anime(res.id)
        const embed = new MessageEmbed();
        embed.setTitle(`**${info.title.romaji} / ${info.title.english}**`)
        embed.setThumbnail(info.coverImage.large)
        embed.addField("Status", info.status, true)
        if(info.episodes != null)
            embed.addField("Episodes", info.episodes, true)
        embed.addField("Format", info.format, true)
        embed.addField("Duration per ep", `${info.duration}min`, true)
        embed.addField("Started on", `${info.startDate.year}/${info.startDate.month}/${info.startDate.day}`, true)
        if(info.endDate.day != null)
            embed.addField("Ended on", `${info.endDate.year}/${info.endDate.month}/${info.endDate.day}`, true)
        embed.addField("Genres", info.genres, false)
        var desc = await info.description.replace(/<br>/gm, '');
        if(desc.length >= 1024)
            desc = desc.substring(0, 1023)
        embed.addField("Description", desc, false)
        embed.setColor('BLUE')
        console.log(`info: anime request : ${req} by ${msg.author.tag}`)
        return msg.channel.send(embed)
    }).catch((err: any) => {
        console.error(err)
        return msg.channel.send({'embed': { 'title': ":x: > **An error occured, please retry later.**" }})
    });
};

module.exports.help = {
    name: 'anime',
    usage: "?anime (title)",
    desc: "Get some info about an anime series."
};