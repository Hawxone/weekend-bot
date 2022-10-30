import client from "../config/client.js";
import {DisTube} from "distube";
import Genius from "genius-lyrics"

import {ActionRowBuilder, ButtonBuilder, EmbedBuilder as MessageEmbed, ButtonStyle} from "discord.js";
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
    let curPage = 1;
    let totalPage = 0
    let startIndex = (curPage-1)*10;
    let endIndex = 0

    const GENIUS_TOKEN = process.env.GENIUS_TOKEN

    client.on('interactionCreate',async (interaction)=>{
        if (!interaction.isButton()) return;
        const queue = client.Distube.getQueue(interaction);
        if (interaction.customId.length==1){
            if(!result) {
                await interaction.reply(`🎵 This option has time out.`);
                return;
            }
            await interaction.deferReply();
            const voiceChannel = interaction.member?.voice?.channel;
            if (voiceChannel){
                await client.Distube.play(interaction.member?.voice?.channel, result[parseInt(interaction.customId)-1], {
                    member: interaction.member,
                    textChannel: interaction.channel,
                    interaction
                })
                result=undefined
                await interaction.deleteReply()

            }else{
                await interaction.editReply({
                    content: '🎵 You must join a voice channel first.',
                });
                result=[]
            }
        }else {
            if (interaction.customId==="next"){
                await interaction.deferReply();
                curPage = curPage+1
                startIndex = (curPage-1)*10;
                endIndex=Math.min(startIndex+10-1,queue.songs.length-1)
                console.log(startIndex,endIndex)
                const queueEmbed = new MessageEmbed()
                    .setTitle("**Current queue:**")
                    .setColor("Red")
                    .setDescription(`${queue.songs
                        .map(
                            (song, id) =>
                                `**${id ? id : 'Playing'}**. ${
                                    song.name
                                } - \`${song.formattedDuration}\``,
                        )
                        .slice(startIndex, endIndex+1)
                        .join('\n')}`)
                    .setFooter({
                        text:`page ${curPage} of ${totalPage}`
                    })

                const buttonNext = new ButtonBuilder()
                    .setCustomId("next")
                    .setLabel('⏩')
                    .setStyle(ButtonStyle.Secondary)

                const buttonPrev = new ButtonBuilder()
                    .setCustomId("previous")
                    .setLabel('⏪')
                    .setStyle(ButtonStyle.Secondary)

                if (curPage===totalPage){
                    const queueButtons = new ActionRowBuilder()
                        .addComponents(buttonPrev)

                    await interaction.editReply({
                        embeds:[queueEmbed],
                        components:[queueButtons]
                    });

                }else if(curPage===1){
                    const queueButtons = new ActionRowBuilder()
                        .addComponents(buttonNext)

                    await interaction.editReply({
                        embeds:[queueEmbed],
                        components:[queueButtons]
                    });
                }
                else {
                    const queueButtons = new ActionRowBuilder()
                        .addComponents(buttonPrev)
                        .addComponents(buttonNext)

                    await interaction.editReply({
                        embeds:[queueEmbed],
                        components:[queueButtons]
                    });
                }

            }else if (interaction.customId==="previous"){
                await interaction.deferReply();
                curPage = curPage-1
                startIndex = (curPage-1)*10;
                endIndex=Math.min(startIndex+10-1,queue.songs.length-1)
                console.log(startIndex,endIndex)

                const queueEmbed = new MessageEmbed()
                    .setTitle("**Current queue:**")
                    .setColor("Red")
                    .setDescription(`${queue.songs
                        .map(
                            (song, id) =>
                                `**${id ? id : 'Playing'}**. ${
                                    song.name
                                } - \`${song.formattedDuration}\``,
                        )
                        .slice(startIndex, endIndex+1)
                        .join('\n')}`)
                    .setFooter({
                        text:`page ${curPage} of ${totalPage}`
                    })

                const buttonNext = new ButtonBuilder()
                    .setCustomId("next")
                    .setLabel('⏩')
                    .setStyle(ButtonStyle.Secondary)

                const buttonPrev = new ButtonBuilder()
                    .setCustomId("previous")
                    .setLabel('⏪')
                    .setStyle(ButtonStyle.Secondary)

                if (curPage===totalPage){
                    const queueButtons = new ActionRowBuilder()
                        .addComponents(buttonPrev)

                    await interaction.editReply({
                        embeds:[queueEmbed],
                        components:[queueButtons]
                    });

                }else if(curPage===1){
                    const queueButtons = new ActionRowBuilder()
                        .addComponents(buttonNext)

                    await interaction.editReply({
                        embeds:[queueEmbed],
                        components:[queueButtons]
                    });
                }
                else {
                    const queueButtons = new ActionRowBuilder()
                        .addComponents(buttonPrev)
                        .addComponents(buttonNext)

                    await interaction.editReply({
                        embeds:[queueEmbed],
                        components:[queueButtons]
                    });
                }

            }
        }
    })


    client.on('interactionCreate',async (interaction)=>{

        const queue = client.Distube.getQueue(interaction);

        if(interaction.isChatInputCommand()){

            switch (interaction.commandName) {

                case "sing":
                    await interaction.deferReply();

                    const voiceChannel = await interaction.member?.voice?.channel;
                    if (voiceChannel){

                        try {
                            const res= await client.Distube.play(interaction.member.voice.channel,interaction.options.get("song").value,{
                                member:interaction.member,
                                textChannel:interaction.channel,
                                interaction
                            })

                        }catch (e){

                            await interaction.editReply({content:"🎵 Playlist added to **LazyQueue**."})
                            return;

                        }

                        await interaction.deleteReply()


                    }else {
                        await interaction.editReply({
                            content: '🎵 You must join a voice channel first.',
                        });
                        return;
                    }
                    break;

                case "queue":
                    await interaction.deferReply()

                    if (interaction.options.get("options")===null){
                        if (!queue){

                            await interaction.editReply({
                                content: "🎵 Nothing to play right now"
                            })
                        }else {
                            curPage=1
                            totalPage=Math.ceil(queue.songs.length/10);
                            endIndex=Math.min(startIndex+10-1,queue.songs.length-1)
                            console.log(startIndex,endIndex)

                            const buttonNext = new ButtonBuilder()
                                .setCustomId("next")
                                .setLabel('⏩')
                                .setStyle(ButtonStyle.Secondary)

                            const buttonPrev = new ButtonBuilder()
                                .setCustomId("previous")
                                .setLabel('⏪')
                                .setStyle(ButtonStyle.Secondary)


                            const queueEmbed = new MessageEmbed()
                                .setTitle("**🎵 Current queue:**")
                                .setColor("Red")
                                .setDescription(`${queue.songs
                                    .map(
                                        (song, id) =>
                                            `**${id ? id : 'Playing'}**. ${
                                                song.name
                                            } - \`${song.formattedDuration}\``,
                                    )
                                    .slice(0, 10)
                                    .join('\n')}`)
                                .setFooter({
                                    text:`page ${curPage} of ${totalPage}`
                                })

                            if (curPage===totalPage){
                                const queueButtons = new ActionRowBuilder()
                                    .addComponents(buttonPrev)

                                await interaction.editReply({
                                    embeds:[queueEmbed],
                                    components:[queueButtons]
                                });

                            }else if(curPage===1){
                                const queueButtons = new ActionRowBuilder()
                                    .addComponents(buttonNext)

                                await interaction.editReply({
                                    embeds:[queueEmbed],
                                    components:[queueButtons]
                                });
                            }
                            else {
                                const queueButtons = new ActionRowBuilder()
                                    .addComponents(buttonPrev)
                                    .addComponents(buttonNext)

                                await interaction.editReply({
                                    embeds:[queueEmbed],
                                    components:[queueButtons]
                                });
                            }
                        }
                    }else{
                        switch (interaction.options.get("options").value){
                            case "clear":
                                await queue.stop()
                                await interaction.editReply({
                                    content: "🎵 queue cleared!"
                                })
                                break;
                        }
                    }
                    break;

                case "skip":

                    if (!queue){
                        interaction.reply({
                            content:"🎵 no next song"
                        })
                    }else if (queue.songs.length===1){
                        await client.Distube.stop(interaction)
                        interaction.reply({
                            content:"🎵 song skipped, there's no song left in queue"
                        })
                    }else {
                        await client.Distube.skip(interaction)
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
                        await interaction.deferReply();
                        if (result){
                            await interaction.editReply({content: "🎵 please choose options before or wait 30 seconds"})
                            return;
                        }
                       result = await client.Distube.search(interaction.options.get("song").value,{
                           limit:5
                       });

                        if (!result){
                            await interaction.editReply({
                                content:"no results found!"
                            })
                        }
                       let i=0;
                       const searchEmbed = new MessageEmbed()
                           .setTitle("**🎵 Choose an option from below**")
                           .setColor("Red")
                           .setDescription(`${result
                               .map(
                                   song =>
                                       `**${++i}**. ${song.name} - \`${
                                           song.formattedDuration
                                       }\``,
                               )
                               .join(
                                   '\n' +
                                   '\n',
                               )}\n**Choose 1 to 5 within 30 seconds**`)

                   const button1 = new ButtonBuilder()
                       .setCustomId("1")
                       .setLabel('1️⃣')
                       .setStyle(ButtonStyle.Secondary)

                   const button2 = new ButtonBuilder()
                       .setCustomId("2")
                       .setLabel('2️⃣')
                       .setStyle(ButtonStyle.Secondary)

                   const button3 = new ButtonBuilder()
                       .setCustomId("3")
                       .setLabel('3️⃣')
                       .setStyle(ButtonStyle.Secondary)

                   const button4 = new ButtonBuilder()
                       .setCustomId("4")
                       .setLabel('4️⃣')
                       .setStyle(ButtonStyle.Secondary)

                   const button5 = new ButtonBuilder()
                       .setCustomId("5")
                       .setLabel('5️⃣')
                       .setStyle(ButtonStyle.Secondary)


                        const searchButtons = new ActionRowBuilder()
                            .addComponents(button1)
                            .addComponents(button2)
                            .addComponents(button3)
                            .addComponents(button4)
                            .addComponents(button5)

                       interaction.editReply({
                           embeds:[searchEmbed],
                           components:[searchButtons]
                           }
                       ).then(()=>{
                           setTimeout(()=>result=undefined,30000)
                       })
                    break;

                case "lyrics":
                    await interaction.deferReply();
                    const query = interaction.options.get("song").value
                    const api = new Genius.Client(GENIUS_TOKEN)
                    const song = await api.songs.search(query)
                    const firstSong = song[0];

                    if (!firstSong || firstSong.artist.name.length>1000){
                        await interaction.editReply({
                            content:"🎵 No lyrics found!"
                        })

                        return;
                    }
                    let lyrics = await firstSong.lyrics()

                    if (lyrics.length>2000){
                        lyrics = lyrics.substring(0, 2000)
                    }

                    const embed = new MessageEmbed()
                        .setColor("Fuchsia")
                        .setTitle(firstSong.title)
                        .setAuthor({
                            name:firstSong.artist.name,
                            iconURL:firstSong.artist.thumbnail
                        })
                        .setDescription(lyrics)
                        .setThumbnail(firstSong.image)
                    await interaction.editReply({
                        embeds:[embed]
                    })
                    break;
            }

        }
    })

    client.Distube.on('playSong',(queue,song)=>{

        const status = (queue) => `Volume: \`${queue.volume}%\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``
        const playEmbed = new MessageEmbed()
            .setColor("DarkAqua")
            .setAuthor({name:"🎵 Now Playing"})
            .setThumbnail(song.thumbnail)
            .setDescription(`[${song.name}](${song.url})`)
            .setFields(
                {name:"Views",value:song.views.toString(),inline:true},
                {name:"Like",value:song.likes.toString(),inline:true},
                {name:"Duration",value:song.formattedDuration.toString(),inline:true},
                {name:"Status",value:status(queue).toString(),inline:false}
            )
            .setFooter({
                text:`Requested by ${song.user.username}`,
                iconURL:song.user.avatarURL()
            })
            .setTimestamp()

        queue.textChannel.send({
            embeds:[playEmbed]
        })

    })

    client.Distube.on('addSong',(queue,song)=>{
        queue.textChannel.send(`🎵 added ${song.name} to **LazyQueue**`)
    })

    client.Distube.on('addList', (queue, playlist) =>
        queue.textChannel?.send(
            `Added \`${playlist.name}\` playlist (${
                playlist.songs.length
            } songs) to queue\n${status(queue)}`,
        ),
    )

    client.Distube.on('disconnect',queue=>{
        queue.textChannel?.send(`🎵 See you later!`)
    })

    client.Distube.on('empty',queue=>{
        queue.textChannel?.send(`🎵 Seems like no one is here, goodbye!`)
    })


};

export default MusicPlayer;
