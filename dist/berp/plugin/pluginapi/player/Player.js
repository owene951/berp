"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(options, berp, connection, pluginApi) {
        this._name = options.name;
        this._nameTag = options.name;
        this._realmID = connection.realm.id;
        this._uuid = options.uuid;
        this._xuid = options.xuid;
        this._entityID = options.entityID;
        this._device = options.device;
        this._skinData = options.skinData;
        this._berp = berp;
        this._connection = connection;
        this._pluginApi = pluginApi;
        this._pluginApi.getPlayerManager().addPlayer(this);
    }
    getName() { return this._name; }
    getNameTag() { return this._nameTag; }
    getRealmID() { return this._realmID; }
    getUUID() { return this._uuid; }
    getXuid() { return this._xuid; }
    getEntityID() { return this._entityID; }
    getDevice() {
        switch (this._device) {
            case 1:
                return 'Android';
            case 2:
                return 'iOS';
            case 3:
                return 'iOS';
            case 4:
                return 'Kindle Fire';
            case 7:
                return 'Windows';
            case 11:
                return 'PlayStation';
            case 12:
                return 'Switch';
            case 13:
                return 'Xbox';
            default:
                return `Unknown ID: ${this._device}`;
        }
    }
    getSkinData() { return this._skinData; }
    getExecutionName() {
        if (this._name != this._nameTag)
            return this._nameTag;
        return this._name;
    }
    getConnection() { return this._connection; }
    setNameTag(nameTag) {
        if (!this._pluginApi.getSocketManager().enabled)
            return this._pluginApi.getLogger().error("setNameTag() can't be used because there is no Socket Connection.");
        this._pluginApi.getPlayerManager().updatePlayerNameTag(this, nameTag);
        this._nameTag = nameTag;
    }
    setNameTagBackDoor(nameTag) {
        this._pluginApi.getPlayerManager().updatePlayerNameTag(this, nameTag, false);
        this._nameTag = nameTag;
    }
    sendMessage(message) {
        this._pluginApi.getCommandManager().executeCommand(`tellraw "${this.getExecutionName()}" {"rawtext":[{"text":"${message}"}]}`);
    }
    sendTitle(message, slot) {
        this._pluginApi.getCommandManager().executeCommand(`titleraw "${this.getExecutionName()}" ${slot} {"rawtext":[{"text":"${message}"}]}`);
    }
    executeCommand(command, callback) {
        if (callback) {
            this._pluginApi.getCommandManager().executeCommand(`execute "${this.getExecutionName()}" ~ ~ ~ ${command}`, (data) => {
                callback(data);
            });
        }
        else {
            this._pluginApi.getCommandManager().executeCommand(`execute "${this.getExecutionName()}" ~ ~ ~ ${command}`);
        }
    }
    async getTags() {
        return new Promise((r) => {
            this._pluginApi.getCommandManager().executeCommand(`tag "${this.getExecutionName()}" list`, (res) => {
                if (!res.output[0].paramaters[1])
                    return r([]);
                const filter = [res.output[0].paramaters[0], res.output[0].paramaters[1]];
                const tags = res.output[0].paramaters.filter(x => !filter.includes(x)).toString()
                    .replace(/§\S/g, "")
                    .split(', ');
                return r(tags);
            });
        });
    }
    async hasTag(tag) {
        if (!(await this.getTags()).includes(tag))
            return false;
        return true;
    }
    addTag(tag) {
        this._pluginApi.getCommandManager().executeCommand(`tag "${this.getExecutionName()}" add "${tag}"`);
    }
    removeTag(tag) {
        this._pluginApi.getCommandManager().executeCommand(`tag "${this.getExecutionName()}" remove "${tag}"`);
    }
    async getScore(objective) {
        return new Promise((r) => {
            this._pluginApi.getCommandManager().executeCommand(`scoreboard players test "${this.getExecutionName()}" ${objective} * *`, (res) => {
                if (res.output[0].paramaters[0] == this._name)
                    return r(0);
                return r(parseInt(res.output[0].paramaters[0]));
            });
        });
    }
    updateScore(operation, objective, value) {
        this._pluginApi.getCommandManager().executeCommand(`scoreboard players ${operation} "${this.getExecutionName()}" ${objective} ${value}`);
    }
    kick(reason) {
        this._pluginApi.getCommandManager().executeCommand(`kick "${this.getExecutionName()}" ${reason}`);
    }
    async getItemCount(item) {
        return new Promise((r) => {
            this._pluginApi.getCommandManager().executeCommand(`clear "${this.getExecutionName()}" ${item} 0 0`, (res) => {
                let count = res.output[0].paramaters[1];
                if (count == undefined)
                    count = '0';
                return r(parseInt(count));
            });
        });
    }
    async getLocation() {
        if (!this._pluginApi.getSocketManager().enabled)
            return this._pluginApi.getLogger().error("getLocation() can't be used because there is no Socket Connection.");
        return new Promise((res) => {
            this._pluginApi.getSocketManager().sendMessage({
                berp: {
                    event: "PlayerRequest",
                    player: this._name,
                    requestId: this._pluginApi.getSocketManager().newUUID(),
                },
            }, (packet) => {
                if (!packet.player)
                    return res({
                        x: 0,
                        y: 0,
                        z: 0,
                    });
                return res(packet.player.location);
            });
        });
    }
    async getInventory() {
        if (!this._pluginApi.getSocketManager().enabled)
            return this._pluginApi.getLogger().error("getInventory() can't be used because there is no Socket Connection.");
        return new Promise((res) => {
            this._pluginApi.getSocketManager()
                .sendMessage({
                berp: {
                    event: "InventoryRequest",
                    player: this.getName(),
                    requestId: this._pluginApi.getSocketManager()
                        .newUUID(),
                },
            }, (packet) => {
                return res(packet.data);
            });
        });
    }
}
exports.Player = Player;
