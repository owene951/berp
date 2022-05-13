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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionManager = void 0;
const console_1 = require("../../console");
const ConnectionHandler_1 = require("./ConnectionHandler");
const C = __importStar(require("../../Constants"));
class ConnectionManager {
    constructor(account, berp) {
        this._connections = new Map();
        this._berp = berp;
        this._account = account;
        this._logger = new console_1.Logger(`Connection Manager (${account.username})`, "#ff9169");
        this._startAuthRefresh();
        this._logger.success("Initialized");
    }
    getAccount() { return this._account; }
    getLogger() { return this._logger; }
    getConnections() { return this._connections; }
    _startAuthRefresh() {
        this._accountAuthRefresh = setInterval(async () => {
            await this._authRefresh();
        }, 1000 * 60 * 60 * 12); // every 12 hours
    }
    async _authRefresh() {
        try {
            const res = await this._berp.getAuthProvider().aquireTokenFromCache({
                scopes: C.Scopes,
                account: this._account,
            });
            this._accountAuthRes = res;
        }
        catch (error) {
            this._logger.error(`Failed to refresh auth flow for "${this._account.username}". Terminating all connections and removing account from cache. Please reauth!\n`, error);
            this.kill();
            this._berp.getAuthProvider().getCache()
                .removeAccount(this._account);
        }
    }
    kill() {
        if (this._accountAuthRefresh) {
            clearInterval(this._accountAuthRefresh);
        }
        this.closeAll();
    }
    closeAll() {
        if (this._connections.size) {
            for (const [, connection] of this._connections) {
                connection.close();
            }
        }
    }
    closeSingle(id) {
        const connection = this._connections.get(id);
        if (connection) {
            connection.close();
        }
    }
    async newConnection(host, port, realm) {
        return new Promise(async (r, rj) => {
            try {
                if (!this._accountAuthRes)
                    await this._authRefresh();
                const newConnection = new ConnectionHandler_1.ConnectionHandler(host, port, realm, this, this._berp);
                const xsts = await this._berp.getAuthProvider()
                    .ezXSTSForRealmRak(this._accountAuthRes);
                await newConnection.authMc(xsts);
                this._connections.set(realm.id, newConnection);
                newConnection.once('rak_ready', () => {
                    r(newConnection);
                });
                newConnection.connect();
            }
            catch (error) {
                rj(error);
            }
        });
    }
}
exports.ConnectionManager = ConnectionManager;
