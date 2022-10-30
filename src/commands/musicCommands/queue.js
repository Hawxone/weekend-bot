import {SlashCommandBuilder} from "discord.js"

export const queueCommand = new SlashCommandBuilder()
    .setName('queue')
    .setDescription('current queue')
    .addStringOption(option=>
        option.setName("options")
            .setDescription("queue options")
            .setRequired(false)
            .setChoices({
                name:"clear",
                value:"clear"
            })
    )


export default queueCommand
