import { ReturnTypeFunc, AdvancedOptions } from "./types";
export declare function FieldResolver(): MethodDecorator;
export declare function FieldResolver(options: AdvancedOptions): MethodDecorator;
export declare function FieldResolver(returnTypeFunction?: ReturnTypeFunc, options?: AdvancedOptions): MethodDecorator;
