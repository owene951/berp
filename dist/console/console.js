"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BerpConsole = void 0;
const enquirer_1 = require("enquirer");
const utils_1 = require("../utils");
const events_1 = require("events");
const _1 = require("./");
const chalk_1 = __importDefault(require("chalk"));
class BerpConsole extends events_1.EventEmitter {
    constructor() {
        super();
        this._logger = new _1.Logger("Console", 'gray');
        this._isStopped = true;
        this._listenerBinded = this._listener.bind(this);
        this.start();
    }
    getLogger() { return this._logger; }
    _listener(data) {
        const clean = data.toString().replace(/(\n|\r)/g, "");
        this.emit('input', clean);
    }
    start() {
        if (this._isStopped) {
            process.stdin.resume();
            process.stdin.on('data', this._listenerBinded);
            this._isStopped = false;
        }
    }
    stop() {
        if (!this._isStopped) {
            process.stdin.pause();
            process.stdin.removeListener('data', this._listenerBinded);
            this._isStopped = true;
        }
    }
    sendSelectPrompt(message, args) {
        return new Promise((r) => {
            this.stop();
            new enquirer_1.Select({
                name: "selectprompt",
                message: `${message} ${chalk_1.default.gray('( Nav: ↑ ↓, Select: ↩, Exit: esc )')}`,
                choices: args.map(i => chalk_1.default.grey(i)),
            })
                .run()
                .then(res => {
                r((0, utils_1.stripFormat)(res));
                this.start();
            })
                .catch(() => {
                r(undefined);
                this.start();
            });
        });
    }
}
exports.BerpConsole = BerpConsole;
