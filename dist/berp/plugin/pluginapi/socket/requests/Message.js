"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
class Message {
    constructor(socket, berp, connection, pluginApi) {
        this.requestName = "Message";
        this._socket = socket;
        this._berp = berp;
        this._connection = connection;
        this._pluginApi = pluginApi;
    }
    onEnabled() {
        this._socket.on("Message", (packet) => {
            this._socket.emit(packet.event, packet);
        });
    }
    onDisabled() {
        //
    }
}
exports.Message = Message;
