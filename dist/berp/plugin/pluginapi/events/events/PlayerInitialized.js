"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerInitialized = void 0;
class PlayerInitialized {
    constructor(events, berp, connection, pluginApi) {
        this.eventName = "PlayerInitialized";
        this._events = events;
        this._berp = berp;
        this._connection = connection;
        this._pluginApi = pluginApi;
        this._connection.on('text', (packet) => {
            if (packet.message !== '§e%multiplayer.player.joined.realms')
                return;
            return this._events.emit('PlayerInitialized', this._pluginApi.getPlayerManager().getPlayerByName(packet.paramaters[0]));
        });
    }
}
exports.PlayerInitialized = PlayerInitialized;
