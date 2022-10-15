import client from "../config/client.js";
import {EmbedBuilder as MessageEmbed} from "discord.js";
import * as cheerio from 'cheerio';
import axios from "axios";



const Detail = (url,channel)=>{

    axios.get(url).then((response)=>{
        const $ = cheerio.load(response.data)
        const title = $('strong', '.title-name.h1_bold_none').text();

        let titleEN = $('.title-english.title-inherit').text();
        if (!titleEN) {
            titleEN = title;
        }

        const imgURL = $('.lazyload').attr("data-src");
        const charImg = $('img', '.picSurround').attr('data-src');
        let desc = $('meta[property="og:description"]').attr('content');
        if (desc.length > 1024) {
            desc=desc.substring(0, 1022) + "…";
        }
        let rating = $('span[itemprop="ratingValue"]').text();
        if (!rating) {
            rating = "N/A"
        }
        const ranking = $('strong','.numbers.ranked').text();
        const members = $('strong', '.numbers.members').text();

        let op = $('td[width="84%"]', '.theme-songs.js-theme-songs.opnening').text();
        let ed = $('td[width="84%"]', '.theme-songs.js-theme-songs.ending').text();
        if (!op) {
            op = "None";
        }
        if (op.length > 1024) {
            op = op.substring(0, 1022)+"…";
        }
        if (!ed) {
            ed = "None";
        }
        if (ed.length > 1024) {
            ed = ed.substring(0, 1022)+"…";
        }


        const embed = new MessageEmbed()
            .setColor("BLUE")
            .setTitle(title)
            .setURL(url)
            .setImage(imgURL)
            //.setDescription('')
            .setThumbnail(charImg)
            .setAuthor({ name: titleEN, iconURL: 'https://image.myanimelist.net/ui/OK6W_koKDTOqqqLDbIoPAiC8a86sHufn_jOI-JGtoCQ'})
            .addFields(
                { name: 'Rating', value: rating, inline: true },
                { name: 'Ranking', value: ranking, inline: true },
                { name: 'Members', value: members, inline: true },
                { name: '\u200B', value: '\u200B' },
                { name: 'Description', value: desc},
                { name: 'OP', value: op, inline: true },
                { name : 'ED', value: ed, inline: true}
            );

            channel.send({
                embeds:[embed]
            })

    })



}

const MyAnimeList = () => {

    client.on('interactionCreate',(interaction)=>{

        if(interaction.isChatInputCommand()){

            switch (interaction.commandName) {

                case "anime":
                    interaction.reply(
                        {
                            content:`loading search ${interaction.options.get("title").value}`
                        }
                    )
                    let entryURL = "";
                    axios.get("https://myanimelist.net/search/all?q="+interaction.options.get("title").value).then((response)=>{
                       const $= cheerio.load(response.data)
                        entryURL = $('a', '.title').attr("href");

                        entryURL=entryURL.substring(0, 36);
                        if (!entryURL) {
                            return interaction.reply(
                                {
                                    content:`no result for ${interaction.options.get("title").value}`
                                }
                            )
                        }else{

                           Detail(entryURL,interaction.channel)


                        }


                    })


                    break;

            }

        }
    })
};

export default MyAnimeList;
