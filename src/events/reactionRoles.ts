/**
 * Reaction roles methods to run RR Messages
 * @packageDocumentation
 * @module ReactionRoles
 * @category Events
 */
import { MessageReaction, User } from "discord.js";
import { MongoClient } from 'mongodb';
/**
 * @desc MongoDB constants
 */
const url = process.env.MONGO_URL, dbName = process.env.MONGO_DBNAME;

/**
 * @class reactionRoles class
 */
export default class reactionRoles {

    /**
     * Gives the corresponding role of the reaction to the user
     * @param {MessageReaction} reaction
     * @param {User} author
     */
    static async add (reaction:MessageReaction, author:User) {
        let mongod = await MongoClient.connect(url, {'useUnifiedTopology': true});
        let db = mongod.db(dbName);

        let msg = await db.collection('msg').findOne({ _id: reaction.message.id })
        if(!msg)return mongod.close();

        let role = msg.roles.find((val:any) => val.emote == reaction.emoji.name)
        if(!role)return mongod.close();

        let member = reaction.message.guild.member(author)
        if(!member)return mongod.close();
        await member.roles.add(role.id)

        return mongod.close();
    }

    /**
     * Removes the corresponding role of the reaction from the user
     * @param {MessageReaction} reaction
     * @param {User} author
     */
    static async remove (reaction:MessageReaction, author:User) {
        let mongod = await MongoClient.connect(url, {'useUnifiedTopology': true});
        let db = mongod.db(dbName);

        let msg = await db.collection('msg').findOne({ _id: reaction.message.id })
        if(!msg)return mongod.close();

        let role = msg.roles.find((val:any) => val.emote == reaction.emoji.name)
        if(!role)return mongod.close();

        let member = reaction.message.guild.member(author)
        if(!member)return mongod.close();
        await member.roles.remove(role.id)

        return mongod.close();
    }
}