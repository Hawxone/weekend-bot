import {SlashCommandBuilder} from "discord.js"

export const rankCommand = new SlashCommandBuilder()
    .setName('rank')
    .setDescription('check user rank')
    .addUserOption((option)=>
        option
            .setName('user')
            .setDescription('choose user rank')
    )

export default rankCommand.toJSON()
