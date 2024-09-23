const { ActionRowBuilder, ButtonBuilder, ButtonStyle,SlashCommandBuilder } = require('discord.js');
const {request} = require ('undici');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bored')
		.setDescription('Provides random things to do'),
	async execute(interaction) {

        async function getBoredContent(){
            const {body} = await request('https://bored-api.appbrewery.com/random');
            const boredresult = await body.json();

            const activity = boredresult.activity;
            const type = boredresult.type;
            const participants = boredresult.participants;
            const accessibility = boredresult.accessibility;

            return `**Activity** : ${activity}\n**Type** : ${type}\n**Participants** : ${participants}\n**Accessibility** : ${accessibility}`;
        }

        try{
            const message = getBoredContent();
            const again = new ButtonBuilder()
			.setCustomId('again')
			.setLabel('Bored again')
			.setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder().addComponents(again);

            await interaction.reply({
                content : message,
                components : [row]
            });
        } catch(error){
            console.error('Error fetching the API:', error);
            await interaction.reply('Something went wrong while fetching the activity. Please try again later ');
        }
	},
};