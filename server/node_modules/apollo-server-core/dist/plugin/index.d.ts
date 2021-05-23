import type { ApolloServerPlugin } from 'apollo-server-plugin-base';
import type { ApolloServerPluginUsageReportingOptions, EngineReportingOptions } from './usageReporting';
export type { ApolloServerPluginUsageReportingOptions, SendValuesBaseOptions, VariableValueOptions, ClientInfo, GenerateClientInfo, EngineReportingOptions, } from './usageReporting';
import type { ApolloServerPluginSchemaReportingOptions } from './schemaReporting';
export type { ApolloServerPluginSchemaReportingOptions } from './schemaReporting';
import type { ApolloServerPluginInlineTraceOptions } from './inlineTrace';
export type { ApolloServerPluginInlineTraceOptions } from './inlineTrace';
export declare function ApolloServerPluginUsageReporting<TContext>(options?: ApolloServerPluginUsageReportingOptions<TContext>): ApolloServerPlugin;
export declare function ApolloServerPluginUsageReportingDisabled(): ApolloServerPlugin;
export declare function ApolloServerPluginUsageReportingFromLegacyOptions<TContext>(options?: EngineReportingOptions<TContext>): ApolloServerPlugin;
export declare function ApolloServerPluginSchemaReporting(options?: ApolloServerPluginSchemaReportingOptions): ApolloServerPlugin;
export declare function ApolloServerPluginInlineTrace(options?: ApolloServerPluginInlineTraceOptions): ApolloServerPlugin;
export declare function ApolloServerPluginInlineTraceDisabled(): ApolloServerPlugin;
//# sourceMappingURL=index.d.ts.map