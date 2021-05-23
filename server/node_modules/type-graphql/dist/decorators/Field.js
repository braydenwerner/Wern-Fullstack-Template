"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
const getMetadataStorage_1 = require("../metadata/getMetadataStorage");
const findType_1 = require("../helpers/findType");
const decorators_1 = require("../helpers/decorators");
const errors_1 = require("../errors");
function Field(returnTypeFuncOrOptions, maybeOptions) {
    return (prototype, propertyKey, descriptor) => {
        if (typeof propertyKey === "symbol") {
            throw new errors_1.SymbolKeysNotSupportedError();
        }
        const { options, returnTypeFunc } = decorators_1.getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
        const isResolver = Boolean(descriptor);
        const isResolverMethod = Boolean(descriptor && descriptor.value);
        const { getType, typeOptions } = findType_1.findType({
            metadataKey: isResolverMethod ? "design:returntype" : "design:type",
            prototype,
            propertyKey,
            returnTypeFunc,
            typeOptions: options,
        });
        getMetadataStorage_1.getMetadataStorage().collectClassFieldMetadata({
            name: propertyKey,
            schemaName: options.name || propertyKey,
            getType,
            typeOptions,
            complexity: options.complexity,
            target: prototype.constructor,
            description: options.description,
            deprecationReason: options.deprecationReason,
            simple: options.simple,
        });
        if (isResolver) {
            getMetadataStorage_1.getMetadataStorage().collectFieldResolverMetadata({
                kind: "internal",
                methodName: propertyKey,
                schemaName: options.name || propertyKey,
                target: prototype.constructor,
                complexity: options.complexity,
            });
        }
    };
}
exports.Field = Field;
