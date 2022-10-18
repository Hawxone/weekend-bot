import {SlashCommandBuilder} from "discord.js"

export const queueCommand = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('current queue')



export default queueCommand
