"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RakManager = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const crypto_1 = require("crypto");
const utils_1 = require("../utils");
const PacketHandler_1 = require("./PacketHandler");
const UDP_1 = require("./UDP");
const events_1 = require("events");
const console_1 = require("../../console");
const axios_1 = __importDefault(require("axios"));
const C = __importStar(require("../../Constants"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class RakManager extends events_1.EventEmitter {
    constructor(host, port, username, id) {
        super();
        this.mcAuthChains = [];
        this.encryptionStarted = false;
        this.version = C.CUR_VERSION;
        this.SALT = "🧂";
        this.CURVE = "secp384r1";
        this.ALGORITHM = "ES384";
        this.PUBLIC_KEY_ONLINE = "MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAE8ELkixyLcwlZryUQcu1TvPOmI2B7vX83ndnWRUaXm74wFfa5f/lwQNTfrLVHa2PmenpGI6JhIMUJaWZrjmMj90NoKNFSNBuKdm8rYiXsfaz3K36x/1U26HpG0ZxK/V1V";
        this.connected = false;
        this.host = host;
        this.port = port;
        this.id = id;
        this._logger = new console_1.Logger(`Raknet (${username}:${id})`, 'yellow');
        this.packetHandler = new PacketHandler_1.PacketHandler();
        this.edchKeyPair = (0, crypto_1.generateKeyPairSync)('ec', { namedCurve: this.CURVE });
        this.publicKeyDER = this.edchKeyPair.publicKey.export({
            format: 'der',
            type: 'spki',
        });
        this.privateKeyPEM = this.edchKeyPair.privateKey.export({
            format: 'pem',
            type: 'sec1',
        });
        this.X509 = this.publicKeyDER.toString('base64');
        this._raknet = new UDP_1.Raknet(host, port, 10);
        this._handlePackets();
    }
    getRakLogger() { return this._logger; }
    getXboxProfile() { return this._xboxProfile; }
    _handlePackets() {
        this._raknet.on('connected', () => {
            this.emit('rak_connected');
        });
        this._raknet.on('closed', () => {
            this.emit('rak_closed');
        });
        this._raknet.on('pong', () => {
            this.emit('rak_pong');
        });
        this._raknet.on('raw', async (packet) => {
            // console.log(packet)
            try {
                for (const pak of await this.packetHandler.readPacket(packet)) {
                    // console.log(pak.name)
                    this.emit("all", {
                        name: pak.name,
                        params: pak.params,
                    });
                    this.emit(pak.name, pak.params);
                }
            }
            catch (err) {
                const error = "Failed to read imbound packet: " + err;
                this._logger.error(error);
            }
        });
    }
    async connect() {
        if (!this.connected) {
            this.connected = true;
            if (!this.mcAuthChains.length)
                throw new Error("Auth Mc First");
            this.updateXboxUserData();
            this._generateClientIdentityChain();
            this.on('server_to_client_handshake', (data) => {
                this.serverBoundEncryptionToken = data.token;
                this._startServerboundEncryption();
            });
            this._raknet.connect();
        }
    }
    close() {
        this.emit('rak_closed');
        this._raknet.killConnection();
        this.removeAllListeners();
    }
    _startServerboundEncryption() {
        const [header, payload] = this.serverBoundEncryptionToken.split(".").map(k => Buffer.from(k, 'base64'));
        const head = JSON.parse(String(header));
        const body = JSON.parse(String(payload));
        this.encryptionPubKeyDer = (0, crypto_1.createPublicKey)({
            key: Buffer.from(head.x5u, 'base64'),
            format: 'der',
            type: 'spki',
        });
        this.encryptionSharedSecret = (0, crypto_1.diffieHellman)({
            privateKey: this.edchKeyPair.privateKey,
            publicKey: this.encryptionPubKeyDer,
        });
        this.encryptionSalt = Buffer.from(body.salt, 'base64');
        this.encryptionSecretHash = (0, crypto_1.createHash)('sha256');
        this.encryptionSecretHash.update(this.encryptionSalt);
        this.encryptionSecretHash.update(this.encryptionSharedSecret);
        this.encryptionSecretKeyBytes = this.encryptionSecretHash.digest();
        this.encryptionIV = this.encryptionSecretKeyBytes.slice(0, 16);
        this.packetHandler.startEncryption(this.encryptionIV, this.encryptionSecretKeyBytes);
    }
    async authMc(xstsResponse) {
        return new Promise((r, j) => {
            if (!this.mcAuthChains.length) {
                this.makeRestRequest('post', C.Endpoints.Misc.MinecraftAuth, C.MinecraftAuthHeaders((0, utils_1.createXBLToken)(xstsResponse)), { identityPublicKey: this.X509 })
                    .then((res) => {
                    this.mcAuthChains = res.chain;
                    r(true);
                })
                    .catch((err) => {
                    j(err);
                });
            }
            else {
                r(true);
            }
        });
    }
    updateXboxUserData() {
        if (this.mcAuthChains[1]) {
            const userData = this.mcAuthChains[1];
            const payload = userData.split(".").map(d => Buffer.from(d, 'base64'))[1];
            this._xboxProfile = JSON.parse(String(payload));
        }
    }
    _generateClientIdentityChain() {
        const privateKey = this.edchKeyPair.privateKey;
        this.clientIdentityChain = jsonwebtoken_1.default.sign({
            identityPublicKey: this.PUBLIC_KEY_ONLINE,
            certificateAuthority: true,
        }, privateKey, {
            algorithm: this.ALGORITHM,
            header: {
                x5u: this.X509,
                alg: this.ALGORITHM,
            },
        });
    }
    _generateClientUserChain(payload) {
        const privateKey = this.edchKeyPair.privateKey;
        this.clientUserChain = jsonwebtoken_1.default.sign(payload, privateKey, {
            algorithm: this.ALGORITHM,
            header: {
                x5u: this.X509,
                alg: this.ALGORITHM,
            },
            noTimestamp: true,
        });
    }
    createLoginPayload() {
        const skinData = JSON.parse(utils_1.DataProvider
            .getDataMap()
            .getFile('steve.json')
            .toString('utf-8'));
        const skinBin = utils_1.DataProvider
            .getDataMap()
            .getFile('steveSkin.bin')
            .toString('base64');
        const skinGeometry = utils_1.DataProvider
            .getDataMap()
            .getFile('steveGeometry.json')
            .toString('base64');
        const payload = {
            ...skinData,
            ClientRandomId: Date.now(),
            CurrentInputMode: 1,
            DefaultInputMode: 1,
            DeviceId: (0, utils_1.nextUUID)(),
            DeviceModel: 'BeRP',
            DeviceOS: 7,
            GameVersion: this.version,
            GuiScale: -1,
            LanguageCode: 'en_US',
            PlatformOfflineId: '',
            PlatformOnlineId: '',
            PlayFabId: (0, utils_1.nextUUID)()
                .replace(/-/g, "")
                .slice(0, 16),
            SelfSignedId: (0, utils_1.nextUUID)(),
            ServerAddress: `${this.host}:${this.port}`,
            SkinData: skinBin,
            SkinGeometryData: skinGeometry,
            SkinGeometryVersion: "1.14.0",
            ThirdPartyName: this._xboxProfile.extraData.displayName,
            ThirdPartyNameOnly: false,
            UIProfile: 0,
        };
        this._generateClientUserChain(payload);
        const chain = [
            this.clientIdentityChain,
            ...this.mcAuthChains,
        ];
        const encodedChain = JSON.stringify({ chain });
        return {
            protocol_version: C.CUR_VERSION_PROTOCOL,
            tokens: {
                identity: encodedChain,
                client: this.clientUserChain,
            },
        };
    }
    async sendPacket(name, params) {
        try {
            const newPacket = await this.packetHandler.createPacket(name, params);
            this._raknet.writeRaw(newPacket);
            return {
                name,
                params,
            };
        }
        catch (error) {
            this._logger.error("Failed to create outbound packet:", error);
            throw error;
        }
    }
    makeRestRequest(method, url, headers, data) {
        return new Promise((r, j) => {
            (0, axios_1.default)({
                method,
                url,
                headers,
                data,
            })
                .then(({ data }) => {
                r(data);
            })
                .catch((err) => {
                j(err);
            });
        });
    }
}
exports.RakManager = RakManager;
