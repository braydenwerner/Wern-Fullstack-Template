import { MiddlewareFn } from "../interfaces/Middleware";
import { AuthChecker, AuthMode } from "../interfaces";
export declare function AuthMiddleware(authChecker: AuthChecker<any, any>, authMode: AuthMode, roles: any[]): MiddlewareFn;
