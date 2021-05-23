"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legacyOptionsToPluginOptions = exports.ApolloServerPluginUsageReportingFromLegacyOptions = void 0;
const graphql_1 = require("graphql");
const plugin_1 = require("./plugin");
function ApolloServerPluginUsageReportingFromLegacyOptions(options = Object.create(null)) {
    return plugin_1.ApolloServerPluginUsageReporting(legacyOptionsToPluginOptions(options));
}
exports.ApolloServerPluginUsageReportingFromLegacyOptions = ApolloServerPluginUsageReportingFromLegacyOptions;
function legacyOptionsToPluginOptions(engine) {
    var _a;
    const pluginOptions = {};
    pluginOptions.calculateSignature = engine.calculateSignature;
    pluginOptions.reportIntervalMs = engine.reportIntervalMs;
    pluginOptions.maxUncompressedReportSize = engine.maxUncompressedReportSize;
    pluginOptions.endpointUrl = (_a = engine.tracesEndpointUrl) !== null && _a !== void 0 ? _a : engine.endpointUrl;
    pluginOptions.debugPrintReports = engine.debugPrintReports;
    pluginOptions.requestAgent = engine.requestAgent;
    pluginOptions.maxAttempts = engine.maxAttempts;
    pluginOptions.minimumRetryDelayMs = engine.minimumRetryDelayMs;
    pluginOptions.reportErrorFunction = engine.reportErrorFunction;
    pluginOptions.sendVariableValues = engine.sendVariableValues;
    if (typeof engine.reportTiming === 'function') {
        pluginOptions.includeRequest = engine.reportTiming;
    }
    pluginOptions.sendHeaders = engine.sendHeaders;
    pluginOptions.sendReportsImmediately = engine.sendReportsImmediately;
    if (engine.maskErrorDetails && engine.rewriteError) {
        throw new Error("Can't set both maskErrorDetails and rewriteError!");
    }
    else if (engine.rewriteError && typeof engine.rewriteError !== 'function') {
        throw new Error('rewriteError must be a function');
    }
    else if (engine.maskErrorDetails) {
        pluginOptions.rewriteError = () => new graphql_1.GraphQLError('<masked>');
        delete engine.maskErrorDetails;
    }
    else if (engine.rewriteError) {
        pluginOptions.rewriteError = engine.rewriteError;
    }
    pluginOptions.generateClientInfo = engine.generateClientInfo;
    pluginOptions.logger = engine.logger;
    if (typeof engine.privateVariables !== 'undefined' &&
        engine.sendVariableValues) {
        throw new Error("You have set both the 'sendVariableValues' and the deprecated 'privateVariables' options. " +
            "Please only set 'sendVariableValues' (ideally, when calling `ApolloServerPluginUsageReporting` " +
            'instead of the deprecated `engine` option to the `ApolloServer` constructor).');
    }
    else if (typeof engine.privateVariables !== 'undefined') {
        if (engine.privateVariables !== null) {
            pluginOptions.sendVariableValues = makeSendValuesBaseOptionsFromLegacy(engine.privateVariables);
        }
    }
    else {
        pluginOptions.sendVariableValues = engine.sendVariableValues;
    }
    if (typeof engine.privateHeaders !== 'undefined' && engine.sendHeaders) {
        throw new Error("You have set both the 'sendHeaders' and the deprecated 'privateVariables' options. " +
            "Please only set 'sendHeaders' (ideally, when calling `ApolloServerPluginUsageReporting` " +
            'instead of the deprecated `engine` option to the `ApolloServer` constructor).');
    }
    else if (typeof engine.privateHeaders !== 'undefined') {
        if (engine.privateHeaders !== null) {
            pluginOptions.sendHeaders = makeSendValuesBaseOptionsFromLegacy(engine.privateHeaders);
        }
    }
    else {
        pluginOptions.sendHeaders = engine.sendHeaders;
    }
    return pluginOptions;
}
exports.legacyOptionsToPluginOptions = legacyOptionsToPluginOptions;
function makeSendValuesBaseOptionsFromLegacy(legacyPrivateOption) {
    return Array.isArray(legacyPrivateOption)
        ? {
            exceptNames: legacyPrivateOption,
        }
        : legacyPrivateOption
            ? { none: true }
            : { all: true };
}
//# sourceMappingURL=legacyOptions.js.map