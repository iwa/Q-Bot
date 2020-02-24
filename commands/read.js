module.exports.run = (bot, msg, args, db) => {
    db.read();
    return msg.react('✅');
};

module.exports.help = {
    name: 'read'
};