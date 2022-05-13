"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quit = void 0;
const BaseCommand_1 = require("./base/BaseCommand");
class Quit extends BaseCommand_1.BaseCommand {
    constructor(berp) {
        super();
        this.name = "quit";
        this.description = "Quit CLI and safely disable all plugin instances.";
        this.usage = "";
        this.aliases = [
            "q",
            "exit",
            "stop",
        ];
        this._berp = berp;
    }
    async execute() {
        await this._berp.getPluginManager().killAllPlugins();
        this._berp.getConsole().stop();
        this._berp.getSequentialBucket().pauseFlush();
        this._berp.getSequentialBucket().emptyBucket();
        this._berp.getSequentialBucket().emptyFailedBucket();
        this._berp.getNetworkManager().kill();
        this._berp.getPluginManager().killTempPlugins();
    }
}
exports.Quit = Quit;
