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
exports.RealmManager = void 0;
const utils_1 = require("../../../../berp/utils");
const C = __importStar(require("../../../../Constants"));
const axios_1 = __importDefault(require("axios"));
class RealmManager {
    constructor(berp, connection, pluginApi) {
        this._berp = berp;
        this._connection = connection;
        this._pluginApi = pluginApi;
        this._realm = this._connection.realm;
    }
    async onEnabled() {
        return;
    }
    async onDisabled() {
        return;
    }
    async downloadRealm() {
        if (this._pluginApi.getConnection().realm.ownerUUID !== this._pluginApi.getConnection().getXboxProfile().extraData.XUID)
            return this._pluginApi.getLogger().error("The method updateRealmName() can only be used if the account being used is the realm owner.");
        return new Promise(async (r) => {
            const foundAccounts = new Map();
            const accounts = await this._berp
                .getAuthProvider()
                .getCache()
                .getAllAccounts();
            for (const account of accounts) {
                foundAccounts.set(account.username, account);
            }
            const account = foundAccounts.get(this._pluginApi.getConnection().getConnectionManager()
                .getAccount().username);
            const authRes = await this._berp.getAuthProvider().aquireTokenFromCache({
                scopes: C.Scopes,
                account,
            });
            const xsts = await this._berp.getAuthProvider().ezXSTSForRealmAPI(authRes);
            const req = new this._berp.Request({
                method: "GET",
                url: C.Endpoints.RealmAPI.GET.RealmBackupLatest(this._realm.id, 1),
                headers: C.RealmAPIHeaders((0, utils_1.createXBLToken)(xsts)),
            }, {
                requestTimeout: 50000,
                attemptTimeout: 300,
                attempts: 20,
            });
            req.onFufilled = (data) => {
                axios_1.default.get(data.downloadUrl, {
                    headers: {
                        Authorization: "Bearer " + data.token,
                    },
                }).then((res) => { return r(res.data); });
            };
            req.onFailed = (err) => {
                this._pluginApi.getLogger().error("Failed to get realm download URL...", err);
                return r(false);
            };
            this._berp.getSequentialBucket().addRequest(req);
        });
    }
    async renameRealm(name) {
        if (this._pluginApi.getConnection().realm.ownerUUID !== this._pluginApi.getConnection().getXboxProfile().extraData.XUID)
            return this._pluginApi.getLogger().error("The method updateRealmName() can only be used if the account being used is the realm owner.");
        const foundAccounts = new Map();
        const accounts = await this._berp
            .getAuthProvider()
            .getCache()
            .getAllAccounts();
        for (const account of accounts) {
            foundAccounts.set(account.username, account);
        }
        const account = foundAccounts.get(this._pluginApi.getConnection().getConnectionManager()
            .getAccount().username);
        const authRes = await this._berp.getAuthProvider().aquireTokenFromCache({
            scopes: C.Scopes,
            account,
        });
        const xsts = await this._berp.getAuthProvider().ezXSTSForRealmAPI(authRes);
        const req = new this._berp.Request({
            method: "POST",
            url: C.Endpoints.RealmAPI.POST.RealmConfiguration(this._connection.realm.id),
            headers: C.RealmAPIHeaders((0, utils_1.createXBLToken)(xsts)),
            body: {
                description: {
                    description: "Powered By BeRP.",
                    name: name,
                },
                options: {
                    texturePacksRequired: true,
                },
            },
        }, {
            requestTimeout: 50000,
            attemptTimeout: 300,
            attempts: 20,
        });
        req.onFufilled = () => {
            return;
        };
        req.onFailed = (err) => {
            this._pluginApi.getLogger().error("Failed to rename the realm...", err);
        };
        this._berp.getSequentialBucket().addRequest(req);
    }
    async closeRealm() {
        if (this._pluginApi.getConnection().realm.ownerUUID !== this._pluginApi.getConnection().getXboxProfile().extraData.XUID)
            return this._pluginApi.getLogger().error("The method closeRealm() can only be used if the account being used is the realm owner.");
        return new Promise(async (r) => {
            const foundAccounts = new Map();
            const accounts = await this._berp
                .getAuthProvider()
                .getCache()
                .getAllAccounts();
            for (const account of accounts) {
                foundAccounts.set(account.username, account);
            }
            const account = foundAccounts.get(this._pluginApi.getConnection().getConnectionManager()
                .getAccount().username);
            const authRes = await this._berp.getAuthProvider().aquireTokenFromCache({
                scopes: C.Scopes,
                account,
            });
            const xsts = await this._berp.getAuthProvider().ezXSTSForRealmAPI(authRes);
            const req = new this._berp.Request({
                method: "PUT",
                url: C.Endpoints.RealmAPI.PUT.RealmClose(this._realm.id),
                headers: C.RealmAPIHeaders((0, utils_1.createXBLToken)(xsts)),
            }, {
                requestTimeout: 50000,
                attemptTimeout: 300,
                attempts: 20,
            });
            req.onFufilled = () => {
                this._pluginApi.getLogger().success("Successfully closed the realm.");
                return r(true);
            };
            req.onFailed = (err) => {
                this._pluginApi.getLogger().error("Failed to close realm...", err);
                return r(false);
            };
            this._berp.getSequentialBucket().addRequest(req);
        });
    }
    async banUser(XUID) {
        if (this._pluginApi.getConnection().realm.ownerUUID !== this._pluginApi.getConnection().getXboxProfile().extraData.XUID)
            return this._pluginApi.getLogger().error("The method banUser() can only be used if the account being used is the realm owner.");
        return new Promise(async (r) => {
            const foundAccounts = new Map();
            const accounts = await this._berp
                .getAuthProvider()
                .getCache()
                .getAllAccounts();
            for (const account of accounts) {
                foundAccounts.set(account.username, account);
            }
            const account = foundAccounts.get(this._pluginApi.getConnection().getConnectionManager()
                .getAccount().username);
            const authRes = await this._berp.getAuthProvider().aquireTokenFromCache({
                scopes: C.Scopes,
                account,
            });
            const xsts = await this._berp.getAuthProvider().ezXSTSForRealmAPI(authRes);
            const req = new this._berp.Request({
                method: "POST",
                url: C.Endpoints.RealmAPI.POST.RealmBlockPlayer(this._realm.id, XUID),
                headers: C.RealmAPIHeaders((0, utils_1.createXBLToken)(xsts)),
            }, {
                requestTimeout: 50000,
                attemptTimeout: 300,
                attempts: 20,
            });
            req.onFufilled = () => {
                this._pluginApi.getLogger().success("Successfully banned user.");
                return r(true);
            };
            req.onFailed = (err) => {
                this._pluginApi.getLogger().error("Failed to ban user...", err);
                return r(false);
            };
            this._berp.getSequentialBucket().addRequest(req);
        });
    }
    async openRealm() {
        if (this._pluginApi.getConnection().realm.ownerUUID !== this._pluginApi.getConnection().getXboxProfile().extraData.XUID)
            return this._pluginApi.getLogger().error("The method openRealm() can only be used if the account being used is the realm owner.");
        return new Promise(async (r) => {
            const foundAccounts = new Map();
            const accounts = await this._berp
                .getAuthProvider()
                .getCache()
                .getAllAccounts();
            for (const account of accounts) {
                foundAccounts.set(account.username, account);
            }
            const account = foundAccounts.get(this._pluginApi.getConnection().getConnectionManager()
                .getAccount().username);
            const authRes = await this._berp.getAuthProvider().aquireTokenFromCache({
                scopes: C.Scopes,
                account,
            });
            const xsts = await this._berp.getAuthProvider().ezXSTSForRealmAPI(authRes);
            const req = new this._berp.Request({
                method: "PUT",
                url: C.Endpoints.RealmAPI.PUT.RealmOpen(this._realm.id),
                headers: C.RealmAPIHeaders((0, utils_1.createXBLToken)(xsts)),
            }, {
                requestTimeout: 50000,
                attemptTimeout: 300,
                attempts: 20,
            });
            req.onFufilled = () => {
                this._pluginApi.getLogger().success("Successfully opened the realm.");
                return r(true);
            };
            req.onFailed = (err) => {
                this._pluginApi.getLogger().error("Failed to open realm...", err);
                return r(false);
            };
            this._berp.getSequentialBucket().addRequest(req);
        });
    }
    async restartRealm() {
        if (this._pluginApi.getConnection().realm.ownerUUID !== this._pluginApi.getConnection().getXboxProfile().extraData.XUID)
            return this._pluginApi.getLogger().error("The method restartRealm() can only be used if the account being used is the realm owner.");
        this._pluginApi.getLogger().info("Attempting to restart realm...");
        return new Promise(async (r) => {
            const close = await this.closeRealm();
            if (!close)
                return r(false);
            const open = await this.openRealm();
            if (!open)
                return r(false);
            const connect = await this._pluginApi.autoConnect(this._pluginApi.getConnection().getConnectionManager()
                .getAccount().username, this._realm.id, true);
            if (!connect)
                return r(false);
            return r(true);
        });
    }
    async updatePlayerPermission(player, permissionLevel) {
        if (this._pluginApi.getConnection().realm.ownerUUID !== this._pluginApi.getConnection().getXboxProfile().extraData.XUID)
            return this._pluginApi.getLogger().error("The method updatePlayer() can only be used if the account being used is the realm owner.");
        return new Promise(async (r) => {
            const foundAccounts = new Map();
            const accounts = await this._berp
                .getAuthProvider()
                .getCache()
                .getAllAccounts();
            for (const account of accounts) {
                foundAccounts.set(account.username, account);
            }
            const account = foundAccounts.get(this._pluginApi.getConnection().getConnectionManager()
                .getAccount().username);
            const authRes = await this._berp.getAuthProvider().aquireTokenFromCache({
                scopes: C.Scopes,
                account,
            });
            const xsts = await this._berp.getAuthProvider().ezXSTSForRealmAPI(authRes);
            const req = new this._berp.Request({
                method: "PUT",
                url: C.Endpoints.RealmAPI.PUT.RealmUserPermission(this._realm.id),
                headers: C.RealmAPIHeaders((0, utils_1.createXBLToken)(xsts)),
                body: {
                    permission: permissionLevel,
                    xuid: player.getXuid(),
                },
            }, {
                requestTimeout: 50000,
                attemptTimeout: 300,
                attempts: 20,
            });
            req.onFufilled = () => {
                return r(true);
            };
            req.onFailed = (err) => {
                this._pluginApi.getLogger().error("Failed to open realm...", err);
                return r(false);
            };
            this._berp.getSequentialBucket().addRequest(req);
        });
    }
    getId() { return this._realm.id; }
    getName() { return this._realm.name; }
    getDayTillExpired() { return this._realm.daysLeft; }
}
exports.RealmManager = RealmManager;
