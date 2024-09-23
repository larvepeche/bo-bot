require('dotenv').config()

const fs = require('node:fs');
const path = require ('node:path');

const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for( const folder of commandFolders){
    const commandsPath = path.join(foldersPath,folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for( const file of commandFiles){
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if('data' in command && 'execute' in command){
            client.commands.set(command.data.name, command);
        }else{
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
        }
    }
}

client.on('ready', () => {
    console.log(`BOBOT is online`);
});
client.login(process.env.DISCORD_TOKEN);

// hello greeting 
client.on('messageCreate', msg => {
    if (msg.content === 'Hello') {
        if(msg.author.username.includes('larvepeche')){
            msg.reply(`Hello my Lord !`);

        }else{
            msg.reply(`Hello !`);
        }
    }
});

//custom message for sloth
client.on('messageCreate', msg => {
    if(msg.author.username.includes('sloth')){
        if (msg.content === 'Hello') {
            msg.reply(`I love you <3 !`);
        }
    }
    
});


client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if(!command){
        console.error('No command matching that charabia');
        return;
    }

    try{
        await command.execute(interaction);
    }catch(error){
        console.error(error);
        if(interaction.replied ||interaction.deferred){
            await interaction.followUp({content : 'There was an error while executing this command!',ephemeral : true})
        }else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
    }
})




