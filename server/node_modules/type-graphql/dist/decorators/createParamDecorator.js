"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParamDecorator = void 0;
const getMetadataStorage_1 = require("../metadata/getMetadataStorage");
const errors_1 = require("../errors");
function createParamDecorator(resolver) {
    return (prototype, propertyKey, parameterIndex) => {
        if (typeof propertyKey === "symbol") {
            throw new errors_1.SymbolKeysNotSupportedError();
        }
        getMetadataStorage_1.getMetadataStorage().collectHandlerParamMetadata({
            kind: "custom",
            target: prototype.constructor,
            methodName: propertyKey,
            index: parameterIndex,
            resolver,
        });
    };
}
exports.createParamDecorator = createParamDecorator;
