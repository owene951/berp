"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandler = void 0;
const console_1 = require("../console");
const commands_1 = require("./commands");
const chalk_1 = __importDefault(require("chalk"));
class CommandHandler {
    constructor(berp) {
        this._commands = new Map();
        this._logger = new console_1.Logger("CLI Command Handler", '#ff6969');
        this._berp = berp;
        this._buildCommands();
        this._berp.getConsole().on('input', this._handleConsole.bind(this));
        this._logger.success('Type "help" for a list of commands.');
    }
    getLogger() { return this._logger; }
    _handleConsole(i) {
        const args = i.split(/ /g).filter(i => i.length > 0);
        if (!args[0])
            return;
        const commandName = args.shift().toLowerCase();
        const command = this._commands.get(commandName);
        if (!command)
            return console.log(chalk_1.default.red(`Invalid commmand "${commandName}" use "help" to see all commands!`));
        try {
            command.options.execute(args);
        }
        catch (error) {
            this._logger.error(error);
        }
    }
    _buildCommands() {
        for (const command of commands_1.Commands) {
            const newCommand = new command(this._berp);
            this._commands.set(newCommand.name, {
                options: newCommand,
                showInList: true,
            });
            for (const aliases of newCommand.aliases) {
                this._commands.set(aliases, {
                    options: newCommand,
                    showInList: false,
                });
            }
        }
    }
    registerCommand(command) {
        this._commands.set(command.name, {
            options: command,
            showInList: true,
        });
        for (const aliases of command.aliases) {
            this._commands.set(aliases, {
                options: command,
                showInList: false,
            });
        }
    }
    unregisterCommand(command) {
        if (!this._commands.has(command.command))
            return;
        this._commands.delete(command.command);
    }
    getCommands() { return this._commands; }
    error(err) {
        console.error(chalk_1.default.red(err));
    }
}
exports.CommandHandler = CommandHandler;
