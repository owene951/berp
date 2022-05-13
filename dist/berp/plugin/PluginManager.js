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
exports.PluginManager = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
const console_1 = require("../../console");
const path_1 = __importDefault(require("path"));
const child_process_1 = __importDefault(require("child_process"));
const pluginApi_1 = require("./pluginapi/pluginApi");
const fs_1 = __importDefault(require("fs"));
const events_1 = require("events");
const axios_1 = __importDefault(require("axios"));
class PluginManager extends events_1.EventEmitter {
    constructor(berp) {
        super();
        this._knownPlugins = new Map();
        this._activePlugins = new Map();
        this._pluginInstances = new Map();
        this._tempPlugins = new Map();
        this._pluginsPath = path_1.default.resolve(process.cwd(), './plugins');
        this._latestInterfaces = {
            pluginApi: 'https://raw.githubusercontent.com/NobUwU/BeRP/main/src/types/pluginApi.i.ts',
            packets: 'https://raw.githubusercontent.com/NobUwU/BeRP/main/src/types/packets.i.ts',
            packetTypes: 'https://raw.githubusercontent.com/NobUwU/BeRP/main/src/types/packetTypes.i.ts',
        };
        this._apiId = 0;
        this._pluginId = 0;
        this._berp = berp;
        this._logger = new console_1.Logger('Plugin Manager', '#6d17b3');
        this._loadAll();
    }
    async _loadAll() {
        return new Promise(async (res) => {
            if (!fs_1.default.existsSync(this._pluginsPath)) {
                this._logger.warn("Plugins folder does not exist. Creating plugins folder:", `"${this._pluginsPath}"`);
                fs_1.default.mkdirSync(this._pluginsPath, { recursive: true });
                return res();
            }
            const pluginDirs = [];
            for (const item of fs_1.default.readdirSync(this._pluginsPath)) {
                if (!fs_1.default.statSync(path_1.default.resolve(this._pluginsPath, item)).isDirectory())
                    continue;
                pluginDirs.push(item);
            }
            if (pluginDirs.length < 1) {
                this._logger.info('No Plugins found!');
                return res();
            }
            for await (const plugin of pluginDirs) {
                await this.register(path_1.default.resolve(this._pluginsPath, plugin));
            }
            for (const [, temp] of this._tempPlugins) {
                try {
                    temp.plugin.onLoaded();
                    temp.api.onEnabled();
                }
                catch (err) { }
            }
            return res();
        });
    }
    async register(pluginPath) {
        return new Promise(async (res) => {
            try {
                const confPath = path_1.default.resolve(pluginPath, "package.json");
                if (!fs_1.default.existsSync(confPath)) {
                    this._logger.error(`package.json does not exsist in "${pluginPath}". Skipping plugin!`);
                    return res();
                }
                const config = await Promise.resolve().then(() => __importStar(require(confPath)));
                if (!this._verifyConfig(pluginPath, config))
                    return res();
                const pluginApiInterface = await axios_1.default.get(this._latestInterfaces.pluginApi);
                const packetsInterface = await axios_1.default.get(this._latestInterfaces.packets);
                const packetTypesInterface = await axios_1.default.get(this._latestInterfaces.packetTypes);
                if (!fs_1.default.existsSync(path_1.default.resolve(pluginPath, 'src', '@interface')))
                    fs_1.default.mkdirSync(path_1.default.resolve(pluginPath, 'src', '@interface'));
                fs_1.default.writeFileSync(path_1.default.resolve(pluginPath, 'src', '@interface', 'pluginApi.i.ts'), pluginApiInterface.data);
                fs_1.default.writeFileSync(path_1.default.resolve(pluginPath, 'src', '@interface', 'packets.i.ts'), packetsInterface.data);
                fs_1.default.writeFileSync(path_1.default.resolve(pluginPath, 'src', '@interface', 'packetTypes.i.ts'), packetTypesInterface.data);
                let neededUpdate = false;
                let succeededUpdate = false;
                let buildSuccess = true;
                let alreadyBuilt = false;
                if (!fs_1.default.existsSync(path_1.default.resolve(pluginPath, "node_modules")) && (config.dependencies || config.devDependencies)) {
                    neededUpdate = true;
                    succeededUpdate = await this._update(pluginPath, config);
                }
                if (neededUpdate && !succeededUpdate) {
                    this._logger.error(`Skipping plugin "${config.displayName || pluginPath}". Failed to install dependencies.`);
                    return res();
                }
                if (!fs_1.default.existsSync(path_1.default.resolve(pluginPath, "dist"))) {
                    buildSuccess = await this._build(pluginPath, config);
                    alreadyBuilt = true;
                }
                if (config.devMode !== false && !alreadyBuilt) {
                    this._logger.warn(`Plugin "${config.displayName || pluginPath}" is in dev mode. Set devMode to false in package.json to disable`);
                    buildSuccess = await this._build(pluginPath, config);
                }
                if (!buildSuccess) {
                    this._logger.error(`Skipping plugin "${config.displayName || pluginPath}". Failed to build.`);
                    return res();
                }
                try {
                    this._logger.info(`Successfully loaded plugin "${config.displayName || pluginPath}"`);
                    this._pluginId++;
                    this._knownPlugins.set(pluginPath, {
                        config: config,
                        pluginId: this._pluginId,
                    });
                    const entryPoint = path_1.default.resolve(pluginPath, config.main);
                    const api = new pluginApi_1.PluginApi(this._berp, config, pluginPath, {
                        realm: {
                            id: 0,
                        },
                    }, {
                        apiId: 0,
                        pluginId: 0,
                        instanceId: 0,
                    }, true);
                    const pluginClass = require(entryPoint);
                    const plugin = new pluginClass(api);
                    this._tempPlugins.set(`${config.name}:${config.author}`, {
                        config: config,
                        plugin: plugin,
                        api: api,
                        connection: {},
                        path: pluginPath,
                        ids: {
                            api: 0,
                            plugin: 0,
                            instance: 0,
                        },
                    });
                    try {
                    }
                    catch (error) {
                        this._logger.error(`Plugin "${config.displayName || path_1.default}". Uncaught Exception(s):\n`, error);
                    }
                }
                catch (error) {
                    this._logger.error(`Plugin "${config.displayName || path_1.default}". Uncaught Exception(s):\n`, error);
                }
            }
            catch (error) {
            }
            return res();
        });
    }
    async reload() {
        await this.killAllPlugins();
        this._knownPlugins = new Map();
        this._activePlugins = new Map();
        this._pluginInstances = new Map();
        this._tempPlugins = new Map();
        await this._loadAll();
        for (const [, ac] of this._berp.getNetworkManager().getAccounts()) {
            for (const [, c] of ac.getConnections()) {
                this.registerPlugins(c);
            }
        }
    }
    async _update(path, config) {
        return new Promise((res) => {
            this._logger.info(`Installing dependencies for "${config.displayName || path}"`);
            child_process_1.default.exec('npm i typescript', {
                cwd: path,
            }, (err, out, s) => {
                if (err) {
                    this._logger.error(`Failed to install dependencies for "${config.displayName || path}". Recieved Error(s):\n`, out, s);
                    res(false);
                }
            });
            child_process_1.default.exec('npm i', {
                cwd: path,
            }, (err, out, s) => {
                if (err) {
                    this._logger.error(`Failed to install dependencies for "${config.displayName || path}". Recieved Error(s):\n`, out, s);
                    res(false);
                }
                else {
                    this._logger.info(`Finished installing dependencies for "${config.displayName || path}"`);
                    res(true);
                }
            });
        });
    }
    async _build(path, config) {
        return new Promise((res) => {
            this._logger.info(`Attempting to build "${config.displayName || path}"`);
            child_process_1.default.exec('npm run build', {
                cwd: path,
            }, (err, out) => {
                if (err) {
                    this._logger.error(`Failed to build "${config.displayName || path}". Recieved Error(s):\n`, out);
                    res(false);
                }
                else {
                    this._logger.info(`Successfully built "${config.displayName || path}"`);
                    res(true);
                }
            });
        });
    }
    _verifyConfig(path, config) {
        if (config.displayName == undefined)
            this._logger.warn(`@${config.author}, your plugin is missing "displayName" in your package.json. Your plugin will be refered as "${path}"`);
        if (!config.version)
            this._logger.warn(`plugin "${config.displayName || path}" missing version prop in package.json`);
        if (config.devMode === undefined)
            this._logger.info(`plugin "${config.displayName || path}" missing devMode prop in package.json. Auto defaults to true!`);
        if (!config.main) {
            this._logger.error(`plugin "${config.displayName || path}" missing main prop in package.json. Cannot start plugin without valid path to main file!`);
            return false;
        }
        if (!config.scripts) {
            this._logger.error(`plugin "${config.displayName || path}" missing scripts in package.json. Cannot start plugin without needed scripts!`);
            return false;
        }
        if (!config.scripts.build) {
            this._logger.error(`plugin "${config.displayName || path}" missing scripts.build in package.json. Cannot start plugin without needed scripts!`);
            return false;
        }
        if (!config.dependencies && !config.devDependencies) {
            this._logger.info(`WOW @${config.author || config.displayName || path}, your plugin has absolutely no depedencies! However, you should probably add "@types/node" as a devdependency.`);
        }
        if (!config.devDependencies) {
            this._logger.warn(`plugin "${config.displayName || path}" does not have @types/node. This is known to cause issues for some people. Please add "@types/node" as a devdependency to your project`);
        }
        if (config.devDependencies) {
            const devDependencies = Object.keys(config.devDependencies);
            if (!devDependencies.includes("@types/node")) {
                this._logger.warn(`plugin "${config.displayName || path}" does not have @types/node. This is known to cause issues for some people. Please add "@types/node" as a devdependency to your project`);
            }
        }
        if (config.devDependencies && !config.dependencies) {
            const devDependencies = Object.keys(config.devDependencies);
            const filterTypes = devDependencies.filter(d => d !== "@types/node");
            if (filterTypes.length < 1) {
                this._logger.info(`Great job @${config.author || config.displayName || path}! your plugin has absolutely no depedencies!`);
            }
        }
        if (config.dependencies) {
            const dependencies = Object.keys(config.dependencies);
            const dependencyFilter = dependencies.filter(i => i !== "ts-node" && i !== "typescript");
            let onlyTypes = true;
            if (config.devDependencies) {
                const devDependencies = Object.keys(config.devDependencies);
                const filterTypes = devDependencies.filter(d => d !== "@types/node");
                if (filterTypes.length > 1) {
                    onlyTypes = false;
                }
            }
            if (dependencyFilter.length < 1 && onlyTypes) {
                this._logger.info(`Congrats @${config.author || config.displayName || path}, your plugin does not use any dependencies other than the needed ones!`);
            }
        }
        return true;
    }
    async registerPlugins(connection) {
        this._apiId++;
        const plugins = [];
        return new Promise(async (res) => {
            for await (const [plpath, options] of this._knownPlugins) {
                const entryPoint = path_1.default.resolve(plpath, options.config.main);
                const plugin = require(entryPoint);
                const inst = this._pluginInstances.get(options.config.name) ?? 0;
                this._pluginInstances.set(options.config.name, inst + 1);
                const pluginAPI = new pluginApi_1.PluginApi(this._berp, options.config, plpath, connection, {
                    apiId: this._apiId,
                    pluginId: options.pluginId,
                    instanceId: inst + 1,
                });
                const newPlugin = new plugin(pluginAPI);
                this._activePlugins.set(`${connection.id}:${this._apiId}:${options.config.name}:${options.pluginId}`, {
                    config: options.config,
                    plugin: newPlugin,
                    api: pluginAPI,
                    connection: connection,
                    path: plpath,
                    ids: {
                        api: this._apiId,
                        plugin: options.pluginId,
                        instance: inst + 1,
                    },
                });
                await pluginAPI.onEnabled();
                try {
                    newPlugin.onEnabled();
                }
                catch (err) { }
                plugins.push({
                    config: options.config,
                    plugin: newPlugin,
                    api: pluginAPI,
                    connection: connection,
                    path: plpath,
                    ids: {
                        api: this._apiId,
                        plugin: options.pluginId,
                        instance: 0,
                    },
                });
            }
            return res(plugins);
        });
    }
    async killPlugins(connection) {
        for (const [, pluginOptions] of this._activePlugins) {
            if (pluginOptions.connection !== connection)
                continue;
            try {
                await pluginOptions.plugin.onDisabled();
            }
            catch (err) { }
            await pluginOptions.api.onDisabled();
            this._activePlugins.delete(`${pluginOptions.connection.id}:${pluginOptions.ids.api}:${pluginOptions.config.name}:${pluginOptions.ids.plugin}`);
        }
    }
    killTempPlugins() {
        for (const [, temp] of this._tempPlugins) {
            temp.api.onDisabled();
        }
    }
    async killAllPlugins() {
        for (const [, plugin] of this._activePlugins) {
            try {
                await plugin.plugin.onDisabled();
            }
            catch (err) { }
            await plugin.api.onDisabled();
            this._activePlugins.delete(`${plugin.connection.id}:${plugin.ids.api}:${plugin.config.name}:${plugin.ids.plugin}`);
        }
    }
    getPlugins() { return this._knownPlugins; }
    getActivePlugins() { return this._activePlugins; }
}
exports.PluginManager = PluginManager;
