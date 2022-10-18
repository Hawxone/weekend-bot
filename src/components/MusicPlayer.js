import client from "../config/client.js";
import {DisTube} from "distube";
import Genius from "genius-lyrics"

import {EmbedBuilder as MessageEmbed} from "discord.js";
import queue from "../commands/musicCommands/queue.js";


const MusicPlayer = () => {

    client.Distube = new DisTube(client,{
        leaveOnStop: true,
        leaveOnEmpty:true,
        emptyCooldown:60,
        emitNewSongOnly: true,
        emitAddSongWhenCreatingQueue: false,
        emitAddListWhenCreatingQueue: false,
        searchSongs:5
    })

    let result=undefined;

    const GENIUS_TOKEN = process.env.GENIUS_TOKEN


    client.on('interactionCreate',async (interaction)=>{
        const queue = client.Distube.getQueue(interaction);

        if(interaction.isChatInputCommand()){

            switch (interaction.commandName) {

                case "sing":
                    await interaction.reply({
                        content:"🎵 searching for song..."
                    })

                    const voiceChannel = await interaction.member?.voice?.channel;
                    if (voiceChannel){
                         await client.Distube.play(interaction.member.voice.channel,interaction.options.get("song").value,{
                            member:interaction.member,
                            textChannel:interaction.channel,
                            interaction
                        })

                    }else {
                        await interaction.editReply({
                            content: 'You must join a voice channel first.',
                        });
                    }

                    break;
                case "queue":
                    if (!queue){
                        interaction.reply({
                            content:"🎵 Nothing to play right now"
                        })
                    }else {
                        interaction.reply({
                            content:`🎵 Current queue:\n${queue.songs
                                .map(
                                    (song, id) =>
                                        `**${id ? id : 'Playing'}**. ${
                                            song.name
                                        } - \`${song.formattedDuration}\``,
                                )
                                .slice(0, 10)
                                .join('\n')}`,
                        })
                    }
                    break;
                case "skip":

                    if (!queue){
                        interaction.reply({
                            content:"🎵 no next song"
                        })
                    }else if (queue.songs.length===1){
                        client.Distube.stop(interaction)
                        interaction.reply({
                            content:"🎵 song skipped, there's no song left in queue"
                        })
                    }else {
                        client.Distube.skip(interaction)
                        interaction.reply({
                            content:"🎵 song skipped"
                        })
                    }

                    break;

                case "repeat":
                    if (!queue){
                        interaction.reply({
                            content:"🎵 song empty"
                        })
                    }else {
                        const modeValue = interaction.options.get("mode").value;

                        let mode=null;
                        switch (modeValue) {
                            case "off":
                                mode=0
                                break;

                            case "song":
                                mode=1
                                break;

                            case "queue":
                                mode=2
                                break;
                        }
                        client.Distube.setRepeatMode(interaction,mode);
                        mode = mode ? (mode === 2 ? 'Repeat queue' : 'Repeat song') : 'Off'
                        interaction.reply({
                            content:`🎵 Set repeat mode to : **${mode}**`
                        })
                    }

                    break;
               case "search":

                       result = await client.Distube.search(interaction.options.get("song").value,{
                           limit:5
                       });
                       let i=0;
                       interaction.reply(
                           `**Choose an option from below**\n${result
                               .map(
                                   song =>
                                       `**${++i}**. ${song.name} - \`${
                                           song.formattedDuration
                                       }\``,
                               )
                               .join(
                                   '\n',
                               )}\n*Enter number 1 to 5 within 30 seconds*`,
                       ).then(()=>{
                           setTimeout(()=>result=[],30000)
                       })

                    break;
                case "lyrics":
                    await interaction.deferReply();
                    const query = interaction.options.get("song").value
                    const api = new Genius.Client(GENIUS_TOKEN)

                    const song = await api.songs.search(query)
                    const firstSong = song[0];
                    console.log(firstSong)
                    let lyrics = await firstSong.lyrics()

                    const embed = new MessageEmbed()
                        .setColor("Fuchsia")
                        .setTitle(firstSong.title)
                        .setAuthor({
                            name:firstSong.artist.name,
                            iconURL:firstSong.artist.thumbnail
                        })
                        .setThumbnail(firstSong.image)


                    if (lyrics.length>2000){
                        lyrics = lyrics.substring(0, 2000)
                    }

                    await interaction.editReply({
                        content:lyrics,
                        embeds:[embed]
                    })
                    break;
            }

        }
    })


    client.on('messageCreate',async (message)=>{

        if (message.author.bot) return;
        if (!message.guild) return;

        if(message.content.length===1 && !message.content.match(/[a-z]/i)){

            if (message.content >5 ){
                result=[]
                message.channel.send({
                    content:"enter number from 1 to 5!"
                })
            }else {
                const res = result[Number(message.content-1)]

                if (res){
                    const voiceChannel = message.member?.voice?.channel;
                    if (voiceChannel){
                        await client.Distube.play(message.member?.voice?.channel, res, {
                            member: message.member,
                            textChannel: message.channel,
                            message
                        })
                        result=[]
                    }else{
                        message.channel.send(
                            'You must join a voice channel first.',
                        );
                        result=[]
                    }


                }else {
                    result=[]
                }

            }
        }else {
            message.channel.send({
                content:"enter number from 1 to 5!"
            })
            result=[]
        }

    })


    client.Distube.on('playSong',(queue,song)=>{
        queue.textChannel.send(`🎵 playing **${song.name}**`)

    })

    client.Distube.on('addSong',(queue,song)=>{
        queue.textChannel.send(`🎵 added ${song.name} to **LazyQueue**`)
    })

    client.Distube.on('disconnect',queue=>{
        queue.textChannel?.send(`🎵 See you later!`)
    })

    client.Distube.on('empty',queue=>{
        queue.textChannel?.send(`🎵 Seems line no one is here, goodbye!`)
    })


};

export default MusicPlayer;
