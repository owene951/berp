"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kill = void 0;
const BaseCommand_1 = require("./base/BaseCommand");
class Kill extends BaseCommand_1.BaseCommand {
    constructor(berp) {
        super();
        this.name = "kill";
        this.description = "Unsafe shutdown! Kills process without preforming an exit.";
        this.usage = "";
        this.aliases = [
            "k",
        ];
        this._berp = berp;
    }
    execute() {
        process.kill(process.pid);
    }
}
exports.Kill = Kill;
