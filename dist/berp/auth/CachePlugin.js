"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachePlugin = void 0;
const fs_1 = __importDefault(require("fs"));
function CachePlugin(location) {
    const beforeCacheAccess = (cacheContext) => {
        return new Promise((resolve, reject) => {
            if (fs_1.default.existsSync(location)) {
                fs_1.default.readFile(location, "utf-8", (err, data) => {
                    if (err) {
                        reject();
                    }
                    else {
                        cacheContext.tokenCache.deserialize(data);
                        resolve();
                    }
                });
            }
            else {
                fs_1.default.writeFile(location, cacheContext.tokenCache.serialize(), (err) => {
                    if (err) {
                        reject();
                    }
                    resolve(); // Is needed lol
                });
            }
        });
    };
    const afterCacheAccess = (cacheContext) => {
        return new Promise((resolve, reject) => {
            if (cacheContext.cacheHasChanged) {
                fs_1.default.writeFile(location, cacheContext.tokenCache.serialize(), (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            }
            else {
                resolve();
            }
        });
    };
    return {
        beforeCacheAccess,
        afterCacheAccess,
    };
}
exports.CachePlugin = CachePlugin;
