"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Directive = void 0;
const errors_1 = require("../errors");
const getMetadataStorage_1 = require("../metadata/getMetadataStorage");
function Directive(nameOrDefinition) {
    return (targetOrPrototype, propertyKey, _descriptor) => {
        const directive = { nameOrDefinition, args: {} };
        if (typeof propertyKey === "symbol") {
            throw new errors_1.SymbolKeysNotSupportedError();
        }
        if (propertyKey) {
            getMetadataStorage_1.getMetadataStorage().collectDirectiveFieldMetadata({
                target: targetOrPrototype.constructor,
                fieldName: propertyKey,
                directive,
            });
        }
        else {
            getMetadataStorage_1.getMetadataStorage().collectDirectiveClassMetadata({
                target: targetOrPrototype,
                directive,
            });
        }
    };
}
exports.Directive = Directive;
