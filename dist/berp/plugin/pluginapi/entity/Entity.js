"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
class Entity {
    constructor(options, berp, connection, pluginApi) {
        this._id = options.id;
        this._nameTag = options.nameTag;
        this._runtimeId = options.runtimeId;
        this._berp = berp;
        this._connection = connection;
        this._pluginApi = pluginApi;
        this._pluginApi.getEntityManager().addEntity(this);
    }
    getID() { return this._id; }
    getNameTag() { return this._nameTag; }
    getRuntimeID() { return this._runtimeId; }
    executeCommand(command) {
        this._pluginApi.getSocketManager().sendMessage({
            berp: {
                event: "UpdateEntity",
                entity: this._runtimeId,
                data: {
                    command: command,
                },
                requestId: this._pluginApi.getSocketManager().newUUID(),
            },
        });
    }
    setNameTag(nameTag) {
        this._nameTag = nameTag;
        this._pluginApi.getSocketManager().sendMessage({
            berp: {
                event: "UpdateEntity",
                entity: this._runtimeId,
                data: {
                    nameTag: nameTag,
                },
                requestId: this._pluginApi.getSocketManager().newUUID(),
            },
        });
    }
    async getLocation() {
        return new Promise((res) => {
            this._pluginApi.getSocketManager().sendMessage({
                berp: {
                    event: "EntityRequest",
                    entity: this._runtimeId,
                    requestId: this._pluginApi.getSocketManager().newUUID(),
                },
            }, (packet) => {
                if (!packet.entity)
                    return res({
                        x: 0,
                        y: 0,
                        z: 0,
                    });
                return res(packet.entity.location);
            });
        });
    }
}
exports.Entity = Entity;
