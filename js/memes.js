module.exports = class memes {

    static async sonicsays (msg, cont, admin, sonicSays) {
        if(msg.channel.id != '606165780215889960' && admin.indexOf(msg.author.id) != 0)return;
        return sonicSays(msg, cont);
    }

}