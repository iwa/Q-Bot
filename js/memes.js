module.exports = class memes {

    static async sonicsays (msg, cont, author_id, admin, sonicSays) {
        if(msg.channel.id != '606165780215889960' && admin.indexOf(author_id) != 0)return;
        return sonicSays(msg, cont);
    }

}