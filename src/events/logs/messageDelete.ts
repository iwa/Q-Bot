/**
 * Elements related to the messageDelete event
 * @packageDocumentation
 * @module LogMessageDelete
 * @category Events
 */
import { Message, User, PartialMessage, Client, TextChannel, MessageEmbed } from 'discord.js';
let lastTimestamp: number;

export default async function messageDelete(msg: Message | PartialMessage, bot: Client) {
    if (!msg.guild) return;
    if (msg.content.startsWith('?')) return;
    if (msg.author.bot) return;
	const fetchedLogs = await msg.guild.fetchAuditLogs({
		limit: 1,
		type: 'MESSAGE_DELETE',
	});
	const deletionLog = fetchedLogs.entries.first();

	if (!deletionLog) return;

    const { executor, target, createdTimestamp } = deletionLog;

    if (lastTimestamp === createdTimestamp) return;
    lastTimestamp = createdTimestamp;

	if ((target as User).id === msg.author.id) {
        let channel = await bot.channels.fetch(process.env.LOGTC);
        let embed = new MessageEmbed();
        embed.setTitle("Message deleted");
        embed.setDescription(`Author: ${msg.author.tag} (<@${msg.author.id}>)\nDeleted by: <@${executor.id}>\n\`\`\`${msg.cleanContent ? msg.cleanContent : "empty message"}\`\`\``);
        embed.setColor(10613368);
        embed.setTimestamp(createdTimestamp);
        embed.setFooter("Date of deletion:")
        embed.setAuthor(executor.username, executor.avatarURL({ format: 'png', dynamic: false, size: 128 }))
        if(msg.attachments.first()) {
            embed.setImage(msg.attachments.first().proxyURL);
            embed.addField('attachment', `[link](${msg.attachments.first().proxyURL})`);
        }
        return (channel as TextChannel).send(embed);
	}
}
