import { WithRequired, GraphQLRequest, GraphQLRequestContextExecutionDidStart, GraphQLResponse, ValueOrPromise, GraphQLRequestContextWillSendResponse, Logger } from 'apollo-server-types';
import { GraphQLSchema } from 'graphql/type';
import { CacheHint } from 'apollo-cache-control';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';
declare type IPluginTestHarnessGraphqlRequest = WithRequired<GraphQLRequest, 'query'>;
declare type IPluginTestHarnessExecutionDidStart<TContext> = GraphQLRequestContextExecutionDidStart<TContext> & {
    request: IPluginTestHarnessGraphqlRequest;
};
export default function pluginTestHarness<TContext>({ pluginInstance, schema, logger, graphqlRequest, overallCachePolicy, executor, context }: {
    pluginInstance: ApolloServerPlugin<TContext>;
    schema?: GraphQLSchema;
    logger?: Logger;
    graphqlRequest: IPluginTestHarnessGraphqlRequest;
    overallCachePolicy?: Required<CacheHint>;
    executor: (requestContext: IPluginTestHarnessExecutionDidStart<TContext>) => ValueOrPromise<GraphQLResponse>;
    context?: TContext;
}): Promise<GraphQLRequestContextWillSendResponse<TContext>>;
export {};
//# sourceMappingURL=pluginTestHarness.d.ts.map