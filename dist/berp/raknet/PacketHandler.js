"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketHandler = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const protodef_1 = require("protodef");
const Serializer_1 = require("./Serializer");
const zlib_1 = __importDefault(require("zlib"));
const [readVarInt, writeVarInt, sizeOfVarInt] = protodef_1.types.varint;
const Encryption_1 = require("./Encryption");
class PacketHandler {
    constructor() {
        this.encryptionStarted = false;
        this.serializer = (0, Serializer_1.createSerializer)();
        this.deserializer = (0, Serializer_1.createDeserializer)();
    }
    getSerializer() { return this.serializer; }
    getDeserializer() { return this.deserializer; }
    getEncryptor() { return this.encryptor; }
    startEncryption(iv, secretKeyBytes) {
        this.encryptor = new Encryption_1.Encryption(iv, secretKeyBytes);
        this.encryptionStarted = true;
    }
    async createPacket(name, params) {
        try {
            const pak = this.serializer.createPacketBuffer({
                name,
                params,
            });
            if (this.encryptionStarted) {
                return await this._handleWriteEPak(pak);
            }
            else {
                return Promise.resolve(this._handleWriteUPak(pak));
            }
        }
        catch (error) {
            throw error;
        }
    }
    async readPacket(buffer) {
        try {
            if (buffer[0] === 0xfe) {
                if (this.encryptionStarted) {
                    return await this._handleReadEPak(buffer);
                }
                else {
                    return Promise.resolve(this._handleReadUPak(buffer));
                }
            }
        }
        catch (error) {
            throw error;
        }
    }
    getPackets(buffer) {
        try {
            const packets = [];
            let offset = 0;
            while (offset < buffer.byteLength) {
                const { value, size } = readVarInt(buffer, offset);
                const dec = Buffer.allocUnsafe(value);
                offset += size;
                offset += buffer.copy(dec, 0, offset, offset + value);
                packets.push(dec);
            }
            return packets;
        }
        catch (error) {
            throw error;
        }
    }
    encode(packet) {
        const def = zlib_1.default.deflateRawSync(packet, { level: 7 });
        return Buffer.concat([Buffer.from([0xfe]), def]);
    }
    _handleReadUPak(buffer) {
        try {
            const buf = Buffer.from(buffer);
            if (buf[0] !== 0xfe)
                throw Error('Bad batch packet header ' + buf[0]);
            const b = buf.slice(1);
            const inf = zlib_1.default.inflateRawSync(b, { chunkSize: 1024 * 1024 * 2 });
            const ret = [];
            for (const packet of this.getPackets(inf)) {
                const des = this.deserializer.parsePacketBuffer(packet);
                ret.push({
                    name: des.data.name,
                    params: des.data.params,
                });
            }
            return ret;
        }
        catch (error) {
            // console.log("UW OW EWWR")
            throw error;
        }
    }
    async _handleReadEPak(buffer) {
        try {
            const dpacket = await this.encryptor.createDecryptor().read(buffer.slice(1));
            const ret = [];
            for (const packet of this.getPackets(dpacket)) {
                // console.log(packet)
                try {
                    var des = this.deserializer.parsePacketBuffer(packet); // eslint-disable-line
                }
                catch (error) {
                    // Handles broken packets being mixed with okay packets.
                    continue;
                }
                if (!des)
                    continue;
                else {
                    ret.push({
                        name: des.data.name,
                        params: des.data.params,
                    });
                }
            }
            return ret;
        }
        catch (error) {
            throw error;
        }
    }
    _handleWriteUPak(packet) {
        try {
            const varIntSize = sizeOfVarInt(packet.byteLength);
            const newPacket = Buffer.allocUnsafe(varIntSize + packet.byteLength);
            writeVarInt(packet.length, newPacket, 0);
            packet.copy(newPacket, varIntSize);
            return this.encode(newPacket);
        }
        catch (error) {
            throw error;
        }
    }
    async _handleWriteEPak(packet) {
        try {
            const varIntSize = sizeOfVarInt(packet.byteLength);
            const newPacket = Buffer.allocUnsafe(varIntSize + packet.byteLength);
            writeVarInt(packet.length, newPacket, 0);
            packet.copy(newPacket, varIntSize);
            const buffer = await this.encryptor.createEncryptor().create(newPacket);
            return Buffer.concat([Buffer.from([0xfe]), buffer]);
        }
        catch (error) {
            throw error;
        }
    }
}
exports.PacketHandler = PacketHandler;
