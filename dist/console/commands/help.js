"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Help = void 0;
const BaseCommand_1 = require("./base/BaseCommand");
const chalk_1 = __importDefault(require("chalk"));
class Help extends BaseCommand_1.BaseCommand {
    constructor(berp) {
        super();
        this.name = "help";
        this.description = "Get a list of all available commands or info on a specfic command.";
        this.usage = "[command]";
        this.aliases = [
            "h",
        ];
        this._berp = berp;
    }
    execute(args) {
        const commands = this._berp.getCommandHandler().getCommands();
        if (!args[0]) {
            let log = `${chalk_1.default.blueBright("Active BeRP Session - Command List:")}\n`;
            for (const command of commands.values()) {
                if (command.showInList == false)
                    continue;
                log += `${chalk_1.default.gray("  -")}   ${chalk_1.default.grey(`${command.options.name}`)}\n`;
            }
            console.log(log);
        }
        else {
            const commandName = args[0].toLowerCase();
            const command = [...commands.values()].find(c => c.options.name === commandName || c.options.name.includes(commandName));
            if (!command)
                return this._berp.getCommandHandler().error(`Unknown commmand "${commandName}"!`);
            console.log(`${chalk_1.default.blueBright(`Active BeRP Session - Command - ${commandName}:`)}\n${chalk_1.default.gray("  name:")}           ${chalk_1.default.gray(command.options.name)}\n${chalk_1.default.gray("  usage:")}          ${command.options.usage ? `${chalk_1.default.gray(commandName)} ${chalk_1.default.gray(command.options.usage)}` : ""}\n${chalk_1.default.gray("  description:")}    ${chalk_1.default.gray(command.options.description)}\n${chalk_1.default.gray("  aliases:")}        ${chalk_1.default.gray(command.options.aliases?.join(chalk_1.default.gray(", ")))}\n`);
        }
    }
}
exports.Help = Help;
