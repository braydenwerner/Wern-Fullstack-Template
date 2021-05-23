import { GraphQLSchema } from 'graphql/type';
export declare const symbolExecutionDispatcherWillResolveField: unique symbol;
export declare const symbolUserFieldResolver: unique symbol;
export declare const symbolPluginsEnabled: unique symbol;
export declare function enablePluginsForSchemaResolvers(schema: GraphQLSchema & {
    [symbolPluginsEnabled]?: boolean;
}): GraphQLSchema & {
    [symbolPluginsEnabled]?: boolean | undefined;
};
export declare function whenResultIsFinished(result: any, callback: (err: Error | null, result?: any) => void): void;
//# sourceMappingURL=schemaInstrumentation.d.ts.map