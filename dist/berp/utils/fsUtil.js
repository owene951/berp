"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function getFiles(dir) {
    let results = [];
    const list = fs_1.default.readdirSync(dir);
    list.forEach((file) => {
        file = path_1.default.join(dir, file);
        const stat = fs_1.default.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(file));
        }
        else {
            results.push(file);
        }
    });
    return results;
}
exports.getFiles = getFiles;
