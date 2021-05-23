import { ResolverMetadata } from "../metadata/definitions";
import { ReturnTypeFunc, AdvancedOptions } from "../decorators/types";
export declare function getResolverMetadata(prototype: object, propertyKey: string | symbol, returnTypeFunc?: ReturnTypeFunc, options?: AdvancedOptions): ResolverMetadata;
