"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = void 0;
class ForbiddenError extends Error {
    constructor() {
        super("Access denied! You don't have permission for this action!");
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.ForbiddenError = ForbiddenError;
