"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const moment_1 = __importDefault(require("moment"));
const chalk_1 = __importDefault(require("chalk"));
class Logger {
    constructor(manager, color) {
        this._manager = manager;
        this._color = color || 'cyan';
        this._assignChalkColor();
    }
    _assignChalkColor() {
        if (this._color.startsWith("#")) {
            this._chalkColor = chalk_1.default.hex(this._color);
        }
        else {
            this._chalkColor = chalk_1.default[this._color];
        }
    }
    changeColor(newColor) {
        this._color = newColor;
        this._assignChalkColor();
    }
    /**
     * Use hex color for console instead
     *
     * `EG: #ff69b4`
     */
    useHex(newColor) {
        this._color = newColor;
        this._assignChalkColor();
    }
    info(...content) {
        console.info(`${chalk_1.default.gray((0, moment_1.default)().format("<MM/DD/YY hh:mm:ss>"))} ${this._chalkColor(`[${this._manager}]`)} ${chalk_1.default.cyan("[Info]")}`, ...content);
    }
    success(...content) {
        console.log(`${chalk_1.default.gray((0, moment_1.default)().format("<MM/DD/YY hh:mm:ss>"))} ${this._chalkColor(`[${this._manager}]`)} ${chalk_1.default.green("[Success]")}`, ...content);
    }
    warn(...content) {
        console.warn(`${chalk_1.default.gray((0, moment_1.default)().format("<MM/DD/YY hh:mm:ss>"))} ${this._chalkColor(`[${this._manager}]`)} ${chalk_1.default.yellow("[Warn]")}`, ...content);
    }
    error(...content) {
        console.error(`${chalk_1.default.gray((0, moment_1.default)().format("<MM/DD/YY hh:mm:ss>"))} ${this._chalkColor(`[${this._manager}]`)} ${chalk_1.default.red("[Error]")}`, ...content);
    }
    debug(...content) {
        console.debug(`${chalk_1.default.gray((0, moment_1.default)().format("<MM/DD/YY hh:mm:ss>"))} ${this._chalkColor(`[${this._manager}]`)} ${chalk_1.default.magenta("[Debug]")}`, ...content);
    }
}
exports.Logger = Logger;
