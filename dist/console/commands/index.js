"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = void 0;
const quit_1 = require("./quit");
const help_1 = require("./help");
const kill_1 = require("./kill");
const recompile_1 = require("./recompile");
const account_1 = require("./account");
const connect_1 = require("./connect");
const connections_1 = require("./connections");
const disconnect_1 = require("./disconnect");
const external_1 = require("./external");
const plugins_1 = require("./plugins");
const reload_1 = require("./reload");
class ex {
    constructor(berp) { }
    execute(argv) { }
}
const Commands = [
    quit_1.Quit,
    help_1.Help,
    kill_1.Kill,
    recompile_1.Recompile,
    account_1.Account,
    connect_1.Connect,
    connections_1.Connections,
    disconnect_1.Disconnect,
    external_1.External,
    plugins_1.Plugins,
    reload_1.Reload,
];
exports.Commands = Commands;
