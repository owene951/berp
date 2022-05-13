"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
class CommandManager {
    constructor(berp) {
        this._prefix = '-';
        this._commands = new Map();
        this._berp = berp;
    }
    _parseCommand(content) {
        const command = content.replace(this._prefix, '').split(' ')[0];
        const args = content.replace(`${this._prefix}${command} `, '').split(' ');
        if (args[0] == `${this._prefix}${command}`)
            args[0] = undefined;
        return {
            command: command,
            args: args,
        };
    }
    async executeCommand(data) {
        const parsedCommand = this._parseCommand(data.command);
        if (!this._commands.has(parsedCommand.command))
            return data.sender.sendMessage("§cThis command doesn't exsist!");
        const commandData = this._commands.get(parsedCommand.command);
        if (!commandData.options.permissionTags)
            return commandData.execute({
                sender: data.sender,
                args: parsedCommand.args,
            });
        const tags = await data.sender.getTags();
        const found = tags.some(r => commandData.options.permissionTags.indexOf(r) >= 0);
        if (!found)
            return data.sender.sendMessage('§cYou dont have permission to use this command!');
        return commandData.execute({
            sender: data.sender,
            args: parsedCommand.args,
        });
    }
    registerCommand(options, callback) {
        if (this._commands.has(options.command))
            return;
        this._commands.set(options.command, {
            options: options,
            showInList: true,
            execute: callback,
        });
        if (!options.aliases)
            return;
        for (const aliases of options.aliases) {
            if (this._commands.has(aliases))
                continue;
            this._commands.set(aliases, {
                options: options,
                showInList: false,
                execute: callback,
            });
        }
    }
    unregisterCommand(options, type) {
        switch (type) {
            case "game":
                if (!this._commands.has(options.command))
                    return;
                this._commands.delete(options.command);
                if (!options.aliases)
                    return;
                for (const aliases of options.aliases) {
                    this._commands.delete(aliases);
                }
                break;
            case "console":
                this._berp.getCommandHandler().unregisterCommand(options);
                break;
            default:
                this._berp.getLogger().error('Unknown unregister type!');
                break;
        }
    }
    getCommands() { return this._commands; }
    getPrefix() { return this._prefix; }
    setPrefix(prefix) { this._prefix = prefix; }
}
exports.CommandManager = CommandManager;
