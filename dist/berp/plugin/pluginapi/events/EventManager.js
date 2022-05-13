"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManager = void 0;
const events_1 = require("events");
const index_1 = require("./events/index");
class EventManager extends events_1.EventEmitter {
    constructor(berp, connection, pluginApi) {
        super();
        this._events = new Map();
        this._berp = berp;
        this._connection = connection;
        this._pluginApi = pluginApi;
        this._registerEvents();
    }
    async onEnabled() {
        return;
    }
    async onDisabled() {
        return;
    }
    _registerEvents() {
        for (const event of index_1.defaultEvents) {
            const newEvent = new event(this, this._berp, this._connection, this._pluginApi);
            this._events.set(newEvent.eventName, newEvent);
        }
    }
}
exports.EventManager = EventManager;
