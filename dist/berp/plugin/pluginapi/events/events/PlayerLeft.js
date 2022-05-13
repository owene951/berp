"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerLeft = void 0;
class PlayerLeft {
    constructor(events, berp, connection, pluginApi) {
        this.eventName = "PlayerLeft";
        this._events = events;
        this._berp = berp;
        this._connection = connection;
        this._pluginApi = pluginApi;
        this._connection.on('player_list', (packet) => {
            for (const record of packet.records.records) {
                if (packet.records.type != 'remove')
                    continue;
                const player = this._pluginApi.getPlayerManager().getPlayerByUUID(record.uuid);
                this._pluginApi.getPlayerManager()
                    .removePlayer(player);
                return this._events.emit('PlayerLeft', player);
            }
        });
    }
}
exports.PlayerLeft = PlayerLeft;
