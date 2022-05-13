"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMixinsToClass = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
function applyMixinsToClass(derivedCtor, ...baseCtors) {
    for (const ctor of baseCtors) {
        for (const name of Object.getOwnPropertyNames(ctor.prototype)) {
            if (name !== 'constructor') {
                derivedCtor.prototype[name] = ctor.prototype[name];
            }
        }
    }
}
exports.applyMixinsToClass = applyMixinsToClass;
