import type { InternalApolloServerPlugin } from '../internalPlugin';
export interface ApolloServerPluginSchemaReportingOptions {
    initialDelayMaxMs?: number;
    overrideReportedSchema?: string;
    endpointUrl?: string;
}
export declare function ApolloServerPluginSchemaReporting({ initialDelayMaxMs, overrideReportedSchema, endpointUrl, }?: ApolloServerPluginSchemaReportingOptions): InternalApolloServerPlugin;
export declare function computeExecutableSchemaId(schema: string): string;
//# sourceMappingURL=index.d.ts.map