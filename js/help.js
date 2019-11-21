let admin = {
    "embed": {
      "title": "**❯ Admin**",
      "description": "`link` `sleep` `stats` `del` `mod` `resetbirthday` `resetfc`",
      "color": 13632027
    }
  }

let mod = {
    "embed": {
      "title": "**⚔️ Mods**",
      "description": "`?forceskip`\n`?say (msg)`\n`?mute (mention someone) (length in minutes)`",
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
            "value": "`id` `profile` `setbirthday` `setfc` `becomefan` `leavefan`"
        },
        {
            "name": "**💕 Wholesome**",
            "value": "`patpat` `pat` `hug` `boop`"
        },
        {
            "name": "**🕹 Games**",
            "value": "`roll` `8ball` `8b` `flip` `rps`"
        },
        {
            "name": "**💩 Memes**",
            "value": "`sonicsays`"
        },
        {
            "name": "**🎶 Music**",
            "value": "`play` `remove` `queue` `q` `skip` `clear` `stop` `quit` `leave` `loop` `nowplaying` `playing` `np`"
        },
        {
            "name": "**🛠 Utility**",
            "value": "`ping` `pong` `help` `commands` `info` `leaderboard` `lead` `role` `anime` `manga` `osu`"
        },
      ]
    }
  }

