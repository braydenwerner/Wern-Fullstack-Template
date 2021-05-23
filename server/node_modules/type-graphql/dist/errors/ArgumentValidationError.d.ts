import type { ValidationError } from "class-validator";
export declare class ArgumentValidationError extends Error {
    validationErrors: ValidationError[];
    constructor(validationErrors: ValidationError[]);
}
