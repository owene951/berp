"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripFormat = void 0;
function stripFormat(s) {
    return s.replace(/\u001b\[.*?m/g, "");
}
exports.stripFormat = stripFormat;
