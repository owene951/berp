"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const axios_1 = __importDefault(require("axios"));
class Request {
    constructor(request, options) {
        this._req = request || undefined;
        this._options = Object.assign({
            attempts: 5,
            attemptTimeout: 5000,
            requestTimeout: 25000,
        }, options || {});
    }
    getRequest() { return this._req; }
    setRequest(req) { this._req = req; }
    getRequestOptions() { return this._options; }
    setRequestOptions(options) { this._options = options; }
    /**
     * Method is called once Sequential Bucket successfully makes request
     *
     * Client is expected to override this method with their own function
     * ___
     * `Example`
     * ```
     *  Request.onFufilled = (data: MyInterface): void => { My Logic }
     * ```
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onFufilled(data) {
        /* User Inplemented Method */
    }
    /**
     * Method is called when Sequential Bucket completely fails to make request
     *
     * Client is expected to override this method with their own function
     * ___
     * `Example`
     * ```
     *  Request.onFailed = (err: MyInterface): void => { My Logic }
     * ```
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onFailed(err) {
        /* User Inplemented Method */
    }
    async makeRequest(cb) {
        if (!this._req || !this._req.url || !this._req.method)
            throw Error("Request method & url required to make a request!");
        try {
            const { data } = await (0, axios_1.default)({
                method: this._req.method,
                url: this._req.url,
                headers: this._req.headers || undefined,
                data: this._req.body || undefined,
                timeout: this._options.requestTimeout,
                timeoutErrorMessage: `Request failed to resolve after ${this._options.requestTimeout}ms. Failing request!`,
            });
            if (cb) {
                return cb(undefined, data);
            }
            else {
                return new Promise((r) => {
                    r(data);
                });
            }
        }
        catch (error) {
            if (cb) {
                return cb(error, undefined);
            }
            else {
                return new Promise((r, j) => {
                    j(error);
                });
            }
        }
    }
}
exports.Request = Request;
