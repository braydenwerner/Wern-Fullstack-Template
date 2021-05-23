"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseMiddleware = void 0;
const errors_1 = require("../errors");
const getMetadataStorage_1 = require("../metadata/getMetadataStorage");
const decorators_1 = require("../helpers/decorators");
function UseMiddleware(...middlewaresOrMiddlewareArray) {
    const middlewares = decorators_1.getArrayFromOverloadedRest(middlewaresOrMiddlewareArray);
    return (prototype, propertyKey, descriptor) => {
        if (typeof propertyKey === "symbol") {
            throw new errors_1.SymbolKeysNotSupportedError();
        }
        getMetadataStorage_1.getMetadataStorage().collectMiddlewareMetadata({
            target: prototype.constructor,
            fieldName: propertyKey,
            middlewares,
        });
    };
}
exports.UseMiddleware = UseMiddleware;
