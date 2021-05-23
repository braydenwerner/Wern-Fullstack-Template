"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApolloServerPluginInlineTraceDisabled = exports.ApolloServerPluginInlineTrace = exports.ApolloServerPluginSchemaReporting = exports.ApolloServerPluginUsageReportingFromLegacyOptions = exports.ApolloServerPluginUsageReportingDisabled = exports.ApolloServerPluginUsageReporting = void 0;
function ApolloServerPluginUsageReporting(options = Object.create(null)) {
    return require('./usageReporting').ApolloServerPluginUsageReporting(options);
}
exports.ApolloServerPluginUsageReporting = ApolloServerPluginUsageReporting;
function ApolloServerPluginUsageReportingDisabled() {
    return require('./usageReporting').ApolloServerPluginUsageReportingDisabled();
}
exports.ApolloServerPluginUsageReportingDisabled = ApolloServerPluginUsageReportingDisabled;
function ApolloServerPluginUsageReportingFromLegacyOptions(options = Object.create(null)) {
    return require('./usageReporting').ApolloServerPluginUsageReportingFromLegacyOptions(options);
}
exports.ApolloServerPluginUsageReportingFromLegacyOptions = ApolloServerPluginUsageReportingFromLegacyOptions;
function ApolloServerPluginSchemaReporting(options = Object.create(null)) {
    return require('./schemaReporting').ApolloServerPluginSchemaReporting(options);
}
exports.ApolloServerPluginSchemaReporting = ApolloServerPluginSchemaReporting;
function ApolloServerPluginInlineTrace(options = Object.create(null)) {
    return require('./inlineTrace').ApolloServerPluginInlineTrace(options);
}
exports.ApolloServerPluginInlineTrace = ApolloServerPluginInlineTrace;
function ApolloServerPluginInlineTraceDisabled() {
    return require('./inlineTrace').ApolloServerPluginInlineTraceDisabled();
}
exports.ApolloServerPluginInlineTraceDisabled = ApolloServerPluginInlineTraceDisabled;
//# sourceMappingURL=index.js.map