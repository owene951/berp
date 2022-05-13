"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerDied = void 0;
class PlayerDied {
    constructor(events, berp, connection, pluginApi) {
        this.eventName = "PlayerDied";
        this._events = events;
        this._berp = berp;
        this._connection = connection;
        this._pluginApi = pluginApi;
        this._connection.on('text', (packet) => {
            if (!packet.message.startsWith('death') || packet.paramaters[0] == this._connection.getXboxProfile().extraData.displayName)
                return;
            return this._events.emit('PlayerDied', {
                player: this._pluginApi.getPlayerManager().getPlayerByName(packet.paramaters[0]),
                killer: this._pluginApi.getPlayerManager().getPlayerByName(packet.paramaters[1]) || packet.paramaters[1],
                cause: packet.message.replace('death.', '').replace(/.generic/g, ''),
            });
        });
    }
}
exports.PlayerDied = PlayerDied;
