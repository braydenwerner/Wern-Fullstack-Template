"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Root = void 0;
const getMetadataStorage_1 = require("../metadata/getMetadataStorage");
const findType_1 = require("../helpers/findType");
const errors_1 = require("../errors");
function Root(propertyName) {
    return (prototype, propertyKey, parameterIndex) => {
        if (typeof propertyKey === "symbol") {
            throw new errors_1.SymbolKeysNotSupportedError();
        }
        let getType;
        try {
            const typeInfo = findType_1.findType({
                metadataKey: "design:paramtypes",
                prototype,
                propertyKey,
                parameterIndex,
            });
            getType = typeInfo.getType;
        }
        catch (_a) {
            // tslint:disable-next-line:no-empty
        }
        getMetadataStorage_1.getMetadataStorage().collectHandlerParamMetadata({
            kind: "root",
            target: prototype.constructor,
            methodName: propertyKey,
            index: parameterIndex,
            propertyName,
            getType,
        });
    };
}
exports.Root = Root;
