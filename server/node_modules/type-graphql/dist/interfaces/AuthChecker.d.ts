import { ResolverData } from "./ResolverData";
export declare type AuthChecker<ContextType = {}, RoleType = string> = (resolverData: ResolverData<ContextType>, roles: RoleType[]) => boolean | Promise<boolean>;
export declare type AuthMode = "error" | "null";
