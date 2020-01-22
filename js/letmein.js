module.exports = class letmein {

    static async action (msg, author_id, levels, db) {

        if(msg.guild.id != "225359327525994497")return;
        if(msg.channel.id != "608630294261530624")return;

        var user = await db.get('user').find({ id: author_id }).value();

        if(user) {
            var lvl = whichLevel(user.exp);
            if(lvl != 0) await msg.member.addRole(levels[lvl]);
        }

        return await msg.member.addRole('606862164392673290').then(() => {
            msg.delete().catch(console.error)
            try {
                msg.member.send({"embed": { "description": "I'm Q-Bot, a unique bot created for this server.\n\nYou can use me with the prefix `?`\nand see all my commands by doing `?help`", "color": 2543500, "author": { "name": `Welcome to Qumu's Discord Server, ${msg.author.username} !`, "icon_url": msg.author.avatarURL}}});
            } catch (err) {
                console.log(err)
            }
        }).catch(console.error)

    }
}

async function whichLevel(xp) {
    if(xp < 250) { level = 0 }
    else if(xp >= 250 && xp < 500) { level = 1 }
    else if(xp >= 500 && xp < 1000) { level = 2 }
    else if(xp >= 1000 && xp < 2000) { level = 3 }
    else if(xp >= 2000 && xp < 3500) { level = 4 }
    else if(xp >= 3500 && xp < 5000) { level = 5 }
    else if(xp >= 5000 && xp < 7000) { level = 6 }
    else if(xp >= 7000 && xp < 9000) { level = 7 }
    else if(xp >= 9000 && xp < 12140) { level = 8 }
    else if(xp >= 12140 && xp < 16000) { level = 9 }
    else if(xp >= 16000 && xp < 20000) { level = 10 }
    else if(xp >= 20000 && xp < 25000) { level = 11 }
    else if(xp >= 25000 && xp < 30000) { level = 12 }
    else if(xp >= 30000 && xp < 35000) { level = 13 }
    else if(xp >= 35000 && xp < 40000) { level = 14 }
    else if(xp >= 40000 && xp < 50000) { level = 15 }
    else if(xp >= 50000 && xp < 60000) { level = 16 }
    else if(xp >= 60000 && xp < 70000) { level = 17 }
    else if(xp >= 70000 && xp < 85000) { level = 18 }
    else if(xp >= 85000 && xp < 100000) { level = 19 }
    else if(xp >= 100000) { level = 20 }
    return level;
}