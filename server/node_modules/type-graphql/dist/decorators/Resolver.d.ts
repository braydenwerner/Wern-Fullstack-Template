import { ClassTypeResolver, AbstractClassOptions } from "./types";
import { ClassType } from "../interfaces";
export declare function Resolver(): ClassDecorator;
export declare function Resolver(options: AbstractClassOptions): ClassDecorator;
export declare function Resolver(typeFunc: ClassTypeResolver, options?: AbstractClassOptions): ClassDecorator;
export declare function Resolver(objectType: ClassType, options?: AbstractClassOptions): ClassDecorator;
