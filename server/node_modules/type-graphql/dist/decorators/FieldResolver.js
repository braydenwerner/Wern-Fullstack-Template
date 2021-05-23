"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldResolver = void 0;
const getMetadataStorage_1 = require("../metadata/getMetadataStorage");
const errors_1 = require("../errors");
const decorators_1 = require("../helpers/decorators");
const findType_1 = require("../helpers/findType");
function FieldResolver(returnTypeFuncOrOptions, maybeOptions) {
    return (prototype, propertyKey) => {
        if (typeof propertyKey === "symbol") {
            throw new errors_1.SymbolKeysNotSupportedError();
        }
        let getType;
        let typeOptions;
        const { options, returnTypeFunc } = decorators_1.getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
        // try to get return type info
        try {
            const typeInfo = findType_1.findType({
                metadataKey: "design:returntype",
                prototype,
                propertyKey,
                returnTypeFunc,
                typeOptions: options,
            });
            typeOptions = typeInfo.typeOptions;
            getType = typeInfo.getType;
        }
        catch (_a) {
            // tslint:disable-next-line:no-empty
        }
        getMetadataStorage_1.getMetadataStorage().collectFieldResolverMetadata({
            kind: "external",
            methodName: propertyKey,
            schemaName: options.name || propertyKey,
            target: prototype.constructor,
            getType,
            typeOptions,
            complexity: options.complexity,
            description: options.description,
            deprecationReason: options.deprecationReason,
        });
    };
}
exports.FieldResolver = FieldResolver;
