"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionHandler = void 0;
const packets_i_1 = require("../../types/packets.i");
const raknet_1 = require("../raknet");
const console_1 = require("../../console");
// TODO: Client/plugins can control connection/diconnection of rak
class ConnectionHandler extends raknet_1.RakManager {
    constructor(host, port, realm, cm, berp) {
        super(host, port, cm.getAccount().username, realm.id);
        this.playerQue = [];
        this._tickSync = 0n;
        this._plugins = new Map();
        this.host = host;
        this.port = port;
        this.realm = realm;
        this._connectionManager = cm;
        this._berp = berp;
        this._log = new console_1.Logger(`Connection Handler (${cm.getAccount().username}:${realm.id})`, 'cyanBright');
        this.setMaxListeners(Infinity);
        this.once('rak_connected', this._handleLogin.bind(this));
        this.once(packets_i_1.Packets.ServerToClientHandshake, this._handleHandshake.bind(this));
        this.once(packets_i_1.Packets.ResourcePacksInfo, async () => {
            await this._handleAcceptPacks();
            await this._cachedChunks();
        });
        this.once(packets_i_1.Packets.ResourcePacksStack, this._handleAcceptPacks.bind(this));
        this.once(packets_i_1.Packets.StartGame, this._handleGameStart.bind(this));
        this.on(packets_i_1.Packets.PlayerList, this._playerQue.bind(this));
        this.once(packets_i_1.Packets.Disconnect, this._handleDisconnect.bind(this));
        this.once('rak_closed', this._handleDisconnect.bind(this));
        this.on(packets_i_1.Packets.TickSync, (pak) => {
            this._tickSync = pak.response_time;
        });
        this._log.success("Initialized");
        // TEMP ---- Bad Bad Bad... Dont care tho lol. BeRP v2 coming soon
        // The start_game packet isn't being detected by BeRP anymore, very strange...
        setTimeout(async () => {
            this._registerPlugins();
            this.emit("rak_ready");
            this.removeListener('player_list', this._playerQue);
            await this.sendPacket(packets_i_1.Packets.TickSync, {
                request_time: BigInt(Date.now()),
                response_time: 0n,
            });
            this._tickSyncKeepAlive = setInterval(async () => {
                await this.sendPacket(packets_i_1.Packets.TickSync, {
                    request_time: this._tickSync,
                    response_time: 0n,
                });
            }, 50 * ConnectionHandler.KEEPALIVEINT);
        }, 5000);
    }
    getGameInfo() { return this._gameInfo; }
    getLogger() { return this._log; }
    getTick() { return this._tickSync; }
    getConnectionManager() { return this._connectionManager; }
    close() {
        super.close();
        this.removeAllListeners();
        this._connectionManager.getConnections().delete(this.realm.id);
    }
    sendCommandFeedback(option) {
        this.sendPacket('command_request', {
            command: `gamerule sendcommandfeedback ${option}`,
            interval: false,
            origin: {
                uuid: '',
                request_id: '',
                type: 'player',
            },
        });
    }
    _playerQue(pak) {
        for (const record of pak.records.records) {
            if (record.username == this.getXboxProfile().extraData.displayName)
                continue;
            this.playerQue.push(record);
        }
    }
    async _handleDisconnect(pak) {
        let reason = "Rak Connection Terminated";
        if (pak) {
            reason = pak.message;
        }
        await this._berp.getPluginManager().killPlugins(this);
        clearInterval(this._tickSyncKeepAlive);
        this.close();
        this._log.warn(`Terminating connection handler with connection "${this.host}:${this.port}"`);
        this._log.warn("Disconnection on", `${this.host}:${this.port}`, `"${reason}"`);
    }
    async _handleLogin() {
        await this.sendPacket(packets_i_1.Packets.Login, this.createLoginPayload());
    }
    async _handleHandshake() {
        setTimeout(async () => {
            await this.sendPacket(packets_i_1.Packets.ClientToServerHandshake, {});
        }, 0);
    }
    async _handleAcceptPacks() {
        await this.sendPacket(packets_i_1.Packets.ResourcePackClientResponse, {
            response_status: 'completed',
            resourcepackids: [],
        });
    }
    async _cachedChunks() {
        await this.sendPacket(packets_i_1.Packets.ClientCacheStatus, {
            enabled: false,
        });
        await this.sendPacket(packets_i_1.Packets.RequestChunkRadius, {
            chunk_radius: 1,
        });
    }
    async _handleGameStart(pak) {
        this._gameInfo = pak;
        await this.sendPacket(packets_i_1.Packets.SetLocalPlayerAsInitialized, {
            runtime_entity_id: pak.runtime_entity_id,
        });
        this.emit("rak_ready");
        this._registerPlugins();
        this.removeListener('player_list', this._playerQue);
        await this.sendPacket(packets_i_1.Packets.TickSync, {
            request_time: BigInt(Date.now()),
            response_time: 0n,
        });
        this._tickSyncKeepAlive = setInterval(async () => {
            await this.sendPacket(packets_i_1.Packets.TickSync, {
                request_time: this._tickSync,
                response_time: 0n,
            });
        }, 50 * ConnectionHandler.KEEPALIVEINT);
    }
    async _registerPlugins() {
        const plugins = await this._berp.getPluginManager().registerPlugins(this);
        for (const plugin of plugins) {
            this._plugins.set(plugin.config.name, plugin);
        }
    }
    getPlugins() { return this._plugins; }
}
exports.ConnectionHandler = ConnectionHandler;
ConnectionHandler.KEEPALIVEINT = 10;
