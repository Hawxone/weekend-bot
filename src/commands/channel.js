import {SlashCommandBuilder} from "discord.js"

export const channelCommand = new SlashCommandBuilder()
    .setName('channel')
    .setDescription('channel')
    .addChannelOption((channel)=>
    channel.setName('channel')
        .setDescription('channel')
        .setRequired(true)
    )
    .addBooleanOption((option)=>
        option.setName("clear")
            .setDescription("clear messages")
            .setRequired(true)
    )

export default channelCommand.toJSON()
