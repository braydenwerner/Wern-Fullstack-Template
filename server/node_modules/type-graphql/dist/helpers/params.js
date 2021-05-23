"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParamInfo = void 0;
const findType_1 = require("./findType");
const errors_1 = require("../errors");
function getParamInfo({ prototype, propertyKey, parameterIndex, argName, returnTypeFunc, options = {}, }) {
    if (typeof propertyKey === "symbol") {
        throw new errors_1.SymbolKeysNotSupportedError();
    }
    const { getType, typeOptions } = findType_1.findType({
        metadataKey: "design:paramtypes",
        prototype,
        propertyKey,
        parameterIndex,
        argName,
        returnTypeFunc,
        typeOptions: options,
    });
    return {
        target: prototype.constructor,
        methodName: propertyKey,
        index: parameterIndex,
        getType,
        typeOptions,
        validate: options.validate,
    };
}
exports.getParamInfo = getParamInfo;
