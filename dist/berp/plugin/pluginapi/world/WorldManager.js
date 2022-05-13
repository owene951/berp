"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldManager = void 0;
class WorldManager {
    constructor(berp, connection, pluginApi) {
        this._berp = berp;
        this._connection = connection;
        this._pluginApi = pluginApi;
    }
    async onEnabled() {
        return;
    }
    async onDisabled() {
        return;
    }
    sendMessage(message) {
        this._pluginApi.getCommandManager().executeCommand(`tellraw @a {"rawtext":[{"text":"${message}"}]}`);
    }
    kickAll(reason) {
        for (const [, player] of this._pluginApi.getPlayerManager().getPlayerList()) {
            player.kick(reason);
        }
    }
}
exports.WorldManager = WorldManager;
