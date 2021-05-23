"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictingDefaultWithNullableError = void 0;
class ConflictingDefaultWithNullableError extends Error {
    constructor(targetName, propertyName, defaultValue, nullable) {
        super(`Wrong nullable option set for ${targetName}#${propertyName}. ` +
            `You cannot combine default value '${defaultValue}' with nullable '${nullable}'.`);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.ConflictingDefaultWithNullableError = ConflictingDefaultWithNullableError;
