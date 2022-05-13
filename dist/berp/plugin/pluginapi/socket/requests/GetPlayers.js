"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPlayers = void 0;
class GetPlayers {
    constructor(socket, berp, connection, pluginApi) {
        this.requestName = "GetPlayers";
        this._socket = socket;
        this._berp = berp;
        this._connection = connection;
        this._pluginApi = pluginApi;
    }
    onEnabled() {
        this._socket.on("Enabled", () => {
            this._socket.sendPacket("GetPlayers", undefined, (res) => {
                for (const entry of res.data) {
                    if (!this._pluginApi.getPlayerManager().getPlayerList()
                        .has(entry.name))
                        continue;
                    if (entry.name == this._connection.getXboxProfile().extraData.displayName)
                        continue;
                    const player = this._pluginApi.getPlayerManager().getPlayerByName(entry.name);
                    if (player.getNameTag() == entry.nameTag)
                        continue;
                    player.setNameTagBackDoor(entry.nameTag);
                }
            });
        });
    }
    onDisabled() {
        //
    }
}
exports.GetPlayers = GetPlayers;
