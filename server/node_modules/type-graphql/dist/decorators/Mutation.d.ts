import { ReturnTypeFunc, AdvancedOptions } from "./types";
export declare function Mutation(): MethodDecorator;
export declare function Mutation(options: AdvancedOptions): MethodDecorator;
export declare function Mutation(returnTypeFunc: ReturnTypeFunc, options?: AdvancedOptions): MethodDecorator;
