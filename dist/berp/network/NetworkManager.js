"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkManager = void 0;
const console_1 = require("../../console");
const ConnectionManager_1 = require("./ConnectionManager");
class NetworkManager {
    constructor(berp) {
        this._accounts = new Map();
        this._logger = new console_1.Logger("Network Manager");
        this._berp = berp;
        this._logger.success("Initialized");
    }
    getAccounts() { return this._accounts; }
    getLogger() { return this._logger; }
    create(accountInfo) {
        if (!this._accounts.get(accountInfo.username)) {
            const con = new ConnectionManager_1.ConnectionManager(accountInfo, this._berp);
            this._accounts.set(accountInfo.username, con);
            return con;
        }
    }
    delete(username) {
        const account = this._accounts.get(username);
        if (account) {
            account.kill();
            this._accounts.delete(username);
        }
    }
    kill() {
        for (const [u, cm] of this._accounts) {
            cm.kill();
            this._accounts.delete(u);
        }
    }
}
exports.NetworkManager = NetworkManager;
