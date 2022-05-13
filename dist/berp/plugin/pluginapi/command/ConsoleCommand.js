"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleCommand = void 0;
const BaseCommand_1 = require("../../../../console/commands/base/BaseCommand");
class ConsoleCommand extends BaseCommand_1.BaseCommand {
    constructor(options, callback) {
        super();
        this.name = options.command;
        this.description = options.description;
        this.usage = options.usage,
            this.aliases = options.aliases;
        this.callback = callback;
    }
    async execute(args) {
        this.callback(args);
    }
}
exports.ConsoleCommand = ConsoleCommand;
