"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerManager = void 0;
const Player_1 = require("./Player");
class PlayerManager {
    constructor(berp, connection, pluginApi) {
        this._players = {
            name: new Map(),
            nameTag: new Map(),
            uuid: new Map(),
            xuid: new Map(),
            entityID: new Map(),
        };
        this._berp = berp;
        this._connection = connection;
        this._pluginApi = pluginApi;
    }
    async onEnabled() {
        for (const player of this._connection.playerQue) {
            new Player_1.Player({
                name: player.username,
                uuid: player.uuid,
                xuid: player.xbox_user_id,
                entityID: player.entity_unique_id,
                device: player.build_platform,
                skinData: player.skin_data,
            }, this._berp, this._connection, this._pluginApi);
        }
    }
    async onDisabled() {
        return;
    }
    addPlayer(player) {
        this._players.name.set(player.getName(), player);
        this._players.nameTag.set(player.getNameTag(), player);
        this._players.uuid.set(player.getUUID(), player);
        this._players.xuid.set(player.getXuid(), player);
        this._players.entityID.set(player.getEntityID(), player);
    }
    removePlayer(player) {
        this._players.name.delete(player.getName());
        this._players.nameTag.delete(player.getNameTag());
        this._players.uuid.delete(player.getUUID());
        this._players.xuid.delete(player.getXuid());
        this._players.entityID.delete(player.getEntityID());
    }
    getPlayerByName(name) { return this._players.name.get(name); }
    getPlayerByNameTag(nameTag) { return this._players.nameTag.get(nameTag); }
    getPlayerByUUID(uuid) { return this._players.uuid.get(uuid); }
    getPlayerByXuid(xuid) { return this._players.xuid.get(xuid); }
    getPlayerByEntityID(entityID) { return this._players.entityID.get(entityID); }
    getPlayerList() { return this._players.name; }
    updatePlayerNameTag(player, nameTag, emit = true) {
        this._players.nameTag.delete(player.getNameTag());
        this._players.nameTag.set(nameTag, player);
        if (!emit)
            return;
        this._pluginApi.getSocketManager().sendMessage({
            berp: {
                event: 'UpdateNameTag',
                player: player.getName(),
                message: nameTag,
                requestId: this._pluginApi.getSocketManager().newUUID(),
            },
        });
    }
}
exports.PlayerManager = PlayerManager;
