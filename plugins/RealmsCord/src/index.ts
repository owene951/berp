import { PluginApi } from "./@interface/pluginApi.i";
//import Jimp from "jimp";
const {
  Client,
  Intents,
  MessageEmbed,
  MessageAttachment,
} = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
// import { REST } from "@discordjs/rest";
// import { Routes } from "discord-api-types/v9";

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('node:fs');

const { token, channelId, clientId, guildId } = require("../config.json");
// const client = new Client({
//         intents: [
//           Intents.FLAGS.GUILDS,
//           Intents.FLAGS.GUILD_MESSAGES,
//           Intents.FLAGS.GUILD_MEMBERS,
//           ],
//         });

const {
  realmName,
  realmId,
  accountEmail,
  verboseMessageEvents,
  attemptAutoConnect,
} = require("../moreconfig.json");

function getSavedPic(eventXuid){
    const tempPicMap = {
        2533274884028261: "https://cdn.discordapp.com/avatars/269249777185718274/a_f7a7df655ec0c612ec4e42094adc1903.png"
    }
    if (eventXuid in tempPicMap) {
	    return tempPicMap[eventXuid]
	} else {
	    return "https://i.imgur.com/7ltWLoa.png"
	}
}


class DiscBot {
    private api: PluginApi
    private client: typeof Client
    constructor(api: PluginApi) {
        this.api = api;
        this.client = new Client({
        intents: [
          Intents.FLAGS.GUILDS,
          Intents.FLAGS.GUILD_MESSAGES,
          Intents.FLAGS.GUILD_MEMBERS,
          ],
        });
        }
	
