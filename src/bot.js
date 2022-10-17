import {config} from "dotenv";
import {REST,Routes,GatewayIntentBits,ActivityType } from "discord.js"
import {helpCommand} from "./commands/help.js"
import {rolesCommand} from "./commands/roles.js"
import {userCommand} from "./commands/user.js";
import {channelCommand} from "./commands/channel.js";
import singCommand from "./commands/musicCommands/sing.js";
import queueCommand from "./commands/musicCommands/queue.js";
import skipCommand from "./commands/musicCommands/skip.js";
import repeatCommand from "./commands/musicCommands/repeat.js";
import client from "./config/client.js";
import MusicPlayer from "./components/MusicPlayer.js";
import Info from "./components/Info.js";
import MyanimeList from "./components/MyanimeList.js";
import animeCommand from "./commands/anime.js";
import mongoose from "mongoose";
import Leveling from "./components/Leveling.js";
import {rankCommand} from "./commands/rank.js";
import Rank from "./components/Rank.js";
import searchCommand from "./commands/musicCommands/search.js";
import lyricsCommand from "./commands/musicCommands/lyrics.js";


//database & token config
config();
const TOKEN = process.env.BOT_TOKEN
client.login(TOKEN);
const DATABASE_TOKEN = process.env.DATABASE_TOKEN
mongoose.connect(DATABASE_TOKEN).catch(console.error);


//run when bot is ready
client.once("ready",()=>{
    const CLIENT_ID= client.user.id
    const rest = new REST({ version: '10' }).setToken(TOKEN);

    //presence config
    client.user.setPresence({
        activities:[
            {
                name:"kamu 💕💕 | /help",
                type:ActivityType.Watching
            }
        ],status:'online'
    })

    //components belong here
    MusicPlayer();
    Info();
    MyanimeList();
    Leveling();
    Rank();

    //commands belong here
    const commands = [
        helpCommand,
        rolesCommand,
        userCommand,
        channelCommand,
        singCommand,
        queueCommand,
        skipCommand,
        repeatCommand,
        animeCommand,
        rankCommand,
        searchCommand,
        lyricsCommand
    ].map(command=>command.toJSON());

    //register commands
    (async ()=>{
        console.log("Loaded "+client.guilds.cache.map(g=>g.id).length + " servers")
        const guilds = client.guilds.cache.map(g=>g.id)
        console.log("Started refreshing app (/) commands.")


        guilds.forEach((guildId)=>{
            try{
                rest.put(
                    Routes.applicationGuildCommands(CLIENT_ID,guildId), {
                        body: commands,
                    })
            } catch (e){
                console.log(e)
            }
        })

        //for production deployment only
/*        try{
            console.log("Started refreshing app (/) commands.")
            const data = await rest.put(
                Routes.applicationCommands(CLIENT_ID), {
                    body: commands,
                })
            console.log(data)

        } catch (e){

        }*/

    })()

})




