import {SlashCommandBuilder} from "discord.js"

export const lyricsCommand = new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('song lyrics')
    .addStringOption(option=>
        option.setName('song')
            .setDescription('song lyrics')
            .setRequired(true)
    )


export default lyricsCommand
