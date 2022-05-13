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
exports.PluginApi = void 0;
const console_1 = require("../../../console");
const CommandManager_1 = require("./command/CommandManager");
const PlayerManager_1 = require("./player/PlayerManager");
const EntityManager_1 = require("./entity/EntityManager");
const WorldManager_1 = require("./world/WorldManager");
const RealmManager_1 = require("./realm/RealmManager");
const SocketManager_1 = require("./socket/SocketManager");
const EventManager_1 = require("./events/EventManager");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const C = __importStar(require("../../../Constants"));
const utils_1 = require("../../../berp/utils");
class PluginApi {
    constructor(berp, config, path, connection, apis, temp = false) {
        this._hasConnected = false;
        this._berp = berp;
        this._logger = new console_1.Logger(`${config.displayName} ${connection.realm.id || "(Init)"}`, config.color);
        this._config = config;
        this._connection = connection;
        this._apiId = apis.apiId;
        this._pluginId = apis.pluginId;
        this._instanceId = apis.instanceId;
        this._temp = temp;
        this.path = path;
        if (this._temp)
            return;
        this._playerManager = new PlayerManager_1.PlayerManager(this._berp, this._connection, this);
        this._entityManager = new EntityManager_1.EntityManager(this._berp, this._connection, this);
        this._socketManager = new SocketManager_1.SocketManager(this._berp, this._connection, this);
        this._eventManager = new EventManager_1.EventManager(this._berp, this._connection, this);
        this._commandManager = new CommandManager_1.CommandManager(this._berp, this._connection, this);
        this._worldManager = new WorldManager_1.WorldManager(this._berp, this._connection, this);
        this._realmManager = new RealmManager_1.RealmManager(this._berp, this._connection, this);
    }
    async onEnabled() {
        if (this._temp)
            return;
        await this._commandManager.onEnabled();
        await this._playerManager.onEnabled();
        await this._entityManager.onEnabled();
        await this._worldManager.onEnabled();
        await this._realmManager.onEnabled();
        await this._socketManager.onEnabled();
        await this._eventManager.onEnabled();
        return;
    }
    async onDisabled() {
        clearInterval(this._interval);
        if (this._temp)
            return;
        await this._commandManager.onDisabled();
        await this._playerManager.onDisabled();
        await this._entityManager.onDisabled();
        await this._worldManager.onDisabled();
        await this._realmManager.onDisabled();
        await this._socketManager.onDisabled();
        await this._eventManager.onDisabled();
        return;
    }
    getLogger() { return this._logger; }
    getConnection() { return this._connection; }
    getConfig() { return this._config; }
    getApiId() { return this._apiId; }
    getPluginId() { return this._pluginId; }
    getInstanceId() { return this._instanceId; }
    getCommandManager() { return this._commandManager; }
    getPlayerManager() { return this._playerManager; }
    getEntityManager() { return this._entityManager; }
    getWorldManager() { return this._worldManager; }
    getRealmManager() { return this._realmManager; }
    getSocketManager() { return this._socketManager; }
    getEventManager() { return this._eventManager; }
    getPlugins() {
        const plugins = new Map();
        for (const [, entry] of this._berp.getPluginManager().getActivePlugins()) {
            if (this._connection !== entry.connection)
                continue;
            plugins.set(entry.config.name, entry);
        }
        return plugins;
    }
    getPluginByInstanceId(name, id) {
        return new Promise((res) => {
            for (const [, plugin] of this._berp.getPluginManager().getActivePlugins()) {
                if (plugin.config.name.toLocaleLowerCase() != name.toLocaleLowerCase() && plugin.ids.instance != id)
                    continue;
                return res(plugin);
            }
        });
    }
    createInterface(options) {
        setTimeout(() => {
            for (const [, entry] of this.getPlugins()) {
                fs_1.default.writeFileSync(path_1.default.resolve(entry.path, 'src', '@interface', `${options.name}.i.ts`), options.interface);
            }
        }, 1000);
    }
    async autoConnect(accountEmail, realmId, bypass = false) {
        return new Promise(async (resX) => {
            if (!this._temp && !bypass) {
                this._logger.error("AutoConnect is only allowed in the onLoaded() method!");
                return resX(false);
            }
            const foundAccounts = new Map();
            const accounts = await this._berp
                .getAuthProvider()
                .getCache()
                .getAllAccounts();
            for (const account of accounts) {
                foundAccounts.set(account.username, account);
            }
            if (!foundAccounts.has(accountEmail)) {
                this._logger.error(`No account found with the email "${accountEmail}"`);
                return resX(false);
            }
            const account = foundAccounts.get(accountEmail);
            const authRes = await this._berp.getAuthProvider().aquireTokenFromCache({
                scopes: C.Scopes,
                account,
            });
            const xsts = await this._berp.getAuthProvider().ezXSTSForRealmAPI(authRes);
            let net = this._berp.getNetworkManager().getAccounts()
                .get(account.username);
            if (!net) {
                net = this._berp.getNetworkManager().create(account);
            }
            const foundRealms = new Map();
            const req = new this._berp.Request({
                method: "GET",
                url: C.Endpoints.RealmAPI.GET.Realms,
                headers: C.RealmAPIHeaders((0, utils_1.createXBLToken)(xsts)),
            }, {
                requestTimeout: 50000,
                attemptTimeout: 300,
                attempts: 20,
            });
            req.onFufilled = async (res) => {
                if (!res.servers || !res.servers.length)
                    return this._logger.error(`No realms could be found under the account "${account.username}"`);
                for await (const server of res.servers) {
                    foundRealms.set(server.id, server);
                }
                if (!foundRealms.has(realmId))
                    return this._logger.error(`No realm with the Id "${realmId}" was found.`);
                const realm = foundRealms.get(realmId);
                const req = new this._berp.Request({
                    method: "GET",
                    url: C.Endpoints.RealmAPI.GET.RealmJoinInfo(realm.id),
                    headers: C.RealmAPIHeaders((0, utils_1.createXBLToken)(xsts)),
                }, {
                    requestTimeout: 50000,
                    attemptTimeout: 300,
                    attempts: 100,
                });
                req.onFufilled = (res) => {
                    const split = res.address.split(":");
                    const ip = split[0];
                    const port = parseInt(split[1]);
                    net.newConnection(ip, port, realm);
                    this._hasConnected = true;
                    return resX(true);
                };
                req.onFailed = () => {
                    this._logger.error(`Failed to get join info for realm "${realm.name}"`);
                    return resX(false);
                };
                this._berp.getSequentialBucket().addRequest(req);
            };
            req.onFailed = () => {
                this._logger.error(`Failed to select account for realm connection...`);
                return resX(false);
            };
            this._berp.getSequentialBucket().addRequest(req);
        });
    }
    autoReconnect(accountEmail, realmId) {
        let tryConnection = true;
        if (!this._temp)
            return this._logger.error("AutoReconnect is only allowed in the onLoaded() method!");
        this._interval = setInterval(async () => {
            if (!this._hasConnected || !tryConnection)
                return;
            const accounts = this._berp.getNetworkManager().getAccounts();
            if (!accounts.has(accountEmail))
                return;
            const account = accounts.get(accountEmail);
            if (account.getConnections().has(realmId))
                return;
            this._logger.success(`AutoReconnect attempting to connect to realm Id "${realmId}" using the email "${accountEmail}"`);
            tryConnection = false;
            await this.autoConnect(accountEmail, realmId);
            tryConnection = true;
        }, 10000);
    }
}
exports.PluginApi = PluginApi;
