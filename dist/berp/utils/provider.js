"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataProvider = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const Constants_1 = require("../../Constants");
const path_1 = require("path");
const _1 = require(".");
const fs_1 = __importDefault(require("fs"));
class DataProvider {
    static getDataMap() {
        const dataMap = new Map();
        const path = (0, path_1.resolve)(Constants_1.ProtoDataPath, Constants_1.CUR_VERSION);
        try {
            const files = (0, _1.getFiles)(path);
            for (const file of files) {
                const splitFilePath = file.split(/(\/|\\)/);
                const fileName = splitFilePath[splitFilePath.length - 1];
                dataMap.set(fileName, file);
            }
        }
        catch { }
        return {
            getFile(file) {
                const path = dataMap.get(file);
                if (path) {
                    return fs_1.default.readFileSync(path);
                }
                else {
                    return undefined;
                }
            },
        };
    }
}
exports.DataProvider = DataProvider;
