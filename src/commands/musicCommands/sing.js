import {SlashCommandBuilder} from "discord.js"

export const singCommand = new SlashCommandBuilder()
    .setName('sing')
    .setDescription('sing a song')
    .addStringOption(option=>
        option.setName('song')
            .setDescription('song')
            .setRequired(true)
    )


export default singCommand
