const utils = require('./utilities')

module.exports = class letmein {

    static async action (msg, levels, db) {

        if(msg.channel.id != "608630294261530624")return;

        var user = await db.get('user').find({ id: msg.author.id }).value();

        if(user) {
            var lvl = utils.levelInfo(user.exp);
            if(lvl.level != 0) await msg.member.addRole(levels[lvl.level].id);
        }

        return await msg.member.addRole('606862164392673290').then(() => {
            msg.delete().catch(console.error)
            try {
                msg.member.send({"embed": { "description": "I'm Q-Bot, a unique bot created for this server.\n\nYou can use me with the prefix `?`\nand see all my commands by doing `?help`", "color": 2543500, "author": { "name": `Welcome to Qumu's Discord Server, ${msg.author.username} !`, "icon_url": msg.author.avatarURL}}});
            } catch (err) {
                console.error(err)
            }
        }).catch(console.error)

    }
}