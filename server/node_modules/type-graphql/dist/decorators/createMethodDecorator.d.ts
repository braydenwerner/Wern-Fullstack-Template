import { MiddlewareFn } from "../interfaces/Middleware";
export declare function createMethodDecorator<TContextType = {}>(resolver: MiddlewareFn<TContextType>): MethodDecorator;
