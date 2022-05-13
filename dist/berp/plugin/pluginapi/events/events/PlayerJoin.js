"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerJoin = void 0;
const Player_1 = require("../../player/Player");
class PlayerJoin {
    constructor(events, berp, connection, pluginApi) {
        this.eventName = "PlayerJoin";
        this._events = events;
        this._berp = berp;
        this._connection = connection;
        this._pluginApi = pluginApi;
        this._connection.on('player_list', (packet) => {
            for (const player of packet.records.records) {
                if (this._pluginApi.getPlayerManager().getPlayerList()
                    .has(player.username) || packet.records.type != 'add')
                    continue;
                return this._events.emit('PlayerJoin', new Player_1.Player({
                    name: player.username,
                    uuid: player.uuid,
                    xuid: player.xbox_user_id,
                    entityID: player.entity_unique_id,
                    device: player.build_platform,
                    skinData: player.skin_data,
                }, this._berp, this._connection, this._pluginApi));
            }
        });
    }
}
exports.PlayerJoin = PlayerJoin;
