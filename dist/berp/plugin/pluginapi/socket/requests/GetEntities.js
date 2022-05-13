"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEntities = void 0;
const Entity_1 = require("../../entity/Entity");
class GetEntities {
    constructor(socket, berp, connection, pluginApi) {
        this.requestName = "GetEntities";
        this._socket = socket;
        this._berp = berp;
        this._connection = connection;
        this._pluginApi = pluginApi;
    }
    onEnabled() {
        this._socket.on("Enabled", () => {
            this._socket.sendPacket("GetEntities", undefined, (res) => {
                for (const entity of res.data) {
                    if (this._pluginApi.getEntityManager().getEntities()
                        .has(entity.runtimeId))
                        continue;
                    new Entity_1.Entity({
                        id: entity.id,
                        nameTag: entity.nameTag,
                        runtimeId: entity.runtimeId,
                    }, this._berp, this._connection, this._pluginApi);
                }
            });
        });
    }
    onDisabled() {
        //
    }
}
exports.GetEntities = GetEntities;
