import {SlashCommandBuilder} from "discord.js"


export const animeCommand = new SlashCommandBuilder()
    .setName('anime')
    .setDescription('anime cmd')
    .addStringOption(option=>
        option.setName('title')
            .setDescription('animetitle')
            .setRequired(true)
    )


export default animeCommand