module.exports = class help {

    static async action (msg, cont, author, author_id, isMod, master) {

        if(cont.length == 2) {
            var what;
            switch(cont[1]) {
                case "ping":
                case "pong":
                    what = "```markdown\n< ping >\n\n# Usage\n?ping\n\n# Aliases\npong\n\n# Description\nThis will send you the ping between Q-Bot and Discord's Servers```";
                break;

                case "id":
                    what = "```markdown\n< id >\n\n# Usage\n?id\n\n# Description\nThis will send you your Discord Unique ID```";
                break;

                case "roll":
                    what = "```markdown\n< roll >\n\n# Usage\n?roll [number]\n\n_will choose 100 if you don't precise any number_\n\n# Description\nThis will choose a number between 1 and the number you choose```";
                break;

                case "play":
                    what = "```markdown\n< play >\n\n# Usage\n?play (YouTube video / playlist link | keywords)\n\n# Description\nPlay YouTube videos in the Qumu Radio voice channel```";
                break;

                case "remove":
                    what = "```markdown\n< remove >\n\n# Usage\n?remove (id of the video in the queue)\n\n# Description\nRemove a video in the queue```";
                break;

                case "queue":
                case "q":
                    what = "```markdown\n< queue >\n\n# Usage\n?queue\n\n# Aliases\nq\n\n# Description\nShow the queue```";
                break;

                case "skip":
                    what = "```markdown\n< skip >\n\n# Usage\n?skip\n\n# Description\nVote to skip the song that's actually playing\nThe half of the people in the voice channel needs to voteskip for skipping the song```";
                break;

                case "clear":
                    what = "```markdown\n< clear >\n\n# Usage\n?clear\n\n# Description\nClear the queue```";
                break;

                case "info":
                    what = "```markdown\n< info >\n\n# Usage\n?info\n\n# Description\nShow some info about Q-Bot```";
                break;

                case "patpat":
                case "pat":
                    what = "```markdown\n< patpat >\n\n# Usage\n?patpat (mention someone)\n\n# Aliases\npat\n\n# Description\nPat someone by mention him / her```";
                break;

                case "profile":
                    what = "```markdown\n< profile >\n\n# Usage\n?profile\n\n# Description\nShow your profile```";
                break;

                case "hug":
                    what = "```markdown\n< hug >\n\n# Usage\n?hug (mention someone)\n\n# Description\nHug someone by mention him / her```";
                break;

                case "leaderboard":
                case "lead":
                    what = "```markdown\n< leaderboard >\n\n# Usage\n?leaderboard (xp | pats | hugs | boops)\n\n# Aliases\nlead\n\n# Description\nShow the leaderboard of a category :\nexperience, amount of pats given, amount of hugs given```";
                break;

                case "becomefan":
                    what = "```markdown\n< becomefan >\n\n# Usage\n?becomefan\n\n# Description\nDo this command if you want to be aware of every updates of Q-Bot```";
                break;

                case "leavefan":
                    what = "```markdown\n< leavefan >\n\n# Usage\n?leavefan\n\n# Description\nDo this command if you no longer want to be aware of every updates of Q-Bot```";
                break;

                case "stop":
                case "quit":
                case "leave":
                    what = "```markdown\n< stop >\n\n# Usage\n?stop\n\n# Aliases\nquit, leave\n\n# Description\nMake the bot stop playing music and disconnect it from the Qumu Radio```";
                break;

                case "loop":
                case "repeat":
                    what = "```markdown\n< loop >\n\n# Usage\n?loop\n\n# Aliases\nrepeat\n\n# Description\nEnable / Disable loop for the current song```";
                break;

                case "role":
                    what = "```markdown\n< role >\n\n# Usage\n?role (join | leave) (mariokart | smashbros | splatoon | mariomaker)\n\n# Description\nJoin or leave games-related roles```";
                break;

                case "8ball":
                case "8b":
                    what = "```markdown\n< 8ball >\n\n# Usage\n?8ball (your question)\n\n# Description\nLet Q-Bot reply to all your questions, with a lot of honesty```";
                break;

                case "setbirthday":
                    what = "```markdown\n< setbirthday >\n\n# Usage\n?setbirthday (your birthday, mm/dd)\n\n# Description\nRegister your birthday to Q-Bot\nPlease use this format : **mm/dd**\nThis use UTC time```";
                break;

                case "setfc":
                    what = "```markdown\n< setfc >\n\n# Usage\n?setfc (your Switch FC)\n\n# Description\nRegister your Switch Friend Code to Q-Bot\nPlease enter your FC without 'SW-' at the beginning```";
                break;

                case "osu":
                    what = "```markdown\n< osu >\n\n# Usage\n?osu (username)\n\n# Description\nShow osu standard stats of someone```";
                break;

                case "anime":
                    what = "```markdown\n< anime >\n\n# Usage\n?anime (title)\n\n# Description\nSee some info about an anime```";
                break;

                case "manga":
                    what = "```markdown\n< manga >\n\n# Usage\n?manga (title)\n\n# Description\nSee some info about a manga```";
                break;

                case "boop":
                    what = "```markdown\n< boop >\n\n# Usage\n?boop (mention someone)\n\n# Description\nBoop someone by mention him / her```";
                break;

                case "flip":
                    what = "```markdown\n< flip >\n\n# Usage\n?flip\n\n# Description\nFlip a coin```";
                break;

                case "rps":
                    what = "```markdown\n< rps >\n\n# Usage\n?rps (rock | paper | scissors)\n\n# Description\nPlay to Rock-Paper-Scissors with me```";
                break;

                case "sonicsays":
                    what = "```markdown\n< rps >\n\n# Usage\n?sonicsays (text)\n\n# Description\nGenerate a Sonic Says meme```";
                break;

                default:
                    what = "The command you entered doesn't exist !";
                break;

            }
            try {
                msg.author.send("`Syntax : ( ) is needed parameter, [ ] is optional parameter`")
                return await msg.author.send(what)
            } catch(ex) {
                return msg.channel.send(":x: > **Please open your DM, I can't reach you** <:sad_onigiri:610476938955456532>")
            }
        } else
            sendHelp(msg, author_id, isMod, master, error);

        console.log("[" + new Date().toLocaleTimeString() + "] Help sent to " + author)
    }

}

async function sendHelp(msg, author_id, isMod, master) {
    if (author_id == master)
        try {
            await msg.author.send(member)
            await msg.author.send(mod)
            await msg.author.send(admin)
        } catch(ex) {
            console.log(ex)
            return msg.channel.send(":x: > **Please open your DM, I can't reach you** <:sad_onigiri:610476938955456532>")
        }
    else if (isMod(author_id) == true)
        try {
            await msg.author.send(member)
            await msg.author.send(mod)
        } catch(ex) {
            console.log(ex)
            return msg.channel.send(":x: > **Please open your DM, I can't reach you** <:sad_onigiri:610476938955456532>")
        }
    else
        try {
            await msg.author.send(member)
        } catch(ex) {
            console.log(ex)
            return msg.channel.send(":x: > **Please open your DM, I can't reach you** <:sad_onigiri:610476938955456532>")
        }
}