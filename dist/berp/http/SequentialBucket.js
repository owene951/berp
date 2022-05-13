"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequentialBucket = void 0;
const console_1 = require("../../console");
class SequentialBucket {
    constructor(interval, logger, debug = false) {
        this._runtimeId = 0n;
        this._bucket = new Map();
        this._failedBucket = new Map();
        this._flushPaused = true;
        this._reqInt = interval || 10;
        this._logger = logger || new console_1.Logger(`Sequential Bucket ${Date.now().toString()
            .substring(7)}`, "#8769ff");
        this._debug = debug;
        this.resumeFlush();
        this._logger.success("Bucket Initialized");
    }
    getLogger() { return this._logger; }
    getRuntimeId() { return this._runtimeId; }
    getBucket() { return this._bucket; }
    getFailedBucket() { return this._failedBucket; }
    resumeFlush() {
        if (this._flushPaused) {
            this._requestPool = setInterval(() => {
                if (this._bucket.size > 0) {
                    const [id, req] = Array.from(this._bucket.entries())[0];
                    if (id) {
                        this._bucket.delete(id);
                        this._attemptRequest(id, req);
                    }
                }
            }, this._reqInt);
            this._flushPaused = false;
        }
    }
    pauseFlush() {
        if (!this._flushPaused) {
            clearInterval(this._requestPool);
            this._flushPaused = true;
        }
    }
    addRequest(r) {
        this._runtimeId++;
        this._bucket.set(this._runtimeId, r);
        return this._runtimeId;
    }
    removeRequest(runtimeId) {
        const r = this._bucket.get(runtimeId);
        this._bucket.delete(runtimeId);
        return r;
    }
    emptyBucket() {
        const requests = this._bucket.size;
        this._logger.warn(`Emptied bucket.`, requests, "request(s) disposed.");
        this._bucket = new Map();
    }
    emptyFailedBucket() {
        const requests = this._bucket.size;
        this._logger.warn(`Emptied failed bucket.`, requests, "request(s) disposed.");
        this._failedBucket = new Map();
    }
    _attemptRequest(id, r, attempt) {
        try {
            r.makeRequest()
                .then((res) => {
                try {
                    r.onFufilled(res);
                }
                catch (error) {
                    if (this._debug) {
                        this._logger.error("Attempted to call request \"onFulfilled\" method, but recieved error", error);
                        this._failedBucket.set(id, r);
                    }
                }
            })
                .catch((error) => {
                if (r.getRequestOptions().attempts - 1 > (attempt ? attempt : 0)) {
                    if (this._debug)
                        this._logger.warn("Error occured when attempting to make request. Attempting request again in", r.getRequestOptions().attemptTimeout + "ms");
                    setTimeout(() => {
                        this._attemptRequest(id, r, attempt ? attempt += 1 : 1);
                    }, r.getRequestOptions().attemptTimeout || 2000);
                }
                else {
                    if (this._debug)
                        this._logger.error("Failed to make request after", r.getRequestOptions().attempts, "attempts... Disposing request.");
                    this._failedBucket.set(id, r);
                    try {
                        r.onFailed(error);
                    }
                    catch (error) {
                        if (this._debug) {
                            this._logger.error("Attempted to call request \"onFailed\" method, but recieved error", error);
                        }
                    }
                }
            });
        }
        catch (error) {
            this._logger.error("Failed to make request during flush... Disposing request\n", error);
            this._failedBucket.set(id, r);
            try {
                r.onFailed(error);
            }
            catch (error) {
                if (this._debug) {
                    this._logger.error("Attempted to call request \"onFailed\" method, but recieved error", error);
                }
            }
        }
    }
}
exports.SequentialBucket = SequentialBucket;
