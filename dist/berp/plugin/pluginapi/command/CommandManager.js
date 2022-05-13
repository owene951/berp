"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
const uuid_1 = require("uuid");
const Constants_1 = require("../../../../Constants");
const ConsoleCommand_1 = require("./ConsoleCommand");
class CommandManager {
    constructor(berp, connection, pluginApi) {
        this._requests = new Map();
        this._commands = new Map();
        this.enabled = true;
        this._berp = berp;
        this._connection = connection;
        this._pluginApi = pluginApi;
    }
    async onEnabled() {
        this._connection.on('command_output', (packet) => {
            if (!packet)
                return;
            if (!this._requests.has(packet.origin.uuid))
                return;
            this._requests.get(packet.origin.uuid).execute(packet);
        });
        this._pluginApi.getEventManager().on('ChatCommand', async (data) => {
            if (this._pluginApi.getPluginId() != 1 || !this.enabled)
                return;
            this._berp.getCommandManager().executeCommand(data);
            this._connection.sendCommandFeedback(false);
        });
        this._defaultCommands();
        return;
    }
    async onDisabled() {
        for (const [, command] of this._commands) {
            if (command.command.command == "help" || command.command.command == "about")
                continue;
            this._berp.getCommandManager().unregisterCommand(command.command, command.type);
        }
    }
    _defaultCommands() {
        this.registerCommand({
            command: 'help',
            description: `Displays a list of available commands.`,
            aliases: ['h'],
        }, (data) => {
            data.sender.sendMessage(`§bShowing all Available Commands:`);
            this._berp.getCommandManager().getCommands()
                .forEach((command) => {
                if (!command.showInList)
                    return;
                data.sender.sendMessage(` §7${this._berp.getCommandManager().getPrefix()}${command.options.command}§r §o§8- ${command.options.description}§r`);
            });
        });
        this.registerCommand({
            'command': 'about',
            'description': 'Shows info about the server.',
            'aliases': ['ab'],
        }, (data) => {
            data.sender.sendMessage(`§7This server is running §9BeRP v${Constants_1.BeRP_VERSION}§7 for §aMinecraft: Bedrock Edition v${Constants_1.CUR_VERSION} §7(§a${Constants_1.CUR_VERSION_PROTOCOL}§7).`);
        });
    }
    executeCommand(command, callback) {
        if (command.startsWith('say' || 'tellraw' || 'me' || 'titleraw'))
            callback = undefined;
        const requestId = (0, uuid_1.v4)();
        if (callback) {
            this._connection.sendCommandFeedback(true);
            this._requests.set(requestId, { execute: callback });
        }
        this._connection.sendPacket('command_request', {
            command: command,
            interval: false,
            origin: {
                uuid: requestId,
                request_id: requestId,
                type: 'player',
            },
        });
    }
    registerCommand(options, callback) {
        this._commands.set(`${options.command}:game`, {
            type: 'game',
            command: options,
        });
        this._berp.getCommandManager().registerCommand(options, (data) => {
            callback(data);
        });
    }
    registerConsoleCommand(options, callback) {
        this._commands.set(`${options.command}:console`, {
            type: 'console',
            command: options,
        });
        const command = new ConsoleCommand_1.ConsoleCommand(options, callback);
        this._berp.getCommandHandler().registerCommand(command);
    }
    getPrefix() { return this._berp.getCommandManager().getPrefix(); }
    setPrefix(prefix) { this._berp.getCommandManager().setPrefix(prefix); }
}
exports.CommandManager = CommandManager;
