"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plugins = void 0;
const BaseCommand_1 = require("./base/BaseCommand");
const chalk_1 = __importDefault(require("chalk"));
class Plugins extends BaseCommand_1.BaseCommand {
    constructor(berp) {
        super();
        this.name = "plugins";
        this.description = "Get a list of all loaded plugins and their connections.";
        this.usage = "";
        this.aliases = [
            "pl",
        ];
        this._berp = berp;
    }
    execute() {
        const plugins = [];
        for (const [, pl] of this._berp.getPluginManager().getPlugins()) {
            plugins.push(`${pl.config.displayName || pl.config.name} v${pl.config.version} -- ${pl.config.description}`);
        }
        console.log(chalk_1.default.blueBright(`Found ${plugins.length} loaded plugin(s)!`));
        console.log(chalk_1.default.gray(plugins.join("\n")));
    }
}
exports.Plugins = Plugins;
