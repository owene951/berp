"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRequests = void 0;
const Message_1 = require("./Message");
const enable_1 = require("./enable");
const heartbeat_1 = require("./heartbeat");
const GetRequests_1 = require("./GetRequests");
const EntityCreate_1 = require("./EntityCreate");
const EntityDestroyed_1 = require("./EntityDestroyed");
const PlayerMessage_1 = require("./PlayerMessage");
const GetPlayers_1 = require("./GetPlayers");
const GetEntities_1 = require("./GetEntities");
const NameTagChanged_1 = require("./NameTagChanged");
exports.defaultRequests = [
    Message_1.Message,
    enable_1.EnableRequest,
    heartbeat_1.Heartbeat,
    GetRequests_1.GetRequests,
    EntityCreate_1.EntityCreate,
    EntityDestroyed_1.EntityDestroyed,
    PlayerMessage_1.PlayerMessage,
    GetPlayers_1.GetPlayers,
    GetEntities_1.GetEntities,
    NameTagChanged_1.NameTagChanged,
];
