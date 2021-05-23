"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
class UnauthorizedError extends Error {
    constructor() {
        super("Access denied! You need to be authorized to perform this action!");
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.UnauthorizedError = UnauthorizedError;
