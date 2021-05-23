"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isPromiseLike(value) {
    return value != null && typeof value.then === "function";
}
exports.default = isPromiseLike;
