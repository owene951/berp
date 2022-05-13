"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerMessage = void 0;
class PlayerMessage {
    constructor(events, berp, connection, pluginApi) {
        this.eventName = "PlayerMessage";
        this._events = events;
        this._berp = berp;
        this._connection = connection;
        this._pluginApi = pluginApi;
        this._connection.on('text', (packet) => {
            if (packet.type !== 'chat' || packet.source_name == this._connection.getXboxProfile().extraData.displayName)
                return;
            const sender = this._pluginApi.getPlayerManager().getPlayerByName(packet.source_name);
            if (!packet.message.startsWith(this._pluginApi.getCommandManager().getPrefix()))
                return this._events.emit('PlayerMessage', {
                    sender: sender,
                    message: packet.message,
                });
            if (sender.getRealmID() != this._connection.realm.id)
                return;
            return this._events.emit('ChatCommand', {
                sender: sender,
                command: packet.message,
            });
        });
    }
}
exports.PlayerMessage = PlayerMessage;
