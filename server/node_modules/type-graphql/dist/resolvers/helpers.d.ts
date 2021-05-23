import { PubSubEngine } from "graphql-subscriptions";
import { ParamMetadata } from "../metadata/definitions";
import { ResolverData, AuthChecker, AuthMode } from "../interfaces";
import { Middleware } from "../interfaces/Middleware";
import { IOCContainer } from "../utils/container";
import { ValidateSettings } from "../schema/build-context";
export declare function getParams(params: ParamMetadata[], resolverData: ResolverData<any>, globalValidate: ValidateSettings, pubSub: PubSubEngine): Promise<any[]> | any[];
export declare function applyAuthChecker(middlewares: Array<Middleware<any>>, authMode: AuthMode, authChecker?: AuthChecker<any, any>, roles?: any[]): void;
export declare function applyMiddlewares(container: IOCContainer, resolverData: ResolverData<any>, middlewares: Array<Middleware<any>>, resolverHandlerFunction: () => any): Promise<any>;
