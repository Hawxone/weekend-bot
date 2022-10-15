import client from "../config/client.js";
import {DisTube} from "distube";


const MusicPlayer = () => {

    client.Distube = new DisTube(client,{
        leaveOnStop: false,
        emitNewSongOnly: true,
        emitAddSongWhenCreatingQueue: false,
        emitAddListWhenCreatingQueue: false,
        searchSongs:5
    })


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
                         client.Distube.play(interaction.member.voice.channel,interaction.options.get("song").value,{
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
                    let result = await client.Distube.search(interaction.options.get("song").value,{
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
                            )}\n*Enter number 1 to 5*`,
                    )

                        client.on('messageCreate',async (message)=>{
                            if (message.author.bot) return;
                            if (!message.guild) return;

                            if(message.content.length===1 && !message.content.match(/[a-z]/i)){

                                if (message.content >5 ){
                                    result=[]
                                    message.channel.send({
                                        content:"enter number from 1 to 5"
                                    })
                                }else {
                                    const res = result[Number(message.content-1)]

                                    if (res){
                                        const voiceChannel = message.member?.voice?.channel;
                                        if (voiceChannel){
                                            client.Distube.play(interaction.member.voice.channel,res,{
                                                member:interaction.member,
                                                textChannel:interaction.channel,
                                                interaction
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

                            }


                        })

                    break;
            }

        }
    })


    client.Distube.on('playSong',(queue,song)=>{
        queue.textChannel.send(`🎵 playing **${song.name}**`)

    })

    client.Distube.on('addSong',(queue,song)=>{
        queue.textChannel.send(`🎵 added ${song.name} to **LazyQueue**`)
    })


};

export default MusicPlayer;
