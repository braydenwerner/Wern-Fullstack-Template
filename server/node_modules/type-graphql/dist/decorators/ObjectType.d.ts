import { DescriptionOptions, AbstractClassOptions, ImplementsClassOptions } from "./types";
export declare type ObjectTypeOptions = DescriptionOptions & AbstractClassOptions & ImplementsClassOptions & {
    /** Set to `true` to disable auth and all middlewares stack for all this Object Type fields resolvers */
    simpleResolvers?: boolean;
};
export declare function ObjectType(): ClassDecorator;
export declare function ObjectType(options: ObjectTypeOptions): ClassDecorator;
export declare function ObjectType(name: string, options?: ObjectTypeOptions): ClassDecorator;
