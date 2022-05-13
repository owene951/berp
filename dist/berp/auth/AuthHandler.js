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
exports.AuthHandler = void 0;
const msal_node_1 = require("@azure/msal-node");
const CachePlugin_1 = require("./CachePlugin");
const path_1 = require("path");
const console_1 = require("../../console");
const fs_1 = __importDefault(require("fs"));
const XBLAuth = __importStar(require("@xboxreplay/xboxlive-auth"));
const Constants = __importStar(require("../../Constants"));
class AuthHandler {
    constructor(options) {
        this._logger = new console_1.Logger("Auth Handler", 'green');
        if (!options)
            throw new Error("Invalid AuthHandler Options");
        this._options = options;
        fs_1.default.mkdirSync(options.cacheDir, { recursive: true });
        this._logger.success("Auth Provider Prepared");
    }
    getLogger() { return this._logger; }
    createConfig() {
        return {
            auth: {
                clientId: this._options.clientId,
                authority: this._options.authority,
            },
            cache: {
                cachePlugin: (0, CachePlugin_1.CachePlugin)((0, path_1.resolve)(this._options.cacheDir, "cache.json")),
            },
        };
    }
    createApp(config) {
        this._msalApp = new msal_node_1.PublicClientApplication(config);
        this._logger.success("Auth Provider App Created");
    }
    /**
     * Creates Auth Link For User To Auth With
     * @returns {Promise<AuthenticationResult>} Authenticated User Info
     */
    createDeviceOauthGrant(request) {
        return this._msalApp.acquireTokenByDeviceCode(request);
    }
    /**
     * Auths a user via username and password. As far as I know this is not multi-factor compatible
     * @param username Username For Account
     * @param password Password For Account
     * @param scopes Access Scopes
     * @returns {Promise<AuthenticationResult>} Authenticated User Info
     */
    authByUsernameAndPass(username, password, scopes) {
        return this._msalApp.acquireTokenByUsernamePassword({
            username,
            password,
            scopes,
        });
    }
    /**
     * Gets User Cache
     */
    getCache() {
        return this._msalApp.getTokenCache();
    }
    /**
     * Attempts to get token from cache
     *
     * Handles refreshing automatically
     */
    aquireTokenFromCache(request) {
        return this._msalApp.acquireTokenSilent(request);
    }
    /**
     * Exchange RPS for XBL User Token
     * @param rps MSAL Access Token
     * @param authTitle Defaults true, dont make false
     */
    exchangeRpsForUserToken(rps, authTitle) {
        authTitle = authTitle || true;
        return XBLAuth.exchangeRpsTicketForUserToken((authTitle ? 'd=' : 't=') + rps);
    }
    /**
     * Excahnge User Token for XSTS
     * @param token User Token
     * @param relyingParty URL Enpoint in which this token will be used
     */
    exchangeUserTokenForXSTS(token, relyingParty) {
        return XBLAuth.exchangeUserTokenForXSTSIdentity(token, {
            raw: false,
            XSTSRelyingParty: relyingParty,
        });
    }
    /**
     * Gets XSTS Credentials To Use Realm API
     */
    async ezXSTSForRealmAPI(user) {
        const userToken = await this.exchangeRpsForUserToken(user.accessToken);
        const XSTSIdentity = await this.exchangeUserTokenForXSTS(userToken.Token, Constants.Endpoints.Authorities.RealmAPI);
        return {
            name: user.account.name,
            hash: XSTSIdentity.userHash,
            token: XSTSIdentity.XSTSToken,
            expires: XSTSIdentity.expiresOn,
        };
    }
    /**
     * Gets XSTS Credentials To Use Raknet
     */
    async ezXSTSForRealmRak(user) {
        const userToken = await this.exchangeRpsForUserToken(user.accessToken);
        const XSTSIdentity = await this.exchangeUserTokenForXSTS(userToken.Token, Constants.Endpoints.Authorities.MineRak);
        return {
            name: user.account.name,
            hash: XSTSIdentity.userHash,
            token: XSTSIdentity.XSTSToken,
            expires: XSTSIdentity.expiresOn,
        };
    }
}
exports.AuthHandler = AuthHandler;
