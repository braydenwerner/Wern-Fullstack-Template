import { ValidateOptions, ReturnTypeFunc } from "./types";
export declare function Args(): ParameterDecorator;
export declare function Args(options: ValidateOptions): ParameterDecorator;
export declare function Args(paramTypeFunction: ReturnTypeFunc, options?: ValidateOptions): ParameterDecorator;
