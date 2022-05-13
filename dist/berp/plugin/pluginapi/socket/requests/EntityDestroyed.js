"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityDestroyed = void 0;
class EntityDestroyed {
    constructor(socket, berp, connection, pluginApi) {
        this.requestName = "EntityDestroyed";
        this._socket = socket;
        this._berp = berp;
        this._connection = connection;
        this._pluginApi = pluginApi;
    }
    onEnabled() {
        this._socket.on("EntityDestroyed", (packet) => {
            if (!this._pluginApi.getEntityManager().getEntities()
                .has(packet.entity.runtimeId))
                return;
            const entity = this._pluginApi.getEntityManager().getEntityByRuntimeID(packet.entity.runtimeId);
            this._pluginApi.getEntityManager().removeEntity(entity);
        });
    }
    onDisabled() {
        //
    }
}
exports.EntityDestroyed = EntityDestroyed;
