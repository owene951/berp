"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Heartbeat = void 0;
class Heartbeat {
    constructor(socket, berp, connection, pluginApi) {
        this.requestName = "Heartbeat";
        this._socket = socket;
        this._berp = berp;
        this._connection = connection;
        this._pluginApi = pluginApi;
        this._totalBeats = 0;
    }
    onEnabled() {
        this._socket.on('Message', (packet) => {
            if (packet.event != "Heartbeat")
                return;
            this._totalBeats++;
        });
    }
    onDisabled() {
        //
    }
    getTotalBeats() { return this._totalBeats; }
}
exports.Heartbeat = Heartbeat;
