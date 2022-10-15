import {SlashCommandBuilder} from "discord.js"

export const userCommand = new SlashCommandBuilder()
    .setName('users')
    .setDescription('user cmd')
    .addUserOption(option=>
        option.setName('user')
            .setDescription('user')
    )

export default userCommand.toJSON()
