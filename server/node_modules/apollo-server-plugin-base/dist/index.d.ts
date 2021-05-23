import { AnyFunctionMap, BaseContext, GraphQLServiceContext, GraphQLRequestContext, GraphQLRequest, GraphQLResponse, ValueOrPromise, WithRequired, GraphQLFieldResolverParams, GraphQLRequestContextDidResolveSource, GraphQLRequestContextParsingDidStart, GraphQLRequestContextValidationDidStart, GraphQLRequestContextDidResolveOperation, GraphQLRequestContextDidEncounterErrors, GraphQLRequestContextResponseForOperation, GraphQLRequestContextExecutionDidStart, GraphQLRequestContextWillSendResponse } from 'apollo-server-types';
export { BaseContext, GraphQLServiceContext, GraphQLRequestContext, GraphQLRequest, GraphQLResponse, ValueOrPromise, WithRequired, GraphQLFieldResolverParams, GraphQLRequestContextDidResolveSource, GraphQLRequestContextParsingDidStart, GraphQLRequestContextValidationDidStart, GraphQLRequestContextDidResolveOperation, GraphQLRequestContextDidEncounterErrors, GraphQLRequestContextResponseForOperation, GraphQLRequestContextExecutionDidStart, GraphQLRequestContextWillSendResponse, };
export interface ApolloServerPlugin<TContext extends BaseContext = BaseContext> {
    serverWillStart?(service: GraphQLServiceContext): ValueOrPromise<GraphQLServerListener | void>;
    requestDidStart?(requestContext: GraphQLRequestContext<TContext>): GraphQLRequestListener<TContext> | void;
}
export interface GraphQLServerListener {
    serverWillStop?(): ValueOrPromise<void>;
}
export declare type GraphQLRequestListenerParsingDidEnd = (err?: Error) => void;
export declare type GraphQLRequestListenerValidationDidEnd = ((err?: ReadonlyArray<Error>) => void);
export declare type GraphQLRequestListenerExecutionDidEnd = ((err?: Error) => void);
export declare type GraphQLRequestListenerDidResolveField = ((error: Error | null, result?: any) => void);
export interface GraphQLRequestListener<TContext extends BaseContext = BaseContext> extends AnyFunctionMap {
    didResolveSource?(requestContext: GraphQLRequestContextDidResolveSource<TContext>): ValueOrPromise<void>;
    parsingDidStart?(requestContext: GraphQLRequestContextParsingDidStart<TContext>): GraphQLRequestListenerParsingDidEnd | void;
    validationDidStart?(requestContext: GraphQLRequestContextValidationDidStart<TContext>): GraphQLRequestListenerValidationDidEnd | void;
    didResolveOperation?(requestContext: GraphQLRequestContextDidResolveOperation<TContext>): ValueOrPromise<void>;
    didEncounterErrors?(requestContext: GraphQLRequestContextDidEncounterErrors<TContext>): ValueOrPromise<void>;
    responseForOperation?(requestContext: GraphQLRequestContextResponseForOperation<TContext>): ValueOrPromise<GraphQLResponse | null>;
    executionDidStart?(requestContext: GraphQLRequestContextExecutionDidStart<TContext>): GraphQLRequestExecutionListener | GraphQLRequestListenerExecutionDidEnd | void;
    willSendResponse?(requestContext: GraphQLRequestContextWillSendResponse<TContext>): ValueOrPromise<void>;
}
export interface GraphQLRequestExecutionListener<TContext extends BaseContext = BaseContext> extends AnyFunctionMap {
    executionDidEnd?: GraphQLRequestListenerExecutionDidEnd;
    willResolveField?(fieldResolverParams: GraphQLFieldResolverParams<any, TContext>): GraphQLRequestListenerDidResolveField | void;
}
//# sourceMappingURL=index.d.ts.map