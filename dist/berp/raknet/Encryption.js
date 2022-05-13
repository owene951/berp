"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encryption = void 0;
const crypto_1 = require("crypto");
const zlib_1 = __importDefault(require("zlib"));
class Encryption {
    constructor(iv, secretKeyBytes) {
        this.iv = iv;
        this.secretKeyBytes = secretKeyBytes;
        this.cipher = this.createCipher(this.secretKeyBytes, iv.slice(0, 12), 'aes-256-gcm');
        this.decipher = this.createDecipher(this.secretKeyBytes, iv.slice(0, 12), 'aes-256-gcm');
        this.sendCounter = 0n;
        this.recieveCounter = 0n;
    }
    getCipher() { return this.cipher; }
    getDecipher() { return this.decipher; }
    createCipher(secret, iv, alg) {
        if ((0, crypto_1.getCiphers)().includes(alg)) {
            return (0, crypto_1.createCipheriv)(alg, secret, iv);
        }
    }
    createDecipher(secret, iv, alg) {
        if ((0, crypto_1.getCiphers)().includes(alg)) {
            return (0, crypto_1.createDecipheriv)(alg, secret, iv);
        }
    }
    computeCheckSum(plain, scounter, keyBytes) {
        const digest = (0, crypto_1.createHash)('sha256');
        const counter = Buffer.alloc(8);
        counter.writeBigInt64LE(scounter, 0);
        digest.update(counter);
        digest.update(plain);
        digest.update(keyBytes);
        const hash = digest.digest();
        return hash.slice(0, 8);
    }
    createEncryptor() {
        const create = (chunk) => {
            return new Promise((r) => {
                const def = zlib_1.default.deflateRawSync(chunk, { level: 7 });
                const packet = Buffer.concat([def, this.computeCheckSum(def, this.sendCounter, this.secretKeyBytes)]);
                this.sendCounter++;
                this.cipher.once('data', (buf) => { r(buf); });
                this.cipher.write(packet);
            });
        };
        return { create };
    }
    createDecryptor() {
        const read = (chunk) => {
            return new Promise((r, j) => {
                this.decipher.once('data', (buf) => {
                    const packet = buf.slice(0, buf.length - 8);
                    const checksum = buf.slice(buf.length - 8, buf.length);
                    const computedCheckSum = this.computeCheckSum(packet, this.recieveCounter, this.secretKeyBytes);
                    this.recieveCounter++;
                    if (Buffer.compare(checksum, computedCheckSum) !== 0) {
                        j(`Checksum mismatch ${checksum.toString('hex')} != ${computedCheckSum.toString('hex')}`);
                    }
                    const inf = zlib_1.default.inflateRawSync(buf, { chunkSize: 1024 * 1024 * 2 });
                    r(inf);
                });
                this.decipher.write(chunk);
            });
        };
        return { read };
    }
}
exports.Encryption = Encryption;
