"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityCreate = void 0;
const Entity_1 = require("../../entity/Entity");
class EntityCreate {
    constructor(socket, berp, connection, pluginApi) {
        this.requestName = "EntityCreate";
        this._socket = socket;
        this._berp = berp;
        this._connection = connection;
        this._pluginApi = pluginApi;
    }
    onEnabled() {
        this._socket.on("EntityCreate", (packet) => {
            new Entity_1.Entity({
                id: packet.entity.id,
                nameTag: packet.entity.nameTag,
                runtimeId: packet.entity.runtimeId,
            }, this._berp, this._connection, this._pluginApi);
        });
    }
    onDisabled() {
        //
    }
}
exports.EntityCreate = EntityCreate;
