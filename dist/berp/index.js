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
exports.BeRP = void 0;
const console_1 = require("../console");
const http_1 = require("./http");
const utils_1 = require("../utils");
const utils_2 = require("./utils");
const network_1 = require("./network");
const auth_1 = require("./auth");
const PluginManager_1 = require("./plugin/PluginManager");
const path_1 = require("path");
const Constants = __importStar(require("../Constants"));
const CommandManager_1 = require("./command/CommandManager");
class BeRP {
    constructor() {
        this._logger = new console_1.Logger('BeRP', '#6990ff');
        this.Request = http_1.Request;
        (0, utils_1.logLogo)();
        this._logger.info("Preparing Modules...");
        (0, utils_2.AttemptProtocolCompiler)();
        this._networkManager = new network_1.NetworkManager(this);
        this._sequentialBucket = new http_1.SequentialBucket(5, new console_1.Logger("Sequential Bucket", "#8769ff"));
        this._authProvider = new auth_1.AuthHandler({
            clientId: Constants.AzureClientID,
            authority: Constants.Endpoints.Authorities.MSAL,
            cacheDir: (0, path_1.resolve)(process.cwd(), 'msal-cache'),
        });
        this._authProvider.createApp(this._authProvider.createConfig());
        this._commandManager = new CommandManager_1.CommandManager(this);
        this._pluginManager = new PluginManager_1.PluginManager(this);
        this._console = new console_1.BerpConsole();
        this._commandHandler = new console_1.CommandHandler(this);
    }
    getConsole() { return this._console; }
    getLogger() { return this._logger; }
    getCommandHandler() { return this._commandHandler; }
    getNetworkManager() { return this._networkManager; }
    getAuthProvider() { return this._authProvider; }
    getSequentialBucket() { return this._sequentialBucket; }
    getCommandManager() { return this._commandManager; }
    getPluginManager() { return this._pluginManager; }
}
exports.BeRP = BeRP;