    async onLoaded(): Promise<void> {
        this.api.getLogger().info("Discord-MC Bridge loaded!");
	    this.api.getLogger().info("Attempting auto-connection with realm...");
	    try {
	        this.api.autoConnect(accountEmail, realmId)
        }
	    catch(error) {
	        this.api.getLogger().error("AutoConnect failed... Attempting reconnect", error)
			try {
			    this.api.autoReconnect(accountEmail, realmId)
			}
			catch(anotherError) {
			    this.api.getLogger().error("AuReconnect failed. Skipping...", anotherError)
			}
        }
    }
    async onEnabled(): Promise<void> {
	this.api.getLogger().info("Discord-MC Bridge enabled! (onEnabled)");
	this.api.getLogger().info("Discord-MC Bridge connecting to Discord Client...");
        let client = this.client
        client.login(token);
	this.api.getLogger().info("Discord-MC Bridge login complete.");
        client.on("ready", async () => {
            this.api.getLogger().info("Discord-MC Bridge Client Ready, setting activity...");
            client.user.setActivity(`over Blazed Skygen`, { type: "WATCHING" })
	    this.api.getLogger().info("Discord-MC Bridge Activity set.");
            this.api.getLogger().info(`Now bridged with Discord as ${client.user.username}`);
            const fancyStartMSG = new MessageEmbed()
                .setColor("#58f288")
                .setDescription(`<:green_square:974030315674808430> **Blaze's Discord chat bridge Connected!**`);
            client.channels
                .fetch(channelId)
                .then(async (channel) => await channel.send({ embeds: [fancyStartMSG] }).catch((error) => {
                this.api.getLogger().error(error);
            }))
                .catch((error) => {
                this.api.getLogger().error(error);
            });
            
            this.api
                .getCommandManager()
                .executeCommand(`tellraw @a {\"rawtext\":[{\"text\":\"§a§l§oBlaze's Discord chat bridge Connected!\"}]}`);
            const guild = await client.guilds.fetch(guildId);
            const cmds = await guild.commands.fetch();
            let arr = [];
            cmds.forEach((cmd) => {
                arr.push(cmd.name);
            });
            const commands = [
                new SlashCommandBuilder()
                    .setName("players")
                    .setDescription("Gets a list of people currently on the realm."),
                ].map((command) => command.toJSON());
                const rest = new REST({ version: "9" }).setToken(token);
                async () => {
                    try {
                        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
                            body: commands,
                        });
                        this.api
                            .getLogger()
                            .success("Successfully registered the list command.");
                    }
                    catch (error) {
                        this.api.getLogger().error("Error occurred while attempting to register list command", error);
                    }
                };
            
        });
        client.on("messageCreate", (message) => {
            if (message.author.bot)
                return;
            if (message.channel.id == channelId) {
			    if (verboseMessageEvents) {
				    this.api.getLogger().success("Received new message event from the Discord client:");
				    this.api.getLogger().success(`   "${message.content}"`);
				}
                this.api
                    .getCommandManager()
                    .executeCommand(`tellraw @a {\"rawtext\":[{\"text\":\"§8[§9Discord§8]§f §7${message.author.username}§f: ${message.content}\"}]}`);
            }
        });
        this.api.getEventManager().on("PlayerMessage", async (packet) => {
		    if (verboseMessageEvents) {
				this.api.getLogger().success("Received new message event from the Realms client:");
				this.api.getLogger().success(`   "${packet.message}"`);
                let eventXuid = packet.sender.getXuid()
                const fancySendMSG = new MessageEmbed()
                    .setColor("#5765f2")
                    .setTitle(`<:purple_square:974030899761000518> [${packet.sender.getDevice()}] **${packet.sender.getName()}**: ${packet.message}`)
                return client.channels
                    .fetch(channelId)
                    .then(async (channel) => await channel.send({ embeds: [fancySendMSG] }))
                    .catch((error) => {
                    this.api.getLogger().error(error);
                });
            }
        });
        this.api.getEventManager().on("PlayerInitialized", (userJoin) => {
			let eventXuid = userJoin.getXuid()
            const fancyJoinMSG = new MessageEmbed()
                .setColor("#58f288")
                .setTitle(`<:green_square:974030315674808430> Member Join`)
                .setDescription(`**${userJoin.getName()}**\n**XUID**: [${eventXuid}]\n**Device**: ${userJoin.getDevice()}`);
            return client.channels
                .fetch(channelId)
                .then(async (channel) => await channel.send({ embeds: [fancyJoinMSG] }))
                .catch((error) => {
                this.api.getLogger().error(error);
            });
        });
		/*this.api.getEventManager().on("PlayerDied", (userDied) => {
            const fancyDiedMSG = new MessageEmbed()
                .setColor("#ff0000")
                .setDescription(`**${userDied.player}** was just killed by ${userDied.killer}.`);
            return client.channels
                .fetch(channelId)
                .then(async (channel) => await channel.send({ embeds: [fancyDiedMSG] }))
                .catch((error) => {
					this.api.getLogger().error(error);
            });
        });*/
        this.api.getEventManager().on("PlayerLeft", async (userLeave) => {
            let eventXuid = userLeave.getXuid()
            const fancyLeaveMSG = new MessageEmbed()
                .setColor("#ec4244")
                .setTitle(`<:red_square:974031193177722891> Member Left`)
                .setDescription(`**${userLeave.getName()}**\n**XUID**: [${eventXuid}]\n**Device**: ${userLeave.getDevice()}`);
            return client.channels
                .fetch(channelId)
                .then(async (channel) => await channel.send({ embeds: [fancyLeaveMSG] }))
                .catch((error) => {
					this.api.getLogger().error(error);
            });
        });
        client.on("interactionCreate", async (interaction) => {
            if (!interaction.isCommand())
                return;
            const { commandName } = interaction;
            if (commandName === "players") {
                const realmName = this.api.getConnection().realm.name;
                let response = `/10 Players Online**:`;
                let players = [];
                response += `\n*-*`;
                for (const [, p] of this.api.getPlayerManager().getPlayerList()) {
                    players.push(p.getName());
                    response += `\n*-* ${p.getName()}`;
                }
                const fancyResponse = new MessageEmbed()
                    .setColor("#e987ff")
                    .setTitle(`${realmName}`)
                    .setDescription(`**${players.length + 1}${response}`);
                await interaction
                    .reply({ embeds: [fancyResponse] })
                    .catch((error) => {
						this.api.getLogger().error(error);
                });
            }
        });
    }
    onDisabled() {
        let client = this.client
        const fancyStopMSG = new MessageEmbed()
            .setColor("#ec4244")
            .setDescription("<:red_square:974031193177722891> ***Blaze's Discord chat bridge has been disconnected.***");
        client.channels
            .fetch(channelId)
            .then(async (channel) => await channel.send({ embeds: [fancyStopMSG] }).catch((error) => {
            this.api.getLogger().error(error);
        })).catch((error) => {
            this.api.getLogger().error(error);
        });
    }
}

export = DiscBot;
