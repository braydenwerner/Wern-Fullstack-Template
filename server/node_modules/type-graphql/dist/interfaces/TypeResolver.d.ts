import { GraphQLTypeResolver } from "graphql";
import { ClassType } from "./ClassType";
import { MaybePromise, Maybe } from "./Maybe";
export declare type TypeResolver<TSource, TContext> = (...args: Parameters<GraphQLTypeResolver<TSource, TContext>>) => MaybePromise<Maybe<string | ClassType>>;
