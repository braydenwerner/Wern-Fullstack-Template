"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgumentValidationError = void 0;
class ArgumentValidationError extends Error {
    constructor(validationErrors) {
        super("Argument Validation Error");
        this.validationErrors = validationErrors;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.ArgumentValidationError = ArgumentValidationError;
