"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recompile = void 0;
const Constants_1 = require("../../Constants");
const BaseCommand_1 = require("./base/BaseCommand");
const utils_1 = require("../../berp/utils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Recompile extends BaseCommand_1.BaseCommand {
    constructor(berp) {
        super();
        this.name = "recompile";
        this.description = "Attempts to recompile protocol files. Please be aware using this while connected to realms may cause some temporary errors.";
        this.usage = "";
        this.aliases = [
            "rc",
        ];
        this._berp = berp;
    }
    execute() {
        this._berp.getCommandHandler()
            .getLogger()
            .warn("Attempting protodef recompile. Process could cause temporary errors in console.");
        fs_1.default.rmSync(path_1.default.resolve(Constants_1.ProtoDataPath, Constants_1.CUR_VERSION), {
            recursive: true,
        });
        (0, utils_1.AttemptProtocolCompiler)();
    }
}
exports.Recompile = Recompile;
