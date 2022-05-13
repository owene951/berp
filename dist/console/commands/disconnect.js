"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Disconnect = void 0;
const BaseCommand_1 = require("./base/BaseCommand");
class Disconnect extends BaseCommand_1.BaseCommand {
    constructor(berp) {
        super();
        this.name = "disconnect";
        this.description = "Disconnect from a realm.";
        this.usage = "";
        this.aliases = [
            "dc",
        ];
        this._berp = berp;
    }
    execute() {
        const accounts = this._berp.getNetworkManager().getAccounts();
        if (!accounts.size)
            return this._berp.getCommandHandler().error("There are no active connections!");
        const accountsWithActualConnections = Array.from(accounts.entries())
            .filter(([, v]) => v.getConnections().size > 0);
        if (!accountsWithActualConnections.length)
            return this._berp.getCommandHandler().error("There are no active connections!");
        this._berp.getConsole()
            .sendSelectPrompt("Select an account to manage its connections", accountsWithActualConnections.map(([, v]) => `${v.getAccount().name} (${v.getAccount().username})`))
            .then(r => {
            if (r) {
                try {
                    const username = /\(.*\)/.exec(r)[0].replace(/(\(|\))/g, "");
                    const account = accounts.get(username);
                    if (!account) {
                        return this._berp.getNetworkManager().getLogger()
                            .error(`Failed to select account "${username}"`);
                    }
                    const connections = Array.from(account.getConnections().entries());
                    this._berp.getConsole()
                        .sendSelectPrompt("Select which realm you would like to disconnect from", connections.map(([k, v]) => `${v.realm.name.replace(/§\S/g, "")} (${k})`))
                        .then(async (r) => {
                        if (r) {
                            try {
                                const id = /\(.*\)/.exec(r)[0].replace(/(\(|\))/g, "");
                                const realm = account.getConnections().get(parseInt(id));
                                if (!realm) {
                                    return this._berp.getNetworkManager().getLogger()
                                        .error(`Failed to select realm "${r}"`);
                                }
                                await this._berp.getPluginManager().killPlugins(realm);
                                realm.close();
                            }
                            catch (error) {
                                return this._berp.getNetworkManager().getLogger()
                                    .error(`Failed to select account for realm disconnection...\n`, error);
                            }
                        }
                        else {
                            this._berp.getCommandHandler().error("Disconnection process canceled!");
                        }
                    });
                }
                catch (error) {
                    return this._berp.getNetworkManager().getLogger()
                        .error(`Failed to select account for realm disconnection...\n`, error);
                }
            }
            else {
                this._berp.getCommandHandler().error("Disconnection process canceled!");
            }
        });
    }
}
exports.Disconnect = Disconnect;
