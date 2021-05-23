"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const getMetadataStorage_1 = require("../metadata/getMetadataStorage");
const resolver_metadata_1 = require("../helpers/resolver-metadata");
const decorators_1 = require("../helpers/decorators");
const errors_1 = require("../errors");
function Subscription(returnTypeFuncOrOptions, maybeOptions) {
    const params = decorators_1.getTypeDecoratorParams(returnTypeFuncOrOptions, maybeOptions);
    const options = params.options;
    return (prototype, methodName) => {
        const metadata = resolver_metadata_1.getResolverMetadata(prototype, methodName, params.returnTypeFunc, options);
        if (Array.isArray(options.topics) && options.topics.length === 0) {
            throw new errors_1.MissingSubscriptionTopicsError(metadata.target, metadata.methodName);
        }
        getMetadataStorage_1.getMetadataStorage().collectSubscriptionHandlerMetadata({
            ...metadata,
            topics: options.topics,
            filter: options.filter,
            subscribe: options.subscribe,
        });
    };
}
exports.Subscription = Subscription;
