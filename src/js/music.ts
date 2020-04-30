import { Client, Message, MessageEmbed, Util, VoiceChannel, VoiceConnection } from 'discord.js';
import * as YoutubeStream from 'ytdl-core';
const { YouTube } = require('popyt')
const yt = new YouTube(process.env.YT_TOKEN)
const utils = require('./utilities')

let TC = process.env.MUSICTC;
let VC = process.env.MUSICVC;

let queue:string[] = [], title:string[] = [], length:string[] = [], skippers:string[] = [];
let skipReq = 0, loop = 0;

module.exports = class music {

    static async play (bot:Client, msg:Message, args:string[]) {
        if(msg.channel.type != "text" || msg.channel.id != TC)return;

        if(!args[0])return;

        let voiceChannel:any = msg.guild.channels.cache.find(val => val.id == VC)
        if(voiceChannel == null)return;
        if(!voiceChannel.members.find((val:any) => val.id == msg.author.id)) return msg.channel.send(":x: > **You need to be connected in the voice channel before I join it !**")

        let video_url = args[0].split('&')

        var error, data;

        if(video_url[0].match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {

            const playlist = await yt.getPlaylistByUrl(video_url[0]).catch(console.error)

            var reply = await msg.channel.send(":warning: Are you sure you want to add all the videos of __" + playlist.title + "__ to the queue ? *(**" + playlist.data.contentDetails.itemCount + "** videos)*")
            await reply.react('✅');
            await reply.react('❌');

            var collected = await reply.awaitReactions((_reaction, user) => user.id == msg.author.id, { time: 10000 })

            if(collected.first() == undefined) {
                reply.delete()
                return msg.channel.send(":x: > **You didn't choose anything, request cancelled...**")
            }
            if(collected.find(val => val.emoji.name == '✅') && collected.find(val => val.emoji.name == '❌')) {
                reply.delete()
                return msg.channel.send(":x: > **You must choose only one of both reactions!**")
            }

            var emote = collected.first().emoji.name

            if(emote == '❌')return;
            if(emote != '✅')return;

            reply.delete()
            const embed = new MessageEmbed();
            embed.setTitle("Adding all the playlist's videos to the queue...")
            embed.setFooter(`Added by ${msg.author.username}`)
            embed.setColor('LUMINOUS_VIVID_PINK')
            msg.channel.send(embed)

            const videos = await playlist.fetchVideos();
            var errors = 0;

            videos.forEach(async (video:any) => {
                const url:any = video.url
                error = false;
                if(queue.indexOf(url) == -1) {
                    data = await YoutubeStream.getInfo(url).catch(() => { error = true; errors++; })
                    if(!error && data) {
                        queue.push(url)
                        title.push(Util.escapeMarkdown(data.title))
                        length.push(data.length_seconds)
                    }
                }
            });

            const embedDone = new MessageEmbed();
            embedDone.setTitle("**Done!**")
            embedDone.setColor('LUMINOUS_VIVID_PINK')

            if(errors > 0) embedDone.setDescription("Some videos are unavailable :(");

            msg.channel.send(embedDone)

            let connection:null | VoiceConnection = bot.voice.connections.find(val => val.channel.id == voiceChannel.id);

            if(!connection) {
                try {
                    const voiceConnection = voiceChannel.join();
                    playSong(msg, voiceConnection, voiceChannel);
                }
                catch(ex) {
                    console.error(ex)
                }
            }
            return;
        }

        if(YoutubeStream.validateURL(video_url[0])) {
            launchPlay(msg, voiceChannel, video_url[0], data)
        } else {
            let keywords = args.join(' ')

            var video = await yt.searchVideos(keywords, 1).then((data:any) => {
                return data.results[0].url
            })

            if(!YoutubeStream.validateURL(video))return;

            launchPlay(msg, voiceChannel, video, data)
        }
    }

    static remove (msg:Message, args:string[]) {
        if(msg.channel.type != "text" || msg.channel.id != TC)return;

        var queueID:number = parseInt(args[0]);

        if(isNaN(queueID)) return;

        const embed = new MessageEmbed();
        embed.setColor('GREEN')
        embed.setAuthor('Removed from the queue:', msg.author.avatarURL({ format: 'png', dynamic: false, size: 128 }));
        embed.setDescription(`**${title[queueID]}**`)
        embed.setFooter(`Removed by ${msg.author.username}`)

        msg.channel.send(embed)

        console.log(`musc: remove from queue: ${msg.author.tag} removed ${title[queueID]}`)

        queue.splice(queueID, 1)
        title.splice(queueID, 1)
    }

    static list (msg:Message, args:string[]) {
        if(msg.channel.type != "text" || msg.channel.id != TC)return;
        if(args.length > 0)return;
        if(queue.length < 0)return;

        msg.channel.startTyping();

        const embed = new MessageEmbed();
        embed.setColor('GREEN')

        if(queue.length <= 1)
            embed.setTitle("**:cd: The queue is empty.**")
        else {
            embed.setTitle("**:cd: Here's the queue:**")

            queue.forEach(async (item, index) => {
                if(index == 0 || index > 10)return;

                var date = new Date(null)
                date.setSeconds(parseInt(length[index]))
                var timeString = date.toISOString().substr(11, 8)

                embed.addField(`${index} : **${title[index]}**, *${timeString}*`, item)
            })
        }

        if (queue.length > 10) embed.setFooter(`and ${(queue.length - 10)} more...`)
        msg.channel.stopTyping(true);
        msg.channel.send(embed);

        console.log(`musc: show queue by ${msg.author.tag}`)
    }

    static async skip (bot:Client, msg:Message) {
        if(msg.channel.type != "text" || msg.channel.id != TC)return;

        let voiceChannel = msg.guild.channels.cache.find(val => val.id == VC)

        let voiceConnection = bot.voice.connections.find(val => val.channel.id == VC);
        if(!voiceConnection) {
            const embed = new MessageEmbed();
            embed.setColor('RED')
            embed.setTitle("I'm not playing anything right now!")
            return msg.channel.send(embed);
        }

        if(skippers.indexOf(msg.author.id) == -1) {
            skippers.push(msg.author.id);
            skipReq++;

            const embed = new MessageEmbed();
            embed.setColor('GREEN')
            embed.setAuthor("Your voteskip has been registered!", msg.author.avatarURL({ format: 'png', dynamic: false, size: 128 }))
            msg.channel.send(embed)

            console.log(`info: voteskip by ${msg.author.tag}`)

            if(skipReq >= Math.ceil((voiceChannel.members.size - 1) / 2)) {
                let dispatcher = voiceConnection.dispatcher
                const embed = new MessageEmbed();
                embed.setColor('GREEN')
                embed.setTitle("Half of the people have voted, skipping...")
                msg.channel.send(embed)
                loop = 0;
                dispatcher.end()
                console.log(`musc: skipping song`)
            } else {
                const embed = new MessageEmbed();
                embed.setColor('BRIGHT_RED')
                embed.setTitle("You need **" + (Math.ceil((voiceChannel.members.size - 1) / 2) - skipReq) + "** more skip vote to skip!")
                msg.channel.send(embed)
            }
        } else {
            const embed = new MessageEmbed();
            embed.setColor('RED')
            embed.setTitle("You already voted for skipping!")
            msg.channel.send(embed)
        }
    }

    static async clear (msg:Message) {
        if(msg.channel.type != "text" || msg.channel.id != TC)return;

        queue = [];
        title = [];
        length = [];

        await msg.react('✅');

        console.log(`musc: clear queue by ${msg.author.tag}`)
    }

    static async stop (msg:Message) {
        if(msg.channel.type != "text" || msg.channel.id != TC)return;

        let voiceChannel:any = msg.guild.channels.cache.find(val => val.id == VC)

        queue = [];
        title = [];
        length = [];

        await msg.react('✅');
        await voiceChannel.leave()
        console.log(`musc: stop by ${msg.author.tag}`)
    }

    static async forceskip (bot:Client, msg:Message) {
        if(utils.isMod(msg) == false || msg.author.id != process.env.IWA || msg.author.id != process.env.QUMU)return;

        if(msg.channel.type != "text" || msg.channel.id != TC)return;

        let voiceConnection = bot.voice.connections.find(val => val.channel.id == VC);
        if(!voiceConnection) {
            const embed = new MessageEmbed();
            embed.setColor('RED')
            embed.setTitle("I'm not playing anything right now!")
            return msg.channel.send(embed);
        }

        let dispatcher = voiceConnection.dispatcher

        const embed = new MessageEmbed();
        embed.setColor('GREEN')
        embed.setAuthor("Forced skip...", msg.author.avatarURL({ format: 'png', dynamic: false, size: 128 }));
        msg.channel.send(embed)
        loop = 0;

        dispatcher.end()

        return console.log(`musc: forceskip by ${msg.author.tag}`)
    }

    static loop (msg:Message) {
        if(msg.channel.type != "text" || msg.channel.id != TC)return;

        if(loop == 0) {
            loop = 1
            console.log(`info: loop enabled by ${msg.author.tag}`)
            const embed = new MessageEmbed();
            embed.setAuthor("Looping the current song...", msg.author.avatarURL({ format: 'png', dynamic: false, size: 128 }));
            embed.setColor('GREEN')
            return msg.channel.send(embed)
        }
        else if (loop == 1) {
            loop = 0
            console.log(`info: loop disabled by ${msg.author.tag}`)
            const embed = new MessageEmbed();
            embed.setAuthor("This song will no longer be looped...", msg.author.avatarURL({ format: 'png', dynamic: false, size: 128 }));
            embed.setColor('GREEN')
            return msg.channel.send(embed)
        }
    }

    static async np (msg:Message, bot:Client) {
        if(msg.channel.type != "text" || msg.channel.id != TC)return;

        let voiceConnection = bot.voice.connections.find(val => val.channel.id == VC);
        if(!voiceConnection) {
            const embed = new MessageEmbed();
            embed.setColor('RED')
            embed.setTitle("I'm not playing anything right now!")
            return msg.channel.send(embed);
        }

        var date = new Date(null)
        date.setSeconds(parseInt(length[0]))
        var timeString = date.toISOString().substr(11, 8)
        const embed = new MessageEmbed();
        embed.setColor('GREEN')
        embed.setTitle("**:cd: Now Playing:**")

        var desc = `[${title[0]}](${queue[0]})`;
        if(loop == 1) desc += "\nCurrently looping this song - type `?loop` to disable";
        embed.setDescription(desc)

        let time = new Date(voiceConnection.dispatcher.streamTime).toISOString().slice(11,19)
        embed.setFooter(`${time} / ${timeString}`)

        let infos = await yt.getVideo(queue[0]);
        let thumbnail = infos.thumbnails
        embed.setThumbnail(thumbnail.high.url)

        msg.channel.send(embed)

        console.log(`info: nowplaying by ${msg.author.tag}`)
    }

    static async pause (bot:Client, msg:Message) {
        if(msg.channel.type != "text" || msg.channel.id != TC)return;

        let dispatcher = await fetchDispatcher(bot, msg);
        dispatcher.pause(false);

        await msg.react('✅');
    }

    static async resume (bot:Client, msg:Message) {
        if(msg.channel.type != "text" || msg.channel.id != TC)return;

        let dispatcher = await fetchDispatcher(bot, msg);
        dispatcher.resume();

        await msg.react('✅');
    }
}


async function playSong (msg:Message, voiceConnection:VoiceConnection, voiceChannel:VoiceChannel) {

    const video = YoutubeStream(queue[0], {filter: "audioonly", quality: "highestaudio"});

    video.on('error', () => {
        return msg.channel.send(":x: > **There was an unexpected error with playing the video, please retry later**")
    })

    voiceConnection.play(video, {volume : 0.8, bitrate : 96000, highWaterMark: 512})
    .on('start', async () => {
        if(loop == 0) {
            var date = new Date(null)
            date.setSeconds(parseInt(length[0]))
            var timeString = date.toISOString().substr(11, 8)
            const embed = new MessageEmbed();
            embed.setColor('GREEN')
            embed.setTitle("**:cd: Now Playing:**")
            embed.setDescription(`[${title[0]}](${queue[0]})`)
            embed.setFooter(`Length : ${timeString}`)
            let infos = await yt.getVideo(queue[0]);
            let thumbnail = infos.thumbnails
            embed.setThumbnail(thumbnail.high.url)
            msg.channel.send(embed)
            console.log(`musc: playing: ${title[0]}`)
        }
    }).on('finish', () => {
        if(loop == 0) {
            queue.shift()
            title.shift()
            length.shift()
        }
        if(queue.length == 0) {
            const embed = new MessageEmbed();
            embed.setColor('GREEN')
            embed.setTitle("Queue finished. Disconnecting...")
            skipReq = 0;
            skippers = [];
            loop = 0;
            msg.channel.send(embed)
            voiceChannel.leave();
        } else {
            skipReq = 0;
            skippers = [];
            playSong(msg, voiceConnection, voiceChannel)
        }
    }).on('error', console.error);
}

async function launchPlay(msg:Message, voiceChannel:VoiceChannel, video_url:string, data:void | YoutubeStream.videoInfo) {
    msg.channel.startTyping();
    let error = false;
    if(queue.indexOf(video_url) == -1) {
        data = await YoutubeStream.getInfo(video_url).catch(() => { error = true; })
        if(!error && data) {
            queue.push(video_url)
            title.push(Util.escapeMarkdown(data.title))
            length.push(data.length_seconds)
        }
    } else {
        msg.channel.stopTyping()
        return msg.channel.send(":x: > **This video is already in the queue!**")
    }

    if(error) {
        msg.channel.stopTyping()
        return msg.channel.send(":x: > **This video is unavailable :(**")
    }

    if(queue[0] != video_url && data) {
        const embed = new MessageEmbed();
        embed.setAuthor('Successfully added to the queue:', msg.author.avatarURL({ format: 'png', dynamic: false, size: 128 }));
        embed.setDescription(`**${data.title}**`)
        embed.setFooter(`Added by ${msg.author.username}`)
        embed.setColor('LUMINOUS_VIVID_PINK')
        msg.channel.stopTyping()
        await msg.channel.send(embed)
        console.log(`musc: add to queue: ${msg.author.tag} added ${data.title}`)
    }
    else {
        msg.channel.stopTyping()
        try {
            const voiceConnection = await voiceChannel.join();
            playSong(msg, voiceConnection, voiceChannel);
        }
        catch(ex) {
            console.error(ex)
        }
    }
}

async function fetchDispatcher(bot:Client, msg:Message) {
    let voiceConnection = bot.voice.connections.find(val => val.channel.id == VC);
    if(!voiceConnection) {
        const embed = new MessageEmbed();
        embed.setColor('RED')
        embed.setTitle("I'm not playing anything right now!")
        await msg.channel.send(embed);
    } else {
        let dispatcher = voiceConnection.dispatcher;
        return dispatcher;
    }
}