import { ResponsePath } from 'graphql';
import { ApolloServerPlugin } from "apollo-server-plugin-base";
export interface CacheControlFormat {
    version: 1;
    hints: ({
        path: (string | number)[];
    } & CacheHint)[];
}
export interface CacheHint {
    maxAge?: number;
    scope?: CacheScope;
}
export declare enum CacheScope {
    Public = "PUBLIC",
    Private = "PRIVATE"
}
export interface CacheControlExtensionOptions {
    defaultMaxAge?: number;
    calculateHttpHeaders?: boolean;
    stripFormattedExtensions?: boolean;
}
declare module 'graphql/type/definition' {
    interface GraphQLResolveInfo {
        cacheControl: {
            setCacheHint: (hint: CacheHint) => void;
            cacheHint: CacheHint;
        };
    }
}
declare module 'apollo-server-types' {
    interface GraphQLRequestContext<TContext> {
        overallCachePolicy?: Required<CacheHint> | undefined;
    }
}
declare type MapResponsePathHints = Map<ResponsePath, CacheHint>;
export declare const plugin: (options?: CacheControlExtensionOptions) => ApolloServerPlugin;
declare function computeOverallCachePolicy(hints: MapResponsePathHints): Required<CacheHint> | undefined;
declare function addHint(hints: MapResponsePathHints, path: ResponsePath, hint: CacheHint): void;
export declare const __testing__: {
    addHint: typeof addHint;
    computeOverallCachePolicy: typeof computeOverallCachePolicy;
};
export {};
//# sourceMappingURL=index.d.ts.map