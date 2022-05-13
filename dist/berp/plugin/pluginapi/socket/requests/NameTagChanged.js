"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameTagChanged = void 0;
class NameTagChanged {
    constructor(socket, berp, connection, pluginApi) {
        this.requestName = "NameTagChanged";
        this._socket = socket;
        this._berp = berp;
        this._connection = connection;
        this._pluginApi = pluginApi;
    }
    onEnabled() {
        this._socket.on("NameTagChanged", (packet) => {
            if (!this._pluginApi.getPlayerManager().getPlayerList()
                .has(packet.player) || packet.player === this._connection.getXboxProfile().extraData.displayName)
                return;
            const player = this._pluginApi.getPlayerManager().getPlayerByName(packet.player);
            player.setNameTagBackDoor(packet.data.new);
        });
    }
    onDisabled() {
        //
    }
}
exports.NameTagChanged = NameTagChanged;
