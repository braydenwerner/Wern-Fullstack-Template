"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineApolloConfig = void 0;
const createSHA_1 = __importDefault(require("./utils/createSHA"));
function determineApolloConfig(input, engine, logger) {
    if (input && engine !== undefined) {
        throw Error('Cannot pass both `apollo` and `engine`');
    }
    const apolloConfig = { graphVariant: 'current' };
    const { APOLLO_KEY, APOLLO_GRAPH_ID, APOLLO_GRAPH_VARIANT, ENGINE_API_KEY, ENGINE_SCHEMA_TAG, } = process.env;
    if (input === null || input === void 0 ? void 0 : input.key) {
        apolloConfig.key = input.key;
    }
    else if (typeof engine === 'object' && engine.apiKey) {
        apolloConfig.key = engine.apiKey;
    }
    else if (APOLLO_KEY) {
        if (ENGINE_API_KEY) {
            logger.warn('Using `APOLLO_KEY` since `ENGINE_API_KEY` (deprecated) is also set in the environment.');
        }
        apolloConfig.key = APOLLO_KEY;
    }
    else if (ENGINE_API_KEY) {
        logger.warn('[deprecated] The `ENGINE_API_KEY` environment variable has been renamed to `APOLLO_KEY`.');
        apolloConfig.key = ENGINE_API_KEY;
    }
    if (apolloConfig.key) {
        apolloConfig.keyHash = createSHA_1.default('sha512')
            .update(apolloConfig.key)
            .digest('hex');
    }
    if (input === null || input === void 0 ? void 0 : input.graphId) {
        apolloConfig.graphId = input.graphId;
    }
    else if (APOLLO_GRAPH_ID) {
        apolloConfig.graphId = APOLLO_GRAPH_ID;
    }
    else if (apolloConfig.key) {
        const parts = apolloConfig.key.split(':', 2);
        if (parts[0] === 'service') {
            apolloConfig.graphId = parts[1];
        }
    }
    if (input === null || input === void 0 ? void 0 : input.graphVariant) {
        apolloConfig.graphVariant = input.graphVariant;
    }
    else if (typeof engine === 'object' && engine.graphVariant) {
        if (engine.schemaTag) {
            throw new Error('Cannot set more than one of apollo.graphVariant, ' +
                'engine.graphVariant, and engine.schemaTag. Please use apollo.graphVariant.');
        }
        apolloConfig.graphVariant = engine.graphVariant;
    }
    else if (typeof engine === 'object' && engine.schemaTag) {
        logger.warn('[deprecated] The `engine.schemaTag` option has been renamed to `apollo.graphVariant` ' +
            '(or you may set it with the `APOLLO_GRAPH_VARIANT` environment variable).');
        apolloConfig.graphVariant = engine.schemaTag;
    }
    else if (APOLLO_GRAPH_VARIANT) {
        if (ENGINE_SCHEMA_TAG) {
            throw new Error('`APOLLO_GRAPH_VARIANT` and `ENGINE_SCHEMA_TAG` (deprecated) environment variables must not both be set.');
        }
        apolloConfig.graphVariant = APOLLO_GRAPH_VARIANT;
    }
    else if (ENGINE_SCHEMA_TAG) {
        logger.warn('[deprecated] The `ENGINE_SCHEMA_TAG` environment variable has been renamed to `APOLLO_GRAPH_VARIANT`.');
        apolloConfig.graphVariant = ENGINE_SCHEMA_TAG;
    }
    else if (apolloConfig.key) {
        logger.warn('No graph variant provided. Defaulting to `current`.');
    }
    return apolloConfig;
}
exports.determineApolloConfig = determineApolloConfig;
//# sourceMappingURL=determineApolloConfig.js.map