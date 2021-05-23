"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resolver = void 0;
const getMetadataStorage_1 = require("../metadata/getMetadataStorage");
function Resolver(objectTypeOrTypeFuncOrMaybeOptions, maybeOptions) {
    const objectTypeOrTypeFunc = typeof objectTypeOrTypeFuncOrMaybeOptions === "function"
        ? objectTypeOrTypeFuncOrMaybeOptions
        : undefined;
    const options = (typeof objectTypeOrTypeFuncOrMaybeOptions === "function"
        ? maybeOptions
        : objectTypeOrTypeFuncOrMaybeOptions) || {};
    return target => {
        const getObjectType = objectTypeOrTypeFunc
            ? objectTypeOrTypeFunc.prototype
                ? () => objectTypeOrTypeFunc
                : objectTypeOrTypeFunc
            : () => {
                throw new Error(`No provided object type in '@Resolver' decorator for class '${target.name}!'`);
            };
        getMetadataStorage_1.getMetadataStorage().collectResolverClassMetadata({
            target,
            getObjectType,
            isAbstract: options.isAbstract || false,
        });
    };
}
exports.Resolver = Resolver;
