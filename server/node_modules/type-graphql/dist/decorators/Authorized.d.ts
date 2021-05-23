import { MethodAndPropDecorator } from "./types";
export declare function Authorized(): MethodAndPropDecorator;
export declare function Authorized<RoleType = string>(roles: RoleType[]): MethodAndPropDecorator;
export declare function Authorized<RoleType = string>(...roles: RoleType[]): MethodAndPropDecorator;
