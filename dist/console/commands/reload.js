"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reload = void 0;
const BaseCommand_1 = require("./base/BaseCommand");
class Reload extends BaseCommand_1.BaseCommand {
    constructor(berp) {
        super();
        this.name = "reload";
        this.description = "Reload all plugins.";
        this.usage = "";
        this.aliases = [
            "r",
        ];
        this._berp = berp;
    }
    execute() {
        this._berp.getLogger().info("Attemping to reload all plugins...");
        this._berp.getPluginManager().reload();
    }
}
exports.Reload = Reload;
