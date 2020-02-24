module.exports.run = async (bot, msg) => {
    if(await msg.channel.type != "text")return;
    if(await msg.guild.id != "225359327525994497")return;
    if(await msg.channel.id != "611349541685559316")return;
    if(await msg.member.roles.find(val => val.id == '613317566261231638')) {
        console.log(`info: fans leave: ${msg.author.tag}`)
        return msg.member.removeRole('613317566261231638').then(msg.reply("you'll not be notified anymore."))
    } else
        return msg.reply("you're already not a Q-Bot fan !")
};

module.exports.help = {
    name: 'leavefan',
    usage: "?leavefan",
    desc: "Do this command if you no longer want to be aware of every updates of Q-Bot"
};