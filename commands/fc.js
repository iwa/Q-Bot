module.exports.run = async (bot, msg, args, db) => {
    var user = await db.get('user').find({ id: msg.author.id }).value();
    if(!user.fc)
        return msg.channel.send({
            "embed": {
              "title": "Do `?setfc 1234-4567-7890` to register it",
              "color": 15802940,
              "author": {
                "name": "You didn't register your Switch FC !",
                "icon_url": msg.author.avatarURL
              }
            }
          })
    else
        return msg.channel.send({
        "embed": {
          "title": `**SW-${user.fc}**`,
          "color": 15802940,
          "author": {
            "name": `${msg.author.username}'s Switch FC`,
            "icon_url": msg.author.avatarURL
          }
        }
      })
};

module.exports.help = {
    name: 'fc',
    usage: "?fc",
    desc: "Pat people by mentioning them"
};