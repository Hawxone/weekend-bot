import {SlashCommandBuilder} from "discord.js"

export const repeatCommand = new SlashCommandBuilder()
    .setName('repeat')
    .setDescription('repeat cmd')
    .addStringOption(option=>
        option.setName('mode')
            .setDescription('repeatmode')
            .setRequired(true)
            .setChoices(
                {
                name:"off",
                value:"off"
            },
                {
                    name:"song",
                    value:"song"
                },
                {
                    name:"queue",
                    value:"queue"
                },
                )
    )


export default repeatCommand
