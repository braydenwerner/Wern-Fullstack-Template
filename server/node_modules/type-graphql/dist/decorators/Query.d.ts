import { ReturnTypeFunc, AdvancedOptions } from "./types";
export declare function Query(): MethodDecorator;
export declare function Query(options: AdvancedOptions): MethodDecorator;
export declare function Query(returnTypeFunc: ReturnTypeFunc, options?: AdvancedOptions): MethodDecorator;
