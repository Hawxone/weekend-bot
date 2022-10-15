import client from "../config/client.js";
import xp from "simply-xp";
import canvacord from 'canvacord';


const Leveling = () => {

    const DATABASE_TOKEN = process.env.DATABASE_TOKEN
    xp.connect(DATABASE_TOKEN);


    client.on("messageCreate",async(message)=>{

        if (message.author.bot) return;
        if (!message.guild) return;

        await xp.addXP(message,message.author.id,message.guild.id,{
            min:10,
            max:50
        }).catch(console.error);


    })
    client.on('levelUp', async (message, data) => {
        console.log("user "+data.userID +"on "+data.guildID+ "level increased by 1")

        //const attachment = xp.rank(message,data.userID,data.guildID)



        const att = new canvacord.Rank()
            .setAvatar(message.author.displayAvatarURL({dynamic:false,format:"png"}))
            .setCurrentXP(data.xp)
            .setRequiredXP(data.xp)
            .setStatus("dnd")
            .setLevel(data.level)
            .setProgressBar("#FFFFFF", "COLOR")
            .setUsername(message.author.username)
            .setDiscriminator(message.author.discriminator)

        att.build()
            .then(data=>{
                //const attachment = new Discord.MessageAttachment(data,"RankCard.png");
                message.channel.send({
                    files:[data]
                });
            })

        console.log(att)
        message.channel.send(`Congrats! ${message.author} is now level ${data.level}`)




    })

};

export default Leveling;
