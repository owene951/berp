"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextUUID = exports.uuidFrom = void 0;
const uuid_1345_1 = __importDefault(require("uuid-1345"));
function uuidFrom(string) {
    return uuid_1345_1.default.v3({
        namespace: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
        name: string,
    });
}
exports.uuidFrom = uuidFrom;
function nextUUID() {
    return uuidFrom(Date.now().toString());
}
exports.nextUUID = nextUUID;
