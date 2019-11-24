module.exports = class staff {

    static async bulk (msg, cont, author) {

        if(cont.length !== 1) {
            if(msg.channel.type !== "dm") {
                msg.delete().catch(console.error);
                cont.shift()
                var nb = parseInt(cont[0])
                msg.channel.bulkDelete(nb)
                    .then(console.log("[" + new Date().toLocaleTimeString() + "] Bulk delete : " + nb + " in #" + msg.channel.name + " by " + author))
                    .catch(console.error);
            }
        }
        else
            return msg.channel.send({"embed": { "title": ":x: > **Incomplete command**", "color": 13632027 }});

    }

}