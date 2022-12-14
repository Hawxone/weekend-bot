import {SlashCommandBuilder} from "discord.js"

export const searchCommand = new SlashCommandBuilder()
    .setName('search')
    .setDescription('search song')
    .addStringOption(option=>
        option.setName('song')
            .setDescription('song')
            .setRequired(true)
    )


export default searchCommand
