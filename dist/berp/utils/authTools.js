"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createXBLToken = void 0;
function createXBLToken(xstsResponse) {
    return `XBL3.0 x=${xstsResponse.hash};${xstsResponse.token}`;
}
exports.createXBLToken = createXBLToken;
