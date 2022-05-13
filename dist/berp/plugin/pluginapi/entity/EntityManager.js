"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityManager = void 0;
class EntityManager {
    constructor(berp, connection, pluginApi) {
        this._entities = new Map();
        this._berp = berp;
        this._connection = connection;
        this._pluginApi = pluginApi;
    }
    async onEnabled() {
        return;
    }
    async onDisabled() {
        return;
    }
    addEntity(entity) {
        this._entities.set(entity.getRuntimeID(), entity);
        this._pluginApi.getEventManager().emit("EntityCreate", entity);
    }
    removeEntity(entity) {
        this._entities.delete(entity.getRuntimeID());
        this._pluginApi.getEventManager().emit("EntityDestroyed", entity);
    }
    getEntityByRuntimeID(runtimID) { return this._entities.get(runtimID); }
    getEntities() { return this._entities; }
}
exports.EntityManager = EntityManager;
