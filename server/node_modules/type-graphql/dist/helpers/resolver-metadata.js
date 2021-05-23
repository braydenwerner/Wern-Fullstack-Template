"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResolverMetadata = void 0;
const findType_1 = require("./findType");
const errors_1 = require("../errors");
function getResolverMetadata(prototype, propertyKey, returnTypeFunc, options = {}) {
    if (typeof propertyKey === "symbol") {
        throw new errors_1.SymbolKeysNotSupportedError();
    }
    const { getType, typeOptions } = findType_1.findType({
        metadataKey: "design:returntype",
        prototype,
        propertyKey,
        returnTypeFunc,
        typeOptions: options,
    });
    const methodName = propertyKey;
    return {
        methodName,
        schemaName: options.name || methodName,
        target: prototype.constructor,
        getReturnType: getType,
        returnTypeOptions: typeOptions,
        description: options.description,
        deprecationReason: options.deprecationReason,
        complexity: options.complexity,
    };
}
exports.getResolverMetadata = getResolverMetadata;
