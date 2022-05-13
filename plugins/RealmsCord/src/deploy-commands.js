const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('../config.json');

const commands = [
    new SlashCommandBuilder().setName('players').setDescription('Gets a list of people currently on the realm.'),
    new SlashCommandBuilder().setName('cmd').setDescription('Sends a command directly to the realm.').addStringOption((option) => option.setName('command').setDescription('The command you want to send').setRequired(true))
    //new SlashCommandBuilder().setName('link').setDescription('Bans players on the realm.').addStringOption((option) => option.setName('gamertag').setDescription('The player you want to ban').setRequired(true)),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log('Successfully registered application commands.');
    } catch (error) {
        console.error(error);
    }
})();