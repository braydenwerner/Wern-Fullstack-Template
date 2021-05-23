"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = void 0;
const getMetadataStorage_1 = require("../metadata/getMetadataStorage");
const resolver_metadata_1 = require("../helpers/resolver-metadata");
const decorators_1 = require("../helpers/decorators");
function Mutation(returnTypeFuncOrOptions, maybeOptions) {
    const { options, returnTypeFunc } = decorators_1.getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
    return (prototype, methodName) => {
        const metadata = resolver_metadata_1.getResolverMetadata(prototype, methodName, returnTypeFunc, options);
        getMetadataStorage_1.getMetadataStorage().collectMutationHandlerMetadata(metadata);
    };
}
exports.Mutation = Mutation;
