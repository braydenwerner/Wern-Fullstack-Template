"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubSub = void 0;
const getMetadataStorage_1 = require("../metadata/getMetadataStorage");
const errors_1 = require("../errors");
function PubSub(triggerKey) {
    return (prototype, propertyKey, parameterIndex) => {
        if (typeof propertyKey === "symbol") {
            throw new errors_1.SymbolKeysNotSupportedError();
        }
        getMetadataStorage_1.getMetadataStorage().collectHandlerParamMetadata({
            kind: "pubSub",
            target: prototype.constructor,
            methodName: propertyKey,
            index: parameterIndex,
            triggerKey,
        });
    };
}
exports.PubSub = PubSub;
