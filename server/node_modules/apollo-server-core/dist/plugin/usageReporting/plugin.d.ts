import { Trace } from 'apollo-reporting-protobuf';
import { Headers } from 'apollo-server-env';
import { ApolloServerPluginUsageReportingOptions, SendValuesBaseOptions } from './options';
import type { InternalApolloServerPlugin } from '../internalPlugin';
export declare function ApolloServerPluginUsageReporting<TContext>(options?: ApolloServerPluginUsageReportingOptions<TContext>): InternalApolloServerPlugin;
export declare function makeHTTPRequestHeaders(http: Trace.IHTTP, headers: Headers, sendHeaders?: SendValuesBaseOptions): void;
export declare function ApolloServerPluginUsageReportingDisabled(): InternalApolloServerPlugin;
//# sourceMappingURL=plugin.d.ts.map