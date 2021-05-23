"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateArg = void 0;
const ArgumentValidationError_1 = require("../errors/ArgumentValidationError");
async function validateArg(argValue, argType, globalValidate, argValidate) {
    const validate = argValidate !== undefined ? argValidate : globalValidate;
    if (validate === false || argValue == null || typeof argValue !== "object") {
        return argValue;
    }
    if (typeof validate === "function") {
        await validate(argValue, argType);
        return argValue;
    }
    const validatorOptions = Object.assign({}, typeof globalValidate === "object" ? globalValidate : {}, typeof argValidate === "object" ? argValidate : {});
    if (validatorOptions.skipMissingProperties !== false) {
        validatorOptions.skipMissingProperties = true;
    }
    const { validateOrReject } = await Promise.resolve().then(() => require("class-validator"));
    try {
        if (Array.isArray(argValue)) {
            await Promise.all(argValue.map(argItem => validateOrReject(argItem, validatorOptions)));
        }
        else {
            await validateOrReject(argValue, validatorOptions);
        }
        return argValue;
    }
    catch (err) {
        throw new ArgumentValidationError_1.ArgumentValidationError(err);
    }
}
exports.validateArg = validateArg;
