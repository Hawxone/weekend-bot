import {Client, GatewayIntentBits} from "discord.js";

const client = new Client({intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]});


export default client;
