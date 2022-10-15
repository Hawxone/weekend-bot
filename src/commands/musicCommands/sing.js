import {SlashCommandBuilder} from "discord.js"

export const singCommand = new SlashCommandBuilder()
    .setName('sing')
    .setDescription('sing cmd')
    .addStringOption(option=>
        option.setName('song')
            .setDescription('song')
            .setRequired(true)
    )


export default singCommand
