"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.overrideProcessConsole = void 0;
/* eslint-disable prefer-rest-params */
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const util_1 = require("util");
/**
 * Overrides basic console methods
 * @param dir Directory To Store Log History In
 */
const overrideProcessConsole = (dir) => {
    const lastSessionFile = (0, path_1.resolve)(dir, 'last-session.log');
    const combinedFile = (0, path_1.resolve)(dir, 'combined.log');
    fs_1.default.mkdirSync(dir, { recursive: true });
    const lastSessionStream = fs_1.default.createWriteStream(lastSessionFile);
    const combinedStream = fs_1.default.createWriteStream(combinedFile, { flags: "a" });
    function write(item) {
        lastSessionStream.write(item);
        combinedStream.write(item);
    }
    function closeStreams() {
        lastSessionStream.close();
        combinedStream.close();
    }
    process.once('beforeExit', () => {
        closeStreams();
    });
    console.log = function () {
        process.stdout.write(util_1.format.apply(this, arguments) + '\n');
        write((util_1.format.apply(this, arguments))
            .replace(/\u001b\[.*?m/g, "") + "\n");
    };
    console.info = function () {
        process.stdout.write(util_1.format.apply(this, arguments) + '\n');
        write((util_1.format.apply(this, arguments))
            .replace(/\u001b\[.*?m/g, "") + "\n");
    };
    console.warn = function () {
        process.stdout.write(util_1.format.apply(this, arguments) + '\n');
        write((util_1.format.apply(this, arguments))
            .replace(/\u001b\[.*?m/g, "") + "\n");
    };
    console.debug = function () {
        process.stdout.write(util_1.format.apply(this, arguments) + '\n');
        write((util_1.format.apply(this, arguments))
            .replace(/\u001b\[.*?m/g, "") + "\n");
    };
    console.error = function () {
        process.stderr.write(util_1.format.apply(this, arguments) + '\n');
        write((util_1.format.apply(this, arguments))
            .replace(/\u001b\[.*?m/g, "") + "\n");
    };
};
exports.overrideProcessConsole = overrideProcessConsole;
