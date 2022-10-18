import {SlashCommandBuilder} from "discord.js"


export const animeCommand = new SlashCommandBuilder()
    .setName('anime')
    .setDescription('search anime')
    .addStringOption(option=>
        option.setName('title')
            .setDescription('anime title')
            .setRequired(true)
    )


export default animeCommand
