import { DescriptionOptions, AbstractClassOptions, ResolveTypeOptions, ImplementsClassOptions } from "./types";
export declare type InterfaceTypeOptions = DescriptionOptions & AbstractClassOptions & ResolveTypeOptions & ImplementsClassOptions & {
    /**
     * Set to false to prevent emitting in schema all object types
     * that implements this interface type.
     */
    autoRegisterImplementations?: boolean;
};
export declare function InterfaceType(): ClassDecorator;
export declare function InterfaceType(options: InterfaceTypeOptions): ClassDecorator;
export declare function InterfaceType(name: string, options?: InterfaceTypeOptions): ClassDecorator;
