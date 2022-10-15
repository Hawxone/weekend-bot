import client from "../config/client.js";
import xp from "simply-xp";
import canvacord from "canvacord";

const Rank = () => {

client.on('interactionCreate', async (interaction)=>{

    switch (interaction.commandName){

        case "rank":
            const data = await xp.fetch(interaction.options.get("user").user.id, interaction.guildId);


            const att = new canvacord.Rank()
                .setAvatar(interaction.options.get("user").user.displayAvatarURL({dynamic:false,format:"png"}))
                .setCurrentXP(data.xp)
                .setRequiredXP(data.reqxp)
                .setStatus("dnd")
                .setRank(data.rank)
                .setLevel(data.level)
                .setProgressBar("#FFFFFF", "COLOR")
                .setUsername(interaction.options.get("user").user.username)
                .setDiscriminator(interaction.options.get("user").user.discriminator)

            att.build()
                .then(data=>{
                    interaction.reply({
                        files:[data]
                    });
                })

            break;
    }



})


};
export default Rank;
