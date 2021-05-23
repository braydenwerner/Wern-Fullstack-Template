"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureReflectMetadataExists = exports.mapMiddlewareMetadataToArray = exports.mapSuperFieldResolverHandlers = exports.mapSuperResolverHandlers = void 0;
const isThrowing_1 = require("../helpers/isThrowing");
const errors_1 = require("../errors");
function mapSuperResolverHandlers(definitions, superResolver, resolverMetadata) {
    return definitions.map(metadata => {
        return metadata.target === superResolver
            ? {
                ...metadata,
                target: resolverMetadata.target,
                resolverClassMetadata: resolverMetadata,
            }
            : metadata;
    });
}
exports.mapSuperResolverHandlers = mapSuperResolverHandlers;
function mapSuperFieldResolverHandlers(definitions, superResolver, resolverMetadata) {
    const superMetadata = mapSuperResolverHandlers(definitions, superResolver, resolverMetadata);
    return superMetadata.map(metadata => {
        return metadata.target === superResolver
            ? {
                ...metadata,
                getObjectType: isThrowing_1.isThrowing(metadata.getObjectType)
                    ? resolverMetadata.getObjectType
                    : metadata.getObjectType,
            }
            : metadata;
    });
}
exports.mapSuperFieldResolverHandlers = mapSuperFieldResolverHandlers;
function mapMiddlewareMetadataToArray(metadata) {
    return metadata
        .map(m => m.middlewares)
        .reduce((middlewares, resultArray) => resultArray.concat(middlewares), []);
}
exports.mapMiddlewareMetadataToArray = mapMiddlewareMetadataToArray;
function ensureReflectMetadataExists() {
    if (typeof Reflect !== "object" ||
        typeof Reflect.decorate !== "function" ||
        typeof Reflect.metadata !== "function") {
        throw new errors_1.ReflectMetadataMissingError();
    }
}
exports.ensureReflectMetadataExists = ensureReflectMetadataExists;
