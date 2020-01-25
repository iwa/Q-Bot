const Discord = require('discord.js')
const YoutubeStream = require('ytdl-core')
const fs = require('fs')

let config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'))

let TC = config.musicTC;
let VC = config.musicVC;

var queue = [];
var title = [];
var length = [];

var skipReq = 0;
var skippers = [];

var loop = 0, volume = 1;

module.exports = class music {

    static async play (msg, yt, cont) {

        if(msg.channel.type != "text" || msg.channel.id != TC)return;

        if(!cont[1])return;

        let voiceChannel = msg.guild.channels.find(val => val.id == VC)

        if(voiceChannel == null)return;

        if(!voiceChannel.members.find(val => val.id == msg.author.id)) { return msg.channel.send(":x: > **You need to be connected in the voice channel before I join it !**") }

        let video_url = cont[1].split('&')

        var error, data;

        if(video_url[0].match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {

            const playlist = await yt.getPlaylistByUrl(video_url[0]).catch(console.error)

            var reply = await msg.channel.send("Are you sure you want to add all the videos of __" + playlist.title + "__ to the queue ? *(**" + playlist.data.contentDetails.itemCount + "** videos)*")
            await reply.react('✅');
            await reply.react('❌');

            var collected = await reply.awaitReactions((_reaction, user) => user.id == msg.author.id, { time: 10000 })

            if(collected.first() == undefined) {
                reply.delete()
                return msg.channel.send(":x: > **You didn't choose anything, request cancelled...**")
            }
            if(collected.find(val => val.emoji.name == '✅') && collected.find(val => val.emoji.name == '❌')) {
                reply.delete()
                return msg.channel.send(":x: > **You must choose only one of both reactions !**")
            }

            var emote = collected.first().emoji.name

            if(emote == '❌')return;
            if(emote != '✅')return;

            reply.delete()
            const embed = new Discord.RichEmbed();
            embed.setTitle("Adding all the playlist's videos to the queue...")
            embed.setFooter("Added by " + msg.author.username)
            embed.setColor('LUMINOUS_VIVID_PINK')
            msg.channel.send(embed)

            const videos = await playlist.fetchVideos();
            var errors = 0;

            for(const video of Object.values(videos)) {
                const url = video.url
                error = false;
                if(queue.indexOf(url) == -1) {
                    data = await YoutubeStream.getInfo(url).catch(() => { error = true; errors++; })
                    if(!error) {
                        queue.push(url)
                        title.push(Discord.escapeMarkdown(data.title))
                        length.push(data.length_seconds)
                    }
                }
            }

            const embedDone = new Discord.RichEmbed();
            embedDone.setTitle("**Done !**")
            embedDone.setColor('LUMINOUS_VIVID_PINK')

            if(errors > 0) embedDone.setDescription("Some videos are unavailable yet :(");

            msg.channel.send(embedDone)

            if(!voiceChannel.connection) {
                try {
                    const voiceConnection = voiceChannel.join();
                    playSong(msg, voiceConnection, voiceChannel, Discord);
                }
                catch(ex) {
                    console.error(ex)
                }
            }

            return;

        }

        if(YoutubeStream.validateURL(video_url[0])) {

            msg.channel.startTyping()
            error = false;

            if(queue.indexOf(video_url[0]) == -1) {
                data = await YoutubeStream.getInfo(video_url[0]).catch(() => { error = true; })
                if(!error) {
                    queue.push(video_url[0])
                    title.push(Discord.escapeMarkdown(data.title))
                    length.push(data.length_seconds)
                }
            } else {
                msg.channel.stopTyping()
                return msg.channel.send(":x: > **This video is already in the queue !**")
            }

            if(error) {
                msg.channel.stopTyping()
                return msg.channel.send(":x: > **This video is unavailable.**")
            }

            if(voiceChannel.connection) {
                const embed = new Discord.RichEmbed();
                embed.setAuthor('Successfully added to the queue :', msg.author.avatarURL);
                embed.setDescription("**" + data.title + "**")
                embed.setFooter("Added by " + msg.author.username)
                embed.setColor('LUMINOUS_VIVID_PINK')
                msg.channel.stopTyping()
                msg.channel.send(embed)
                console.log(`info: add to queue: ${msg.author.tag} added ${data.title}`)
            }
            else {
                msg.channel.stopTyping()
                try {
                    const voiceConnection = voiceChannel.join();
                    playSong(msg, voiceConnection, voiceChannel, Discord);
                }
                catch(ex) {
                    console.error(ex)
                }
            }
        } else {
            cont.shift()
            let keywords = cont.join(' ')

            var video = await yt.searchVideos(keywords, 1).then(data => {
                return data[0].url
            })

            if(!YoutubeStream.validateURL(video))return;

            msg.channel.startTyping();
            error = false;

            if(queue.indexOf(video) == -1) {
                data = await YoutubeStream.getInfo(video).catch(() => { error = true; })
                if(!error) {
                    queue.push(video)
                    title.push(Discord.escapeMarkdown(data.title))
                    length.push(data.length_seconds)
                }
            } else {
                msg.channel.stopTyping()
                return msg.channel.send(":x: > **This video is already in the queue !**")
            }

            if(error) {
                msg.channel.stopTyping()
                return msg.channel.send(":x: > **This video is unavailable.**")
            }

            if(voiceChannel.connection) {
                const embed = new Discord.RichEmbed();
                embed.setAuthor('Successfully added to the queue :', msg.author.avatarURL);
                embed.setDescription("**" + data.title + "**")
                embed.setFooter("Added by " + msg.author.username)
                embed.setColor('LUMINOUS_VIVID_PINK')
                msg.channel.stopTyping()
                msg.channel.send(embed)
                console.log(`info: add to queue: ${msg.author.tag} added ${data.title}`)
            }
            else {
                msg.channel.stopTyping()
                try {
                    const voiceConnection = voiceChannel.join();
                    playSong(msg, voiceConnection, voiceChannel, Discord);
                }
                catch(ex) {
                    console.error(ex)
                }
            }
        }

    }

    static remove (msg, cont) {

        if(msg.channel.type != "text" || msg.channel.id != TC)return;

        var queueID = cont[1]

        if(isNaN(queueID)) return;

        const embed = new Discord.RichEmbed();
        embed.setColor('GREEN')
        embed.setAuthor('Removed from the queue :', msg.author.avatarURL);
        embed.setDescription(`**${title[queueID]}**`)
        embed.setFooter(`Removed by ${msg.author.username}`)

        msg.channel.send(embed)

        console.log(`info: remove from queue: ${msg.author.tag} removed ${title[queueID]}`)

        queue.splice(queueID, 1)
        title.splice(queueID, 1)

    }

    static list (msg, cont) {

        if(msg.channel.type != "text" || msg.channel.id != TC)return;

        if(cont.length > 1)return;

        if(queue.length < 0)return;

        msg.channel.startTyping();

        const embed = new Discord.RichEmbed();
        embed.setColor('GREEN')

        if(queue.length <= 1)
            embed.setTitle("**:cd: The queue is empty**")
        else {
            embed.setTitle("**:cd: Here's the queue**")

            queue.forEach(async (item, index) => {

                if(index == 0 || index > 10)return;

                var date = new Date(null)
                date.setSeconds(length[index])
                var timeString = date.toISOString().substr(11, 8)

                embed.addField(index + " : **" + title[index] + "**, *" + timeString + "*", item)

            })

        }

        if (queue.length > 10) embed.setFooter(`and ${(queue.length - 10)} more...`)
        msg.channel.stopTyping(true);
        msg.channel.send(embed);

        console.log(`info: show queue by ${msg.author.tag}`)

    }

    static skip (msg, bot) {

        if(msg.channel.type != "text" || msg.channel.id != TC)return;

        let voiceChannel = msg.guild.channels.find(val => val.id == VC)

        let voiceConnection = bot.voiceConnections.find(val => val.channel.id == VC);
        if(!voiceConnection) {
            const embed = new Discord.RichEmbed();
            embed.setColor('RED')
            embed.setTitle("The bot is not playing")
            return msg.channel.send(embed);
        }

        if(skippers.indexOf(msg.author.id) == -1) {
            skippers.push(msg.author.id);
            skipReq++;

            const embed = new Discord.RichEmbed();
            embed.setColor('GREEN')
            embed.setAuthor("Your voteskip has been registered !", msg.author.avatarURL)
            msg.channel.send(embed)

            console.log(`info: voteskip by ${msg.author.tag}`)

            if(skipReq >= Math.ceil((voiceChannel.members.size - 1) / 2)) {
                let dispatcher = voiceConnection.dispatcher
                const embed = new Discord.RichEmbed();
                embed.setColor('GREEN')
                embed.setTitle("Half of the people have voted, skipping...")
                msg.channel.send(embed)
                loop = 0;
                dispatcher.end()
                console.log(`musc: skipping song`)
            } else {
                const embed = new Discord.RichEmbed();
                embed.setColor('BRIGHT_RED')
                embed.setTitle("You need **" + (Math.ceil((voiceChannel.members.size - 1) / 2) - skipReq) + "** more skip vote to skip !")
                msg.channel.send(embed)
            }
        } else {
            const embed = new Discord.RichEmbed();
            embed.setColor('RED')
            embed.setTitle("You already voted for skipping !")
            msg.channel.send(embed)

        }

    }

    static clear (msg) {

        if(msg.channel.type != "text" || msg.channel.id != TC)return;

        queue = [];
        title = [];
        length = [];

        const embed = new Discord.RichEmbed();
        embed.setAuthor("You've successfully cleared the queue.", msg.author.avatarURL);
        embed.setColor('GREEN')
        msg.channel.send(embed)

        console.log(`musc: clear queue by ${msg.author.tag}`)

    }

    static stop (msg) {

        if(msg.channel.type != "text" || msg.channel.id != TC)return;

        let voiceChannel = msg.guild.channels.find(val => val.id == VC)

        queue = [];
        title = [];
        length = [];

        voiceChannel.leave()

        console.log(`musc: stop by ${msg.author.tag}`)

    }

    static forceskip (msg, bot) {

        if(msg.channel.type != "text" || msg.channel.id != TC)return;

        let voiceConnection = bot.voiceConnections.find(val => val.channel.id == VC);
        if(!voiceConnection) {
            const embed = new Discord.RichEmbed();
            embed.setColor('RED')
            embed.setTitle("The bot is not playing")
            return msg.channel.send(embed);
        }

        let dispatcher = voiceConnection.dispatcher

        const embed = new Discord.RichEmbed();
        embed.setColor('GREEN')
        embed.setAuthor("Forced skip...", msg.author.avatarURL);
        msg.channel.send(embed)
        loop = 0;

        dispatcher.end()

        return console.log(`musc: forceskip by ${msg.author.tag}`)
    }

    static loop (msg) {

        if(msg.channel.type != "text" || msg.channel.id != TC)return;

        if(loop == 0) {
            loop = 1
            console.log(`info: loop enabled by ${msg.author.tag}`)
            const embed = new Discord.RichEmbed();
            embed.setAuthor("Looping the current song...", msg.author.avatarURL);
            embed.setColor('GREEN')
            return msg.channel.send(embed)
        }
        else if (loop == 1) {
            loop = 0
            console.log(`info: loop disabled by ${msg.author.tag}`)
            const embed = new Discord.RichEmbed();
            embed.setAuthor("This song will no longer be looped...", msg.author.avatarURL);
            embed.setColor('GREEN')
            return msg.channel.send(embed)
        }
    }

    static np (msg, bot) {

        if(msg.channel.type != "text" || msg.channel.id != TC)return;

        let voiceConnection = bot.voiceConnections.find(val => val.channel.id == VC);
        if(!voiceConnection) {
            const embed = new Discord.RichEmbed();
            embed.setColor('RED')
            embed.setTitle("The bot is not playing")
            return msg.channel.send(embed);
        }

        var date = new Date(null)
        date.setSeconds(length[0])
        var timeString = date.toISOString().substr(11, 8)
        const embed = new Discord.RichEmbed();
        embed.setColor('GREEN')
        embed.setTitle("**:cd: Now Playing :**")

        var desc = "[" + title[0] + "](" + queue[0] + ")";
        if(loop == 1) desc += "\nCurrently looping this song - type `?loop` to disable it";
        embed.setDescription(desc)

        embed.setFooter("Length : " + timeString)
        msg.channel.send(embed)

        console.log(`info: nowplaying by ${msg.author.tag}`)
    }
}


async function playSong (msg, voiceConnection, voiceChannel) {

    const video = YoutubeStream(queue[0], {filter: "audioonly", quality: "highestaudio"});

    video.on('error', () => {
        return msg.channel.send(":x: > **There was an unexpected error with the video, please retry later**")
    })

    voiceConnection.then(connection => {

        connection.playStream(video, {volume : volume, bitrate : 96000}).on('start', () => {
            if(loop == 0) {
                var date = new Date(null)
                date.setSeconds(length[0])
                var timeString = date.toISOString().substr(11, 8)
                const embed = new Discord.RichEmbed();
                embed.setColor('GREEN')
                embed.setTitle("**:cd: Now Playing :**")
                embed.setDescription("[" + title[0] + "](" + queue[0] + ")")
                embed.setFooter("Length : " + timeString)

                msg.channel.send(embed)
                console.log(`musc: playing: ${title[0]}`)
            }
        }).on('end', () => {

            if(loop == 0) {
                queue.shift()
                title.shift()
                length.shift()
            }

            if(queue.length == 0) {
                const embed = new Discord.RichEmbed();
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

    })
}
