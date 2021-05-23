import { GraphQLScalarType } from "graphql";
import type { ValidatorOptions } from "class-validator";
import { PubSubEngine, PubSubOptions } from "graphql-subscriptions";
import { AuthChecker, AuthMode } from "../interfaces";
import { Middleware } from "../interfaces/Middleware";
import { ContainerType, ContainerGetter, IOCContainer } from "../utils/container";
import { ValidatorFn } from "../interfaces/ValidatorFn";
export declare type DateScalarMode = "isoDate" | "timestamp";
export interface ScalarsTypeMap {
    type: Function;
    scalar: GraphQLScalarType;
}
export declare type ValidateSettings = boolean | ValidatorOptions | ValidatorFn<object>;
export interface BuildContextOptions {
    dateScalarMode?: DateScalarMode;
    scalarsMap?: ScalarsTypeMap[];
    /**
     * Indicates if class-validator should be used to auto validate objects injected into params.
     * You can directly pass validator options to enable validator with a given options.
     * Also, you can provide your own validation function to check the args.
     */
    validate?: ValidateSettings;
    authChecker?: AuthChecker<any, any>;
    authMode?: AuthMode;
    pubSub?: PubSubEngine | PubSubOptions;
    globalMiddlewares?: Array<Middleware<any>>;
    container?: ContainerType | ContainerGetter<any>;
    /**
     * Default value for type decorators, like `@Field({ nullable: true })`
     */
    nullableByDefault?: boolean;
}
export declare abstract class BuildContext {
    static dateScalarMode: DateScalarMode;
    static scalarsMaps: ScalarsTypeMap[];
    static validate: ValidateSettings;
    static authChecker?: AuthChecker<any, any>;
    static authMode: AuthMode;
    static pubSub: PubSubEngine;
    static globalMiddlewares: Array<Middleware<any>>;
    static container: IOCContainer;
    static nullableByDefault: boolean;
    /**
     * Set static fields with current building context data
     */
    static create(options: BuildContextOptions): void;
    /**
     * Restore default settings
     */
    static reset(): void;
}
