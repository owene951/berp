"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketManager = void 0;
const events_1 = require("events");
const index_1 = require("./requests/index");
const uuid_1 = require("uuid");
class SocketManager extends events_1.EventEmitter {
    constructor(berp, connection, pluginApi) {
        super();
        this._requests = new Map();
        this._defaultRequests = new Map();
        this._berp = berp;
        this._connection = connection;
        this._pluginApi = pluginApi;
        this.enabled = false;
    }
    async onEnabled() {
        this._listener();
        this._loadRequests();
        setTimeout(() => this._pluginApi.getCommandManager().executeCommand('tag @s add "berpUser"'), 3500);
    }
    async onDisabled() {
        for (const [, request] of this._defaultRequests) {
            request.onDisabled();
        }
    }
    _listener() {
        this._connection.on('text', (packet) => {
            try {
                if (packet.type !== 'json_whisper')
                    return;
                const parsedMessage = JSON.parse(packet.message);
                if (!parsedMessage.rawtext[0].text.startsWith('{"berp":'))
                    return;
                const message = [];
                for (const raw of parsedMessage.rawtext) {
                    message.push(raw.text);
                }
                const data = JSON.parse(message.join('').replace(/\n/g, "\\n"));
                if (this._requests.has(`${data.berp.requestId}:${data.berp.event}`)) {
                    this._requests.get(`${data.berp.requestId}:${data.berp.event}`).execute(data.berp);
                    this._requests.delete(`${data.berp.requestId}:${data.berp.event}`);
                }
                return this.emit('Message', data.berp);
            }
            catch (err) {
                console.log(packet.message);
                console.log(`caught: ${err}`);
            }
        });
    }
    _loadRequests() {
        for (const request of index_1.defaultRequests) {
            const newRequest = new request(this, this._berp, this._connection, this._pluginApi);
            newRequest.onEnabled();
            this._defaultRequests.set(newRequest.requestName, newRequest);
        }
    }
    sendMessage(options, callback) {
        if (callback)
            this._requests.set(`${options.berp.requestId}:${options.berp.event}`, { execute: callback });
        this._connection.sendPacket('text', {
            message: JSON.stringify(options),
            needs_translation: false,
            platform_chat_id: '',
            source_name: this._connection.getXboxProfile().extraData.displayName,
            type: 'chat',
            xuid: this._connection.getXboxProfile().extraData.XUID,
        });
    }
    // @ts-ignore
    sendPacket(name, params, callback) {
        const requestId = this.newUUID();
        this.sendMessage({
            berp: {
                event: name,
                requestId: requestId,
                ...params,
            },
        }, (res) => {
            if (!callback)
                return;
            return callback(res);
        });
    }
    getHeartbeats() { return this._defaultRequests.get('Heartbeat').getTotalBeats(); }
    newUUID() { return (0, uuid_1.v4)(); }
}
exports.SocketManager = SocketManager;
