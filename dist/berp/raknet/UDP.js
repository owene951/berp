"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Raknet = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const events_1 = require("events");
const raknet_native_1 = require("raknet-native");
class Raknet extends events_1.EventEmitter {
    constructor(host, port, protocol) {
        super();
        this.connected = false;
        this.host = host;
        this.port = port;
        this.protocolVersion = protocol;
        this._onConnect = this._onConnect.bind(this);
        this._onPong = this._onPong.bind(this);
        this._onEncapsulated = this._onEncapsulated.bind(this);
        this._onClose = this._onClose.bind(this);
        this.connection = new raknet_native_1.Client(host, port, { protocolVersion: protocol });
        this.connection.on('connect', this._onConnect);
        this.connection.on('pong', this._onPong);
        this.connection.on('encapsulated', this._onEncapsulated);
        this.connection.on('disconnect', this._onClose);
    }
    _onConnect() {
        this.emit('connected');
    }
    _onPong() {
        this.emit('pong');
    }
    _onEncapsulated(arg) {
        this.emit('raw', Buffer.from(arg.buffer), arg.address, arg.guid);
    }
    _onClose() {
        this.emit('closed');
    }
    killConnection() {
        this.removeAllListeners();
        if (this.connection) {
            this.connection.close();
        }
    }
    writeRaw(packet, priority, reliability, orderingChannel) {
        this.connection.send(packet, priority || raknet_native_1.PacketPriority.IMMEDIATE_PRIORITY, reliability || raknet_native_1.PacketReliability.RELIABLE_ORDERED, orderingChannel || 0);
    }
    connect() {
        if (!this.connected) {
            this.connected = true;
            this.connection.connect();
        }
    }
}
exports.Raknet = Raknet;
