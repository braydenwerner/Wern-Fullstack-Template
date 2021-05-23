import { ReturnTypeFunc, DecoratorTypeOptions, DescriptionOptions, ValidateOptions } from "./types";
export declare type ArgOptions = DecoratorTypeOptions & DescriptionOptions & ValidateOptions;
export declare function Arg(name: string, options?: ArgOptions): ParameterDecorator;
export declare function Arg(name: string, returnTypeFunc: ReturnTypeFunc, options?: ArgOptions): ParameterDecorator;
