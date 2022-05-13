"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connections = void 0;
const BaseCommand_1 = require("./base/BaseCommand");
const chalk_1 = __importDefault(require("chalk"));
class Connections extends BaseCommand_1.BaseCommand {
    constructor(berp) {
        super();
        this.name = "connections";
        this.description = "Get a list of all current realm connection.";
        this.usage = "";
        this.aliases = [
            "cs",
        ];
        this._berp = berp;
    }
    execute() {
        const accounts = this._berp.getNetworkManager().getAccounts();
        let log = `${chalk_1.default.blueBright("Active BeRP Session - Connections:")}\n`;
        if (!accounts.size)
            return console.log(log += chalk_1.default.red("  No active connections. Use \"connect\" to connect a realm!"));
        const lastAct = Array.from(accounts.keys())[accounts.size - 1];
        log += chalk_1.default.gray(`  │\n`);
        for (const [username, conn] of accounts) {
            if (username === lastAct) {
                log += chalk_1.default.gray(`  └──${username}\n`);
            }
            else {
                log += chalk_1.default.gray(`  ├──${username}\n`);
            }
            if (conn.getConnections().size) {
                const lastCon = Array.from(conn.getConnections().keys())[conn.getConnections().size - 1];
                for (const [id, con] of conn.getConnections()) {
                    if (username !== lastAct) {
                        log += chalk_1.default.gray(`  │`);
                    }
                    else {
                        log += chalk_1.default.gray(`   `);
                    }
                    if (lastCon === id) {
                        log += chalk_1.default.gray(`  └──${con.realm.name.replace(/§\S/g, "")} (${id})\n`);
                    }
                    else {
                        log += chalk_1.default.gray(`  ├──${con.realm.name.replace(/§\S/g, "")} (${id})\n`);
                    }
                }
            }
            if (username !== lastAct)
                log += chalk_1.default.gray(`  │\n`);
        }
        console.log(log);
    }
}
exports.Connections = Connections;
// ─│├ └
