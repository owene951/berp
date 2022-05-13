"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultEvents = void 0;
const PlayerJoin_1 = require("./PlayerJoin");
const PlayerLeft_1 = require("./PlayerLeft");
const PlayerInitialized_1 = require("./PlayerInitialized");
const PlayerMessage_1 = require("./PlayerMessage");
const PlayerDied_1 = require("./PlayerDied");
const ChangeSkin_1 = require("./ChangeSkin");
exports.defaultEvents = [
    PlayerJoin_1.PlayerJoin,
    PlayerLeft_1.PlayerLeft,
    PlayerInitialized_1.PlayerInitialized,
    PlayerMessage_1.PlayerMessage,
    PlayerDied_1.PlayerDied,
    ChangeSkin_1.ChangeSkin,
];
