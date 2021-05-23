import { DescriptionOptions, AbstractClassOptions } from "./types";
export declare type InputTypeOptions = DescriptionOptions & AbstractClassOptions;
export declare function InputType(): ClassDecorator;
export declare function InputType(options: InputTypeOptions): ClassDecorator;
export declare function InputType(name: string, options?: InputTypeOptions): ClassDecorator;
