import {SlashCommandBuilder} from "discord.js"

export const helpCommand = new SlashCommandBuilder()
    .setName("help")
    .setDescription("bot help")


export default helpCommand.toJSON();
