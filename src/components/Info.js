import client from "../config/client.js";
import {EmbedBuilder} from "discord.js";


const Info = () => {
    client.on('interactionCreate',(interaction)=>{
        if(interaction.isChatInputCommand()){

            switch (interaction.commandName) {
                case "help" :

                    interaction.reply(
                        {
                        embeds:[
                            new EmbedBuilder()
                                .setAuthor({
                                    name:client.user.username,iconURL:client.user.displayAvatarURL()
                                })
                                .setDescription('' +
                                    `Hello! thank you for inviting ${client.user.username} to your server~!\n` +
                                    '\n' +
                                    '**Music Commands**\n' +
                                    '\n' +
                                    '"/sing {title}" to play a music\n' +
                                    '"/skip" to skip a music\n' +
                                    '"/repeat {mode}" set repeat mode\n' +
                                    '"/queue" to check queue list\n' +
                                    '"/queue {options}" queue options, currently have only clear option\n' +
                                    '"/search {title}" to give top 5 search and choose 1 to 5 to play\n' +
                                    '"/lyrics {song}" to search song lyrics\n' +
                                    '\n' +
                                    '**Other Commands**\n' +
                                    '\n' +
                                    '"/anime {title}" to get anime detail\n' +
                                    '"/rank {username}" to get user current level and xp\n')
                                .setTitle("Help")
                                .setColor("DarkOrange")
                        ]
                    })
                    break;

            }

        }
    })
};

export default Info;
