"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRequests = void 0;
class GetRequests {
    constructor(socket, berp, connection, pluginApi) {
        this.requestName = "GetRequests";
        this.requests = new Map();
        this._socket = socket;
        this._berp = berp;
        this._connection = connection;
        this._pluginApi = pluginApi;
    }
    onEnabled() {
        this._socket.on("Enabled", () => {
            this._socket.sendMessage({
                berp: {
                    event: "GetRequests",
                    requestId: this._socket.newUUID(),
                },
            }, (res) => {
                for (const request of res.data) {
                    this.requests.set(request.request, request);
                }
            });
        });
        this._socket.on('Message', (packet) => {
            if (packet.event != "EnableSocket" || this._socket.enabled == true)
                return;
            this._socket.enabled = true;
            this._socket.emit("Enabled", packet);
            return this._socket.sendMessage({
                berp: {
                    event: "GetRequests",
                    requestId: packet.requestId,
                },
            });
        });
    }
    onDisabled() {
        //
    }
    getRequests() { return this.requests; }
}
exports.GetRequests = GetRequests;
