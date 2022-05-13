"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerMessage = void 0;
class PlayerMessage {
    constructor(socket, berp, connection, pluginApi) {
        this.requestName = "PlayerMessage";
        this._socket = socket;
        this._berp = berp;
        this._connection = connection;
        this._pluginApi = pluginApi;
    }
    onEnabled() {
        this._socket.on("PlayerMessage", (packet) => {
            if (!packet.message.startsWith(this._pluginApi.getCommandManager().getPrefix()))
                return this._pluginApi.getEventManager().emit("PlayerMessage", {
                    message: packet.message,
                    sender: this._pluginApi.getPlayerManager().getPlayerByName(packet.player.name || packet.player.nameTag),
                });
            return this._pluginApi.getEventManager().emit("ChatCommand", {
                command: packet.message,
                sender: this._pluginApi.getPlayerManager().getPlayerByName(packet.player.name || packet.player.nameTag),
            });
        });
    }
    onDisabled() {
        //
    }
}
exports.PlayerMessage = PlayerMessage;
